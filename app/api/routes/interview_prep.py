from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.openai_client import OpenAIConfigurationError, get_ai_error_status_and_message
from app.services.interview_prep_service import generate_interview_prep

router = APIRouter(prefix="/interview-prep", tags=["Mülakat Hazırlık"])


class InterviewPrepRequest(BaseModel):
    pozisyon: str
    sirket: str = ""
    seviye: str = "Mid-level"
    cv_ozeti: str = ""


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
