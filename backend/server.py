import json
import os
import re
import time
import logging

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, File, UploadFile, Header, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
from typing import Optional

from backend.utils import write_md_to_pdf, write_md_to_word, write_text_to_md
from backend.websocket_manager import WebSocketManager

import shutil
from multi_agents.main import run_research_task
from gpt_researcher.document.document import DocumentLoader
from gpt_researcher.master.actions import stream_output
from gpt_researcher.config.config import Config

from contextlib import asynccontextmanager

config = Config()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ResearchRequest(BaseModel):
    task: str
    report_type: str
    agent: str

class ConfigRequest(BaseModel):
    ANTHROPIC_API_KEY: Optional[str] = Field(None, description="Anthropic API Key")
    TAVILY_API_KEY: Optional[str] = Field(None, description="Tavily API Key")
    LANGCHAIN_TRACING_V2: Optional[str] = Field(None, description="LangChain Tracing V2")
    LANGCHAIN_API_KEY: Optional[str] = Field(None, description="LangChain API Key")
    OPENAI_API_KEY: Optional[str] = Field(None, description="OpenAI API Key")
    DOC_PATH: Optional[str] = Field(None, description="Document Path")
    RETRIEVER: Optional[str] = Field(None, description="Retriever")
    GOOGLE_API_KEY: Optional[str] = Field(None, description="Google API Key")
    GOOGLE_CX_KEY: Optional[str] = Field(None, description="Google CX Key")
    BING_API_KEY: Optional[str] = Field(None, description="Bing API Key")
    SEARCHAPI_API_KEY: Optional[str] = Field(None, description="SearchAPI API Key")
    SERPAPI_API_KEY: Optional[str] = Field(None, description="SerpAPI API Key")
    SERPER_API_KEY: Optional[str] = Field(None, description="Serper API Key")
    SEARX_URL: Optional[str] = Field(None, description="Searx URL")

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("outputs", exist_ok=True)
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
    yield

app = FastAPI(lifespan=lifespan)

app.mount("/site", StaticFiles(directory="./frontend"), name="site")
app.mount("/static", StaticFiles(directory="./frontend/static"), name="static")

templates = Jinja2Templates(directory="./frontend")

manager = WebSocketManager()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "report": None}
    )

def sanitize_filename(filename):
    return re.sub(r"[^\w\s-]", "", filename).strip()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith("start"):
                json_data = json.loads(data[6:])
                task = json_data.get("task")
                report_type = json_data.get("report_type")
                source_urls = json_data.get("source_urls")
                tone = json_data.get("tone")
                headers = json_data.get("headers", {})
                filename = f"task_{int(time.time())}_{task}"
                sanitized_filename = sanitize_filename(filename)
                report_source = json_data.get("report_source")
                if task and report_type:
                    report = await manager.start_streaming(
                        task, report_type, report_source, source_urls, tone, websocket, headers
                    )
                    if not isinstance(report, str):
                        report = str(report)
                    pdf_path = await write_md_to_pdf(report, sanitized_filename)
                    docx_path = await write_md_to_word(report, sanitized_filename)
                    md_path = await write_text_to_md(report, sanitized_filename)
                    await websocket.send_json(
                        {
                            "type": "path",
                            "output": {
                                "pdf": f"outputs/{os.path.basename(pdf_path)}",
                                "docx": f"outputs/{os.path.basename(docx_path)}",
                                "md": f"outputs/{os.path.basename(md_path)}",
                            },
                        }
                    )
                elif data.startswith("human_feedback"):
                    feedback_data = json.loads(data[14:])
                    print(f"Received human feedback: {feedback_data}")
                else:
                    print("Error: not enough parameters provided.")
    except WebSocketDisconnect:
        await manager.disconnect(websocket)

