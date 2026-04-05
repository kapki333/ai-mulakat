import json
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)


async def start_simulation(
    pozisyon: str,
    sirket: str = "",
    seviye: str = "Mid-level",
    cv_ozeti: str = "",
) -> dict:
    """Simülasyonu başlat ve ilk soruyu oluştur."""
    sirket_bilgisi = f"{sirket} şirketindeki" if sirket else ""
    cv_bilgisi = f"\n\nAdayın CV özeti:\n{cv_ozeti[:2000]}" if cv_ozeti else ""

    system_prompt = f"""Sen {sirket_bilgisi} {pozisyon} pozisyonu için mülakat yapan deneyimli bir teknik mülakatçısın.
Seviye: {seviye}
{cv_bilgisi}

Görevin: Adayla gerçekçi bir mülakat simülasyonu yapmak.
- Önce adayı karşıla ve kısa bir tanışma yap
- İlk soruyu sor (açılış sorusu: kendini tanıt / background)
- Her cevaba göre derinleştirici sorular sor
- Hem teknik hem davranışsal sorular sor
- Profesyonel ama samimi bir ton kullan
- Türkçe konuş"""

    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": "Mülakat simülasyonunu başlat. Adayı karşıla ve ilk soruyu sor.",
            },
        ],
        temperature=0.7,
    )

    ilk_mesaj = response.choices[0].message.content

    return {
        "sistem_mesaji": system_prompt,
        "mesaj": ilk_mesaj,
        "mesaj_sayisi": 1,
    }


async def continue_simulation(
    sistem_mesaji: str,
    mesaj_gecmisi: list[dict],
    kullanici_cevabi: str,
    mesaj_sayisi: int,
) -> dict:
    """Kullanıcı cevabına göre simülasyona devam et."""

    messages = [{"role": "system", "content": sistem_mesaji}]
    messages.extend(mesaj_gecmisi)
    messages.append({"role": "user", "content": kullanici_cevabi})

    # Son 3 mesajda değerlendirme yap
    if mesaj_sayisi >= 8:
        messages.append(
            {
                "role": "system",
                "content": """Bu mülakat bitmek üzere. Son bir-iki soru daha sor,
                ardından adaya teşekkür et ve kısa bir değerlendirme yap.
                Değerlendirmede: güçlü yanlar, gelişim alanları, genel izlenim belirt.""",
            }
        )

    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=messages,
        temperature=0.7,
    )

    ai_cevap = response.choices[0].message.content
    bitti = mesaj_sayisi >= 10

    return {
        "mesaj": ai_cevap,
        "mesaj_sayisi": mesaj_sayisi + 1,
        "bitti": bitti,
    }


async def evaluate_simulation(mesaj_gecmisi: list[dict], pozisyon: str) -> dict:
    """Tamamlanan simülasyonu değerlendir."""

    konusma = "\n".join(
        [
            f"{'Mülakatçı' if m['role'] == 'assistant' else 'Aday'}: {m['content']}"
            for m in mesaj_gecmisi
            if m["role"] in ("assistant", "user")
        ]
    )

    system_prompt = """Sen bir mülakat değerlendirme uzmanısın. Verilen mülakat konuşmasını analiz ederek JSON formatında rapor oluştur.

JSON yapısı:
{
  "genel_puan": <0-100>,
  "genel_degerlendirme": "<2-3 cümle özet>",
  "teknik_puan": <0-100>,
  "iletisim_puan": <0-100>,
  "guclu_yanlar": ["<güçlü yan1>", "<güçlü yan2>", "<güçlü yan3>"],
  "gelistirilmesi_gerekenler": ["<alan1>", "<alan2>", "<alan3>"],
  "en_iyi_cevap": "<en iyi verilen cevabın özeti>",
  "en_zayif_cevap": "<geliştirilmesi gereken cevabın özeti>",
  "tavsiyeler": ["<tavsiye1>", "<tavsiye2>", "<tavsiye3>"],
  "ise_alinir_mi": true/false,
  "ise_alinir_aciklama": "<karar gerekçesi>"
}

Sadece JSON döndür."""

    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"Pozisyon: {pozisyon}\n\nMülakat konuşması:\n{konusma[:6000]}",
            },
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)
