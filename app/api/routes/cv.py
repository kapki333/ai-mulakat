import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.cv_service import extract_text_from_pdf, validate_is_cv, analyze_cv
from app.core.config import settings

router = APIRouter(prefix="/cv", tags=["CV Analizi"])

MAX_SIZE = settings.max_upload_size_mb * 1024 * 1024


@router.get("/health")
async def cv_health():
    return {"module": "CV Analizi", "status": "aktif"}


@router.post("/analyze")
async def analyze_cv_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Sadece PDF dosyaları kabul edilir.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Dosya boyutu {settings.max_upload_size_mb}MB sınırını aşıyor.",
        )

    try:
        cv_text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"PDF okunamadı: {str(e)}")

    if len(cv_text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="PDF'ten yeterli metin çıkarılamadı. Metin tabanlı bir PDF yükleyin.",
        )

    try:
        await validate_is_cv(cv_text)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Save to uploads dir
    os.makedirs(settings.upload_dir, exist_ok=True)
    save_path = os.path.join(settings.upload_dir, file.filename)
    with open(save_path, "wb") as f:
        f.write(file_bytes)

    try:
        analysis = await analyze_cv(cv_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analiz hatası: {str(e)}")

    return {
        "dosya_adi": file.filename,
        "metin_uzunlugu": len(cv_text),
        "analiz": analysis,
    }
