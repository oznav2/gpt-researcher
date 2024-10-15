import json
import os
from typing import Dict, List
import re
import time
import logging

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, File, UploadFile, Header, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from backend.server.server_utils import generate_report_files
from backend.server.websocket_manager import WebSocketManager

import shutil
from multi_agents.main import run_research_task
from gpt_researcher.document.document import DocumentLoader
from gpt_researcher.master.actions import stream_output
from gpt_researcher.config.config import Config

from contextlib import asynccontextmanager

config = Config()

# Set up logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

from backend.server.server_utils import (
    sanitize_filename,
    handle_start_command,
    handle_human_feedback,
    generate_report_files,
    send_file_paths,
    get_config_dict,
    update_environment_variables,
    handle_file_upload,
    handle_file_deletion,
    execute_multi_agents,
    handle_websocket_communication,
    extract_command_data
)

# Models


class ResearchRequest(BaseModel):
    task: str
    report_type: str
    agent: str


class ConfigRequest(BaseModel):
    ANTHROPIC_API_KEY: str
    TAVILY_API_KEY: str
    LANGCHAIN_TRACING_V2: str
    LANGCHAIN_API_KEY: str
    OPENAI_API_KEY: str
    DOC_PATH: str
    RETRIEVER: str
    GOOGLE_API_KEY: str = ''
    GOOGLE_CX_KEY: str = ''
    BING_API_KEY: str = ''
    SEARCHAPI_API_KEY: str = ''
    SERPAPI_API_KEY: str = ''
    SERPER_API_KEY: str = ''
    SEARX_URL: str = ''
    EMBEDDING_MODEL: str = ''
    EMBEDDING_PROVIDER: str = ''
    LLM_PROVIDER: str = ''
    OLLAMA_BASE_URL: str = ''
    DEFAULT_LLM_MODEL: str = ''
    FAST_LLM_MODEL: str = ''
    SMART_LLM_MODEL: str = ''
    NEXT_PUBLIC_API_URL: str = ''
    NEXT_PUBLIC_SITE_URL: str = ''
    EXA_API_KEY: str = ''
    NCBI_API_KEY: str = ''
    ANTHROPIC_API_KEY: str = ''


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("outputs", exist_ok=True)
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
    yield

# App initialization
app = FastAPI(lifespan=lifespan)

# Static files and templates
app.mount("/site", StaticFiles(directory="./frontend"), name="site")
app.mount("/static", StaticFiles(directory="./frontend/static"), name="static")

templates = Jinja2Templates(directory="./frontend")

# WebSocket manager
manager = WebSocketManager()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://wow.ilanel.co.il", "https://wow.ilanel.co.il", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Received {request.method} request to {request.url}")
    logger.info(f"Headers: {request.headers}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Constants
DOC_PATH = os.getenv("DOC_PATH", "./my-docs")
if not os.path.exists(DOC_PATH):
    os.makedirs(DOC_PATH)

# Startup event


# @app.on_event("startup")
# def startup_event():
#     os.makedirs("outputs", exist_ok=True)
#     app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
#     os.makedirs(DOC_PATH, exist_ok=True)

# Routes

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "report": None})

def sanitize_filename(filename):
    return re.sub(r"[^\w\s-]", "", filename).strip()

