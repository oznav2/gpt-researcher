from dotenv import load_dotenv
import logging

load_dotenv()

# Add this near the top of the file, before any WeasyPrint operations
logging.getLogger('weasyprint').setLevel(logging.ERROR)


from backend.server.server import app

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
