import json
import os
import re
import time
import logging
import shutil
from typing import Dict, List, Any, Tuple, Optional
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from gpt_researcher.document.document import DocumentLoader
# Add this import
from backend.utils import write_md_to_pdf, write_md_to_word, write_text_to_md
# from backend.server.websocket_manager import WebSocketManager
from gpt_researcher.actions.utils import stream_output
from multi_agents.main import run_research_task

logger = logging.getLogger(__name__)

def extract_command_data(json_data: Dict) -> Tuple[str, str, Optional[List[str]], Optional[str], Dict, Optional[str]]:
    """
    Extract command data from the JSON input.
    
    Args:
        json_data (Dict): The JSON data containing command information.
    
    Returns:
        Tuple containing:
        - task (str): The research task.
        - report_type (str): The type of report to generate.
        - source_urls (Optional[List[str]]): List of source URLs, if provided.
        - tone (Optional[str]): The tone for the report, if specified.
        - headers (Dict): Additional headers for the request.
        - report_source (Optional[str]): The source of the report, if specified.
    """
    return (
        json_data.get("task", ""),
        json_data.get("report_type", ""),
        json_data.get("source_urls"),
        json_data.get("tone"),
        json_data.get("headers", {}),
        json_data.get("report_source")
    )


def sanitize_filename(filename: str) -> str:
    return re.sub(r"[^\w\s-]", "", filename).strip()


async def handle_start_command(websocket, data: str, manager):
    json_data = json.loads(data[6:])
    task, report_type, source_urls, tone, headers, report_source = extract_command_data(json_data)

    if not task or not report_type:
        await websocket.send_json({"error": "Missing task or report_type"})
        return

    sanitized_filename = sanitize_filename(f"task_{int(time.time())}_{task}")

    report = await manager.start_streaming(
        task, report_type, report_source, source_urls, tone, websocket, headers
    )
    report = str(report)
    if report:
        file_paths = await generate_report_files(report, sanitized_filename)
        await send_file_paths(websocket, file_paths)
    else:
        await websocket.send_json({"error": "Failed to generate report"})


async def handle_human_feedback(data: str):
    feedback_data = json.loads(data[14:])  # Remove "human_feedback" prefix
    print(f"Received human feedback: {feedback_data}")
    # TODO: Add logic to forward the feedback to the appropriate agent or update the research state


async def generate_report_files(report: str, filename: str) -> Dict[str, str]:
    pdf_path = await write_md_to_pdf(report, filename)
    docx_path = await write_md_to_word(report, filename)
    md_path = await write_text_to_md(report, filename)
    return {"pdf": pdf_path, "docx": docx_path, "md": md_path}


async def send_file_paths(websocket, file_paths: Dict[str, str]):
    await websocket.send_json({"type": "path", "output": file_paths})


def get_config_dict(
    langchain_api_key: str,
    openai_api_key: str,
    tavily_api_key: str,
    google_api_key: str,
    google_cx_key: str,
    bing_api_key: str,
    searchapi_api_key: str,
    serpapi_api_key: str,
    serper_api_key: str,
    searx_url: str,
    langchain_tracing_v2: str,
    anthropic_api_key: str,
    ncbi_api_key: str,
    exa_api_key: str,
    embedding_model: str,
    embedding_provider: str,
    llm_provider: str,
    ollama_base_url: str,
    default_llm_model: str,
    fast_llm_model: str,
    smart_llm_model: str,
    doc_path: str,
    retriever: str,
    chokidar_usepolling: str,
    next_public_api_url: str,
    next_public_site_url: str
) -> Dict[str, str]:
    return {
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
        "LANGCHAIN_TRACING_V2": langchain_tracing_v2 or os.getenv("LANGCHAIN_TRACING_V2", "true"),
        "DOC_PATH": doc_path or os.getenv("DOC_PATH", "./my-docs"),
        "RETRIEVER": retriever or os.getenv("RETRIEVER", ""),
        "CHOKIDAR_USEPOLLING": chokidar_usepolling or os.getenv("CHOKIDAR_USEPOLLING", "true"),
        "EMBEDDING_MODEL": embedding_model or os.getenv("OPENAI_EMBEDDING_MODEL", ""),
        "EMBEDDING_PROVIDER": embedding_provider or os.getenv("EMBEDDING_PROVIDER", "openai"),
        "LLM_PROVIDER": llm_provider or os.getenv("LLM_PROVIDER", "openai"),
        "OLLAMA_BASE_URL": ollama_base_url or os.getenv("OLLAMA_BASE_URL", ""),
        "DEFAULT_LLM_MODEL": default_llm_model or os.getenv("DEFAULT_LLM_MODEL", "gpt-4o-mini"),
        "FAST_LLM_MODEL": fast_llm_model or os.getenv("FAST_LLM_MODEL", "gpt-4o-mini"),
        "SMART_LLM_MODEL": smart_llm_model or os.getenv("SMART_LLM_MODEL", "gpt-4o-2024-08-06"),
        "NEXT_PUBLIC_API_URL": next_public_api_url or os.getenv("NEXT_PUBLIC_API_URL", ""),
        "NEXT_PUBLIC_SITE_URL": next_public_site_url or os.getenv("NEXT_PUBLIC_SITE_URL", "")
    }


def update_environment_variables(config: Dict[str, str]):
    for key, value in config.items():
        os.environ[key] = value


async def handle_file_upload(file, DOC_PATH: str) -> Dict[str, str]:
    # Ensure the directory exists
    os.makedirs(DOC_PATH, exist_ok=True)
    file_path = os.path.join(DOC_PATH, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print(f"File uploaded to {file_path}")
    document_loader = DocumentLoader(DOC_PATH)
    await document_loader.load()
        
    return {"filename": file.filename, "path": file_path}

async def handle_file_deletion(filename: str, DOC_PATH: str) -> JSONResponse:
    file_path = os.path.join(DOC_PATH, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"File deleted: {file_path}")
        return JSONResponse(content={"message": "File deleted successfully"})
    else:
        print(f"File not found: {file_path}")
        return JSONResponse(status_code=404, content={"message": "File not found"})

async def execute_multi_agents(manager) -> Any:
    websocket = manager.active_connections[0] if manager.active_connections else None
    if websocket:
        report = await run_research_task("Is AI in a hype cycle?", websocket, stream_output)
        return {"report": report}
    else:
        return JSONResponse(status_code=400, content={"message": "No active WebSocket connection"})

async def handle_websocket_communication(websocket, manager):
    while True:
        data = await websocket.receive_text()
        if data.startswith("start"):
            await handle_start_command(websocket, data, manager)
        elif data.startswith("human_feedback"):
            await handle_human_feedback(data)
        else:
            print("Error: Unknown command or not enough parameters provided.")

