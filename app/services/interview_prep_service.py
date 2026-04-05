import json
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)


async def generate_interview_prep(
    pozisyon: str,
    sirket: str = "",
    seviye: str = "Mid-level",
    cv_ozeti: str = "",
) -> dict:
    sirket_bilgisi = f"Şirket: {sirket}" if sirket else ""
    cv_bilgisi = f"\n\nAdayın CV özeti:\n{cv_ozeti[:3000]}" if cv_ozeti else ""

    system_prompt = """Sen deneyimli bir teknik mülakat koçusun. Verilen pozisyon için kapsamlı bir mülakat hazırlık planı oluştur.

JSON yapısı şu şekilde olmalı:
{
  "pozisyon": "<pozisyon adı>",
  "seviye": "<seviye>",
  "yol_haritasi": {
    "hafta_1": {"baslik": "<başlık>", "konular": ["<konu1>", "<konu2>"], "kaynaklar": ["<kaynak1>"]},
    "hafta_2": {"baslik": "<başlık>", "konular": ["<konu1>", "<konu2>"], "kaynaklar": ["<kaynak1>"]},
    "hafta_3": {"baslik": "<başlık>", "konular": ["<konu1>", "<konu2>"], "kaynaklar": ["<kaynak1>"]}
  },
  "teknik_sorular": [
    {
      "soru": "<soru metni>",
      "zorluk": "Kolay/Orta/Zor",
      "kategori": "<kategori>",
      "ideal_cevap_stratejisi": "<nasıl yanıtlanmalı>",
      "dikkat_edilecekler": ["<nokta1>", "<nokta2>"]
    }
  ],
  "davranissal_sorular": [
    {
      "soru": "<soru metni>",
      "teknik": "STAR/SOAR/CAR",
      "ideal_cevap_stratejisi": "<nasıl yanıtlanmalı>",
      "ornek_cevap_cercevesi": "<örnek cevap çerçevesi>"
    }
  ],
  "zor_sorular": [
    {
      "soru": "<zor soru>",
      "neden_zor": "<neden zor olduğu>",
      "ideal_cevap_stratejisi": "<adım adım strateji>",
      "kacinilamasi_gerekenler": ["<hata1>", "<hata2>"]
    }
  ],
  "sirket_arastirma_sorulari": [
    {"soru": "<soru>", "ipucu": "<araştırma ipucu>"}
  ],
  "hazirlik_tavsiyeler": ["<tavsiye1>", "<tavsiye2>", "<tavsiye3>"]
}

Sadece JSON döndür, başka bir şey yazma. Türkçe yaz."""

    user_content = f"""Pozisyon: {pozisyon}
Seviye: {seviye}
{sirket_bilgisi}{cv_bilgisi}

Bu pozisyon için detaylı mülakat hazırlık planı oluştur.
- 6 teknik soru (farklı zorluk seviyeleri)
- 4 davranışsal soru
- 3 zor/tuzak soru
- 3 şirket araştırma sorusu"""

    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0.4,
        response_format={"type": "json_object"},
    )

    result = json.loads(response.choices[0].message.content)
    return result
