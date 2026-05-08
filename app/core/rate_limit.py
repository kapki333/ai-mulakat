import time
from collections import defaultdict, deque
from collections.abc import Callable

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings


AI_ENDPOINTS = {
    "/api/v1/cv/analyze",
    "/api/v1/interview-prep/generate",
    "/api/v1/simulation/start",
    "/api/v1/simulation/respond",
    "/api/v1/simulation/evaluate",
}


class InMemoryRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.requests_by_client: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: Callable):
        if request.method != "POST" or request.url.path not in AI_ENDPOINTS:
            return await call_next(request)

        client_id = get_client_id(request)
        now = time.monotonic()
        window_start = now - settings.rate_limit_window_seconds
        client_requests = self.requests_by_client[client_id]

        while client_requests and client_requests[0] < window_start:
            client_requests.popleft()

        if len(client_requests) >= settings.rate_limit_requests:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": (
                        "Kısa sürede çok fazla yapay zeka isteği gönderildi. "
                        "Lütfen bir süre sonra tekrar deneyin."
                    )
                },
                headers={"Retry-After": str(settings.rate_limit_window_seconds)},
            )

        client_requests.append(now)
        return await call_next(request)


def get_client_id(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    if request.client:
        return request.client.host

    return "unknown"
