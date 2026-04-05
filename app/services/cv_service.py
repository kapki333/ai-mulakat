import pdfplumber
import json
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    import io
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    return text.strip()


async def analyze_cv(cv_text: str) -> dict:
    system_prompt = """Sen deneyimli bir İK uzmanı ve kariyer koçusun. Sana verilen CV metnini analiz ederek JSON formatında rapor oluştur.

JSON yapısı şu şekilde olmalı:
{
  "genel_puan": <0-100 arası sayı>,
  "ozet": "<2-3 cümle genel değerlendirme>",
  "yapisal_hatalar": [
    {"hata": "<hata açıklaması>", "oneri": "<düzeltme önerisi>"}
  ],
  "icerik_hatalari": [
    {"hata": "<hata açıklaması>", "oneri": "<düzeltme önerisi>"}
  ],
  "eksik_yetkinlikler": [
    {"yetkinlik": "<eksik alan>", "neden_onemli": "<neden eklenmelı>"}
  ],
  "anahtar_kelime_onerileri": {
    "teknik": ["<kelime1>", "<kelime2>"],
    "sektörel": ["<kelime1>", "<kelime2>"],
    "yumusak_beceriler": ["<kelime1>", "<kelime2>"]
  },
  "guclu_yonler": ["<güçlü yan 1>", "<güçlü yan 2>"],
  "tespit_edilen_sektör": "<tahmin edilen sektör>",
  "deneyim_seviyesi": "<Junior/Mid-level/Senior>"
}

Sadece JSON döndür, başka bir şey yazma."""

    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Şu CV'yi analiz et:\n\n{cv_text[:8000]}"},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    result = json.loads(response.choices[0].message.content)
    return result
