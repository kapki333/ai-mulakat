from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.core.openai_client import OpenAIConfigurationError, get_ai_error_status_and_message
from app.services.interview_prep_service import generate_interview_prep

router = APIRouter(prefix="/interview-prep", tags=["Mülakat Hazırlık"])


class InterviewPrepRequest(BaseModel):
    pozisyon: str = Field(..., min_length=1, max_length=100)
    sirket: str = Field(default="", max_length=100)
    seviye: str = Field(default="Mid-level", max_length=30)
    cv_ozeti: str = Field(default="", max_length=3000)


@router.get("/health")
async def interview_prep_health():
    return {"module": "Mülakat Hazırlık", "status": "aktif"}


@router.post("/generate")
async def generate_prep(request: InterviewPrepRequest):
    if not request.pozisyon.strip():
        raise HTTPException(status_code=400, detail="Pozisyon adı zorunludur.")

    try:
        result = await generate_interview_prep(
            pozisyon=request.pozisyon,
            sirket=request.sirket,
            seviye=request.seviye,
            cv_ozeti=request.cv_ozeti,
        )
    except OpenAIConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        status_code, message = get_ai_error_status_and_message(e)
        raise HTTPException(status_code=status_code, detail=f"Hazırlık planı oluşturulamadı: {message}")

    return {"pozisyon": request.pozisyon, "plan": result}
