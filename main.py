from dotenv import load_dotenv
import logging

load_dotenv()

from backend.server.server import app

if __name__ == "__main__":
    import uvicorn
    
        
    # Configure basic logging
    logging.basicConfig(level=logging.WARNING)
    
    # Create null handler
    null_handler = logging.NullHandler()
    
    # Configure all possible fontTools related loggers
    fonttools_loggers = [
        'fontTools',
        'fontTools.subset',
        'fontTools.subset.timer',
        'fontTools.ttLib',
        'fontTools.ttLib.ttFont',
        'fontTools.subset.cff',
        'fontTools.subset.layout',
        'fontTools.subset.util',
        'fontTools.pens',
        'fontTools.misc',
    ]
    
    # Silence all fontTools and weasyprint related loggers
    logging.getLogger('weasyprint').setLevel(logging.CRITICAL)
    
    for logger_name in fonttools_loggers:
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.CRITICAL)  # Most strict level
        logger.propagate = False
        # Remove any existing handlers
        for handler in logger.handlers[:]:
            logger.removeHandler(handler)
        # Add null handler
        logger.addHandler(null_handler)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, ws_ping_interval=20, ws_ping_timeout=20)
