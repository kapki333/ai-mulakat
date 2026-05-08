import pdfplumber
import json
from app.core.config import settings
from app.core.openai_client import get_openai_client


MAX_CV_PAGES = 10


def normalize_cv_analysis(result: dict) -> dict:
    if "tespit_edilen_sektör" not in result and "tespit_edilen_sektor" in result:
        result["tespit_edilen_sektör"] = result["tespit_edilen_sektor"]

    defaults = {
        "genel_puan": 0,
        "ozet": "",
        "yapisal_hatalar": [],
        "icerik_hatalari": [],
        "eksik_yetkinlikler": [],
        "guclu_yonler": [],
        "tespit_edilen_sektör": "Belirlenemedi",
        "deneyim_seviyesi": "Belirlenemedi",
    }
    for key, value in defaults.items():
        if result.get(key) in (None, ""):
            result[key] = value

    keywords = result.get("anahtar_kelime_onerileri") or {}
    if not isinstance(keywords, dict):
        keywords = {}
    result["anahtar_kelime_onerileri"] = keywords

    if "sektörel" not in keywords and "sektorel" in keywords:
        keywords["sektörel"] = keywords["sektorel"]
    for key in ("teknik", "sektörel", "yumusak_beceriler"):
        if not isinstance(keywords.get(key), list):
            keywords[key] = []

    return result


def extract_text_from_pdf(file_bytes: bytes) -> str:
    import io
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        page_count = len(pdf.pages)
        if page_count > MAX_CV_PAGES:
            raise ValueError(
                f"Bu dosya {page_count} sayfa içeriyor. CV'ler genellikle 1-3 sayfa olur. "
                "Lütfen CV dosyanızı yükleyin."
            )
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    return text.strip()


async def validate_is_cv(cv_text: str) -> None:
    """Metnin gerçekten bir CV olup olmadığını kontrol eder."""
    client = get_openai_client()
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {
                "role": "system",
                "content": """Sana verilen metnin kişisel bir CV/özgeçmiş olup olmadığını belirle.

CV'nin özellikleri: kişisel iletişim bilgileri, iş/staj deneyimleri, eğitim geçmişi, beceriler.
CV DEĞİLDİR: tez, makale, rapor, ders notu, kitap, proje dökümanı, teknik belge.

Sadece JSON döndür: {"is_cv": true} veya {"is_cv": false}""",
            },
            {"role": "user", "content": cv_text[:3000]},
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )
    result = json.loads(response.choices[0].message.content)
    if not result.get("is_cv", False):
        raise ValueError(
            "Yüklenen dosya bir CV/özgeçmiş değil gibi görünüyor. "
            "Lütfen kişisel CV dosyanızı yükleyin."
        )


async def analyze_cv(cv_text: str) -> dict:
    client = get_openai_client()
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
    return normalize_cv_analysis(result)
