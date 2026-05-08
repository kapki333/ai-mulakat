from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.openai_client import OpenAIConfigurationError, get_ai_error_status_and_message
from app.services.simulation_service import start_simulation, continue_simulation, evaluate_simulation

router = APIRouter(prefix="/simulation", tags=["Mülakat Simülasyonu"])


class SimulationStartRequest(BaseModel):
    pozisyon: str
    sirket: str = ""
    seviye: str = "Mid-level"
    cv_ozeti: str = ""


class SimulationContinueRequest(BaseModel):
    sistem_mesaji: str
    mesaj_gecmisi: list[dict]
    kullanici_cevabi: str
    mesaj_sayisi: int


class SimulationEvaluateRequest(BaseModel):
    mesaj_gecmisi: list[dict]
    pozisyon: str


@router.get("/health")
async def simulation_health():
    return {"module": "Mülakat Simülasyonu", "status": "aktif"}


@router.post("/start")
async def start(request: SimulationStartRequest):
    if not request.pozisyon.strip():
        raise HTTPException(status_code=400, detail="Pozisyon adı zorunludur.")

    try:
        result = await start_simulation(
            pozisyon=request.pozisyon,
            sirket=request.sirket,
            seviye=request.seviye,
            cv_ozeti=request.cv_ozeti,
        )
    except OpenAIConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        status_code, message = get_ai_error_status_and_message(e)
        raise HTTPException(status_code=status_code, detail=f"Simülasyon başlatılamadı: {message}")

    return result


@router.post("/respond")
async def respond(request: SimulationContinueRequest):
    try:
        result = await continue_simulation(
            sistem_mesaji=request.sistem_mesaji,
            mesaj_gecmisi=request.mesaj_gecmisi,
            kullanici_cevabi=request.kullanici_cevabi,
            mesaj_sayisi=request.mesaj_sayisi,
        )
    except OpenAIConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        status_code, message = get_ai_error_status_and_message(e)
        raise HTTPException(status_code=status_code, detail=f"Cevap işlenemedi: {message}")

    return result


@router.post("/evaluate")
async def evaluate(request: SimulationEvaluateRequest):
    try:
        result = await evaluate_simulation(
            mesaj_gecmisi=request.mesaj_gecmisi,
            pozisyon=request.pozisyon,
        )
    except OpenAIConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        status_code, message = get_ai_error_status_and_message(e)
        raise HTTPException(status_code=status_code, detail=f"Değerlendirme yapılamadı: {message}")

    return {"degerlendirme": result}
