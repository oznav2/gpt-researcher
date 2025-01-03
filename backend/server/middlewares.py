from starlette.middleware.base import BaseHTTPMiddleware
from starlette.websockets import WebSocketState

class WebSocketTimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, timeout: int = 30):
        super().__init__(app)
        self.timeout = timeout

    async def dispatch(self, request, call_next):
        if request.scope['type'] == 'websocket':
            request.scope['timeout'] = self.timeout
        return await call_next(request) 