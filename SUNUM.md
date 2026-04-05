# AI İş Görüşmesi Hazırlık Platformu
### BTK Akademi Atölyesi — Proje Sunumu

---

## Projeye Genel Bakış

Türkiye'deki iş arayanların mülakat süreçlerine hazırlanmasını kolaylaştırmak için geliştirilen, **yapay zeka destekli 3 modüllü bir web platformu**. Kullanıcı CV'sini yükleyerek analiz ettiriyor, hedef pozisyonu için kişiselleştirilmiş hazırlık planı alıyor ve gerçek mülakat deneyimini simüle ediyor.

---

## Teknoloji Yığını

| Katman | Teknoloji | Sürüm |
|--------|-----------|-------|
| **Frontend** | Next.js (Turbopack) | 16.2.2 |
| **UI Kütüphanesi** | Tailwind CSS + Shadcn/UI | — |
| **Backend** | FastAPI + Uvicorn | 0.111.0 / 0.29.0 |
| **Yapay Zeka** | OpenAI GPT-4o-mini | — |
| **CV Okuma** | pdfplumber | 0.11.0 |
| **Dil** | Python (Anaconda3) + TypeScript | — |

---

## Proje Yapısı

```
career-platform/
│
├── app/                          # FastAPI Backend
│   ├── main.py                   # Uygulama giriş noktası, CORS ayarları
│   ├── core/config.py            # Ortam değişkenleri (.env okuma)
│   ├── api/routes/
│   │   ├── cv.py                 # CV analiz endpoint'i
│   │   ├── interview_prep.py     # Mülakat hazırlık endpoint'i
│   │   └── simulation.py        # Simülasyon endpoint'leri
│   └── services/
│       ├── cv_service.py         # PDF okuma + GPT analiz mantığı
│       ├── interview_prep_service.py  # Yol haritası + soru bankası üretimi
│       └── simulation_service.py     # Simülasyon akış motoru
│
├── frontend/                     # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx              # Ana sayfa (3 modül kartı)
│   │   ├── cv-analiz/            # Modül 1 sayfası
│   │   ├── mulakat-hazirligi/    # Modül 2 sayfası
│   │   └── simulasyon/           # Modül 3 sayfası
│   └── components/
│       ├── cv-uploader.tsx           # PDF yükleme formu
│       ├── cv-analysis-result.tsx    # Analiz sonuç kartları
│       ├── interview-prep-form.tsx   # Pozisyon giriş formu
│       ├── interview-prep-result.tsx # 5 sekmeli sonuç paneli
│       └── simulation-chat.tsx       # Gerçek zamanlı chat arayüzü
│
├── .env                          # API anahtarları (git'e girmez)
├── requirements.txt              # Python bağımlılıkları
└── start.sh                      # Tek komutla başlatma scripti
```

---

## Modüller ve Özellikler

### Modül 1 — CV Analizi (`/cv-analiz`)

**Ne yapar?**
Kullanıcının PDF formatındaki CV'sini GPT-4o-mini ile analiz ederek kapsamlı bir rapor üretir.

**Teknik akış:**
1. Kullanıcı PDF dosyasını tarayıcıdan yükler
2. `pdfplumber` metin katmanını çıkarır
3. GPT-4o-mini İK uzmanı rolüyle JSON rapor üretir
4. Frontend puanları, hataları ve önerileri kartlarla gösterir

**Çıktılar:**
- Genel puan (0–100)
- Yapısal hatalar + düzeltme önerileri
- İçerik hataları + düzeltme önerileri
- Eksik yetkinlikler ve neden önemli oldukları
- Anahtar kelime önerileri (teknik / sektörel / yumuşak beceri)
- Güçlü yönler listesi
- Otomatik sektör ve deneyim seviyesi tespiti

---

### Modül 2 — Akıllı Mülakat Hazırlık Rehberi (`/mulakat-hazirligi`)

**Ne yapar?**
Hedef pozisyon, şirket ve kıdem seviyesi girildiğinde kişiselleştirilmiş bir hazırlık planı üretir.

