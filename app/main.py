from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import cv, interview_prep, simulation

app = FastAPI(
    title="Kariyer ve Mülakat Hazırlık Platformu",
    description="CV analizi, mülakat hazırlık ve canlı simülasyon sunan yapay zeka destekli platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv.router, prefix="/api/v1")
app.include_router(interview_prep.router, prefix="/api/v1")
app.include_router(simulation.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {
        "platform": "Kariyer ve Mülakat Hazırlık Platformu",
        "version": "0.1.0",
        "status": "çalışıyor",
        "moduller": [
            "/api/v1/cv",
            "/api/v1/interview-prep",
            "/api/v1/simulation",
        ],
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "ok"}