@app.post("/api/multi_agents")
async def run_multi_agents():
    websocket = manager.active_connections[0] if manager.active_connections else None
    if websocket:
        report = await run_research_task("Is AI in a hype cycle?", websocket, stream_output)
        return {"report": report}
    else:
        return JSONResponse(status_code=400, content={"message": "No active WebSocket connection"})

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
    next_public_api_url: str = Header(None),
    next_public_site_url: str = Header(None)
):
    config = {
        "LANGCHAIN_API_KEY": langchain_api_key or os.getenv("LANGCHAIN_API_KEY", ""),
        "OPENAI_API_KEY": openai_api_key or os.getenv("OPENAI_API_KEY", ""),
        "TAVILY_API_KEY": tavily_api_key or os.getenv("TAVILY_API_KEY", ""),
        "GOOGLE_API_KEY": google_api_key or os.getenv("GOOGLE_API_KEY", ""),
        "GOOGLE_CX_KEY": google_cx_key or os.getenv("GOOGLE_CX_KEY", ""),
        "BING_API_KEY": bing_api_key or os.getenv("BING_API_KEY", ""),
        "SEARCHAPI_API_KEY": searchapi_api_key or os.getenv("SEARCHAPI_API_KEY", ""),
        "SERPAPI_API_KEY": serpapi_api_key or os.getenv("SERPAPI_API_KEY", ""),
        "SERPER_API_KEY": serper_api_key or os.getenv("SERPER_API_KEY", ""),
        "SEARX_URL": searx_url or os.getenv("SEARX_URL", ""),
        "ANTHROPIC_API_KEY": anthropic_api_key or os.getenv("ANTHROPIC_API_KEY", ""),
        "NCBI_API_KEY": ncbi_api_key or os.getenv("NCBI_API_KEY", ""),
        "EXA_API_KEY": exa_api_key or os.getenv("EXA_API_KEY", ""),
        "LANGCHAIN_TRACING_V2": os.getenv("LANGCHAIN_TRACING_V2", "true"),
        "DOC_PATH": os.getenv("DOC_PATH", "./my-docs"),
        "RETRIEVER": os.getenv("RETRIEVER", "tavily"),
        "EMBEDDING_MODEL": os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-large"),
        "EMBEDDING_PROVIDER": os.getenv("EMBEDDING_PROVIDER", "openai"),
        "LLM_PROVIDER": os.getenv("LLM_PROVIDER", "openai"),
        "OLLAMA_BASE_URL": os.getenv("OLLAMA_BASE_URL", ""),
        "DEFAULT_LLM_MODEL": os.getenv("DEFAULT_LLM_MODEL", "gpt-4o-mini"),
        "FAST_LLM_MODEL": os.getenv("FAST_LLM_MODEL", "gpt-4o-mini"),
        "SMART_LLM_MODEL": os.getenv("SMART_LLM_MODEL", "gpt-4o-2024-08-06"),
        "NEXT_PUBLIC_API_URL": next_public_api_url or os.getenv("NEXT_PUBLIC_API_URL", ""),
        "NEXT_PUBLIC_SITE_URL": next_public_site_url or os.getenv("NEXT_PUBLIC_SITE_URL", ""),
    }
    return config

@app.post("/setConfig")
async def set_config(config: ConfigRequest):
    updated_keys = []
    for key, value in config.model_dump(exclude_unset=True).items():
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

# Update CORS middleware
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

# Define DOC_PATH
DOC_PATH = os.getenv("DOC_PATH", "./my-docs")
if not os.path.exists(DOC_PATH):
    os.makedirs(DOC_PATH)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Ensure the directory exists
        os.makedirs(DOC_PATH, exist_ok=True)
        
        file_path = os.path.join(DOC_PATH, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"File uploaded to {file_path}")
        
        return {"filename": file.filename, "path": file_path}
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

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
    logger.info("Handling GET request for /files/")
    files = os.listdir(DOC_PATH)
    logger.info(f"Files in {DOC_PATH}: {files}")
    return {"files": files}

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(DOC_PATH, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"File deleted: {file_path}")
        return {"message": "File deleted successfully"}
    else:
        print(f"File not found: {file_path}")
        return JSONResponse(status_code=404, content={"message": "File not found"})

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