**Teknik akış:**
1. Kullanıcı pozisyon adı, şirket (isteğe bağlı) ve seviye girer
2. İsteğe bağlı olarak Modül 1 sonucunu yapıştırabilir (CV'ye özgü sorular için)
3. GPT-4o-mini mülakat koçu rolüyle JSON çıktı üretir
4. Frontend 5 ayrı sekmede gösterir

**5 sekme:**

| Sekme | İçerik |
|-------|--------|
| Yol Haritası | 3 haftalık çalışma planı (konular + kaynaklar) |
| Teknik Sorular | 6 soru — kolay/orta/zor, kategori, ideal cevap stratejisi |
| Davranışsal Sorular | 4 soru — STAR/SOAR/CAR teknikleri, örnek çerçeve |
| Zor Sorular | 3 tuzak soru — neden zor + adım adım strateji + kaçınılması gerekenler |
| Şirket Araştırma | 3 araştırma sorusu + ipuçları |

Her soruda **"Cevap Stratejisini Gör"** açılır-kapanır paneli bulunur.

---

### Modül 3 — Canlı Mülakat Simülasyonu (`/simulasyon`)

**Ne yapar?**
Kullanıcı gerçek bir mülakat deneyimi yaşar; AI mülakatçı dinamik, derinleşen sorular sorar.

**Teknik akış:**
1. Pozisyon ve seviye girilir → `POST /start` ile simülasyon başlar
2. Her kullanıcı cevabı `POST /respond` ile gönderilir
3. AI önceki cevabı analiz ederek bağlama uygun takip sorusu üretir
4. 8. mesajdan itibaren kapanış moduna geçer
5. 10. mesajda simülasyon sona erer → `POST /evaluate` ile rapor üretilir

**Özellikler:**
- Gerçek zamanlı typing animasyonu
- Kullanıcı ve AI mesaj balonları (chat arayüzü)
- Mülakat boyunca tam konuşma geçmişi tutulur

**Bitiş Raporu:**
- Genel puan + teknik puan + iletişim puanı
- Güçlü yanlar (3 madde)
- Geliştirilmesi gerekenler (3 madde)
- En iyi ve en zayıf cevap özeti
- Gelişim tavsiyeleri
- **"İşe Alınır mı?"** kararı ve gerekçesi

---

## API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/v1/cv/analyze` | PDF yükle → CV analiz raporu |
| `POST` | `/api/v1/interview-prep/generate` | Pozisyon → Hazırlık planı |
| `POST` | `/api/v1/simulation/start` | Simülasyon başlat, ilk soru al |
| `POST` | `/api/v1/simulation/respond` | Cevap gönder, takip sorusu al |
| `POST` | `/api/v1/simulation/evaluate` | Tamamlanan simülasyonu değerlendir |
| `GET` | `/` | Platform bilgisi |
| `GET` | `/health` | Sağlık kontrolü |
| `GET` | `/docs` | Swagger UI (otomatik API dokümantasyonu) |

---

## Kurulum ve Çalıştırma

### Ön Koşullar
- Python (Anaconda3 önerilir)
- Node.js v18+
- OpenAI API anahtarı

### 1. Ortam Değişkenlerini Ayarla

`.env` dosyası (proje kök dizini):
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

`frontend/.env.local` dosyası:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Python Bağımlılıklarını Kur

```bash
cd career-platform
python -m pip install -r requirements.txt
```

### 3. Node.js Bağımlılıklarını Kur

```bash
cd frontend
npm install
```

### 4. Servisleri Başlat

**Terminal 1 — Backend:**
```bash
cd career-platform
python -m uvicorn app.main:app --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd career-platform/frontend
npm run dev
```

### 5. Tarayıcıda Aç

| Servis | URL |
|--------|-----|
| Platform (Ana Sayfa) | http://localhost:3000 |
| API Swagger Dokümantasyonu | http://localhost:8000/docs |
| Backend Sağlık Kontrolü | http://localhost:8000/health |

---

## Kullanım Akışı (Demo Senaryosu)

```
1. http://localhost:3000 → Ana sayfa açılır, 3 modül kartı görünür

2. "CV Analizi" → PDF yükle → Analiz → Puan ve öneriler

3. "Mülakat Hazırlığı" → "Software Engineer, Google, Senior" gir
   → Yol haritası, 6 teknik soru, 4 davranışsal soru, 3 zor soru

4. "Simülasyon" → "Backend Developer, Mid-level" gir → Başlat
   → AI: "Merhaba, ben bugünkü mülakatçınızım. Kendinizden bahseder misiniz?"
   → ~10 tur konuşma → Değerlendirme raporu
```

---

## Mimari Özeti

```
Tarayıcı (Next.js)
      │
      │ HTTP (JSON)
      ▼
FastAPI Backend (port 8000)
      │
      │ AsyncOpenAI
      ▼
OpenAI GPT-4o-mini API
```

- **Frontend → Backend:** REST API (JSON)
- **Backend → OpenAI:** Async HTTP (openai Python SDK)
- **CV okuma:** `pdfplumber` (sunucuda, dosya geçici bellekte tutulur)
- **Durum yönetimi:** Simülasyon geçmişi frontend'de tutulur, her istekte gönderilir (stateless backend)

---

## Geliştirme Notları

- Backend tamamen **async** yazılmıştır (`AsyncOpenAI`, `async def`)
- Tüm GPT çağrıları `response_format: json_object` ile yapılandırılmıştır — tutarlı JSON çıktısı garanti altında
- Simülasyon 10 mesaj sınırıyla optimize edilmiştir — gereksiz API maliyeti önlenir
- `temperature=0.3` analiz görevlerinde (deterministik), `0.7` simülasyonda (doğal konuşma) kullanılır
