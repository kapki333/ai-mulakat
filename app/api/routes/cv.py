import os
from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.openai_client import OpenAIConfigurationError, get_ai_error_status_and_message
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
    except OpenAIConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        status_code, message = get_ai_error_status_and_message(e)
        raise HTTPException(status_code=status_code, detail=message)

    # Dosyayı kullanıcı adını doğrudan dosya yolu yapmadan sakla.
    os.makedirs(settings.upload_dir, exist_ok=True)
    suffix = Path(file.filename or "cv.pdf").suffix or ".pdf"
    save_path = os.path.join(settings.upload_dir, f"{uuid4().hex}{suffix.lower()}")
    with open(save_path, "wb") as f:
        f.write(file_bytes)

    try:
        analysis = await analyze_cv(cv_text)
    except OpenAIConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        status_code, message = get_ai_error_status_and_message(e)
        raise HTTPException(status_code=status_code, detail=f"Analiz hatası: {message}")

    return {
        "dosya_adi": file.filename,
        "metin_uzunlugu": len(cv_text),
        "analiz": analysis,
    }