@app.get("/getConfig")
async def get_config(
    langchain_api_key: str = Header(None),
    openai_api_key: str = Header(None),
    tavily_api_key: str = Header(None),
    google_api_key: str = Header(None),
    google_cx_key: str = Header(None),
    bing_api_key: str = Header(None),
    searchapi_api_key: str = Header(None),
    serpapi_api_key: str = Header(None),
    serper_api_key: str = Header(None),
    searx_url: str = Header(None),
    anthropic_api_key: str = Header(None),
    ncbi_api_key: str = Header(None),
    exa_api_key: str = Header(None),
    embedding_model: str = Header(None),
    embedding_provider: str = Header(None),
    llm_provider: str = Header(None),
    ollama_base_url: str = Header(None),
    default_llm_model: str = Header(None),
    fast_llm_model: str = Header(None),
    smart_llm_model: str = Header(None),
    doc_path: str = Header(None),
    retriever: str = Header(None),
    chokidar_usepolling: str = Header(None),
    next_public_api_url: str = Header(None),
    next_public_site_url: str = Header(None)
):
    return get_config_dict(
        langchain_api_key,
        openai_api_key,
        tavily_api_key,
        google_api_key,
        google_cx_key,
        bing_api_key,
        searchapi_api_key,
        serpapi_api_key,
        serper_api_key,
        searx_url,
        anthropic_api_key,
        ncbi_api_key,
        exa_api_key,
        embedding_model,
        embedding_provider,
        llm_provider,
        ollama_base_url,
        default_llm_model,
        fast_llm_model,
        smart_llm_model,
        doc_path,
        retriever,
        chokidar_usepolling,
        next_public_api_url,
        next_public_site_url
    )
@app.post("/setConfig")
async def set_config(config: ConfigRequest):
    updated_keys = []
    config_dict = config.model_dump(exclude_unset=True)
    
    for key, value in config_dict.items():
        if value is not None:
            try:
                os.environ[key] = str(value)
                updated_keys.append(key)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to set {key}: {str(e)}")
    
    if not updated_keys:
        return {"message": "No config values were updated"}
    
    return {
        "message": "Config updated successfully",
        "updated_keys": updated_keys
    }

@app.options("/files/")
async def options_files(request: Request):
    logger.info("Handling OPTIONS request for /files/")
    return JSONResponse(
        status_code=200,
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
        },
    )

@app.get("/files/")
async def list_files():
    files = os.listdir(DOC_PATH)
    print(f"Files in {DOC_PATH}: {files}")
    return {"files": files}


@app.post("/api/multi_agents")
async def run_multi_agents():
    return await execute_multi_agents(manager)


@app.post("/setConfig")
async def set_config(config: ConfigRequest):
    update_environment_variables(config.dict())
    return {"message": "Config updated successfully"}

# FROM OLD SERVER 
# @app.post("/upload/")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         # Ensure the directory exists
#         os.makedirs(DOC_PATH, exist_ok=True)
        
#         file_path = os.path.join(DOC_PATH, file.filename)
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         print(f"File uploaded to {file_path}")
        
#         return {"filename": file.filename, "path": file_path}
#     except Exception as e:
#         print(f"Error uploading file: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    return await handle_file_upload(file, DOC_PATH)

# FROM OLD SERVER 
# @app.delete("/files/{filename}")
# async def delete_file(filename: str):
#     file_path = os.path.join(DOC_PATH, filename)
#     if os.path.exists(file_path):
#         os.remove(file_path)
#         print(f"File deleted: {file_path}")
#         return {"message": "File deleted successfully"}
#     else:
#         print(f"File not found: {file_path}")
#         return JSONResponse(status_code=404, content={"message": "File not found"})

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    return await handle_file_deletion(filename, DOC_PATH)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await handle_websocket_communication(websocket, manager)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)


@app.get("/outputs/{filename}")
async def serve_file(filename: str):
    file_path = f"outputs/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}, 404

# Error handler for 400 Bad Request
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException for {request.url}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": str(exc.detail)},
    )

# Catch-all OPTIONS handler
@app.options("/{full_path:path}")
async def options_handler(request: Request, full_path: str):
    logger.info(f"Handling OPTIONS request for /{full_path}")
    return JSONResponse(
        status_code=200,
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
        },
    )

# Add this new route handler
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    file_name = "favicon.ico"
    file_path = os.path.join("frontend", "static", file_name)
    if os.path.isfile(file_path):
        return FileResponse(path=file_path)
    else:
        return {"message": "Favicon not found"}, 404