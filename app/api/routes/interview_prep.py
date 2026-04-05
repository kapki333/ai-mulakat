from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hazırlık planı oluşturulamadı: {str(e)}")

    return {"pozisyon": request.pozisyon, "plan": result}
