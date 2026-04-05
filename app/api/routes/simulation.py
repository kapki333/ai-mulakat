from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simülasyon başlatılamadı: {str(e)}")

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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cevap işlenemedi: {str(e)}")

    return result


@router.post("/evaluate")
async def evaluate(request: SimulationEvaluateRequest):
    try:
        result = await evaluate_simulation(
            mesaj_gecmisi=request.mesaj_gecmisi,
            pozisyon=request.pozisyon,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Değerlendirme yapılamadı: {str(e)}")

    return {"degerlendirme": result}
