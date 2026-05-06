# 🤖 AI Mülakat Hazırlık Platformu

Yapay zeka destekli **CV analizi**, **kişiselleştirilmiş mülakat hazırlığı** ve **canlı mülakat simülasyonu** sunan modern bir kariyer hazırlık platformu.

---

## 🚀 Proje Hakkında

AI Mülakat Hazırlık Platformu, iş arayanların mülakat süreçlerine daha etkili hazırlanabilmesi için geliştirilmiş 3 modüllü bir web uygulamasıdır.

Kullanıcılar platform üzerinden:

- PDF formatındaki CV’lerini yapay zekaya analiz ettirebilir,
- hedef pozisyonlarına göre kişiselleştirilmiş mülakat hazırlık planı alabilir,
- gerçek mülakat deneyimine yakın bir yapay zeka simülasyonuna katılabilir.

Proje; modern frontend teknolojileri, FastAPI tabanlı backend mimarisi ve OpenAI entegrasyonu kullanılarak geliştirilmiştir.

---

## ✨ Özellikler

### 📄 1. CV Analizi

Kullanıcı PDF formatındaki CV’sini yükler ve yapay zeka destekli kapsamlı bir analiz raporu alır.

Analiz çıktıları:

- Genel CV puanı
- Yapısal hata tespiti
- İçerik eksiklikleri
- Güçlü yönler
- Eksik yetkinlikler
- Anahtar kelime önerileri
- Sektör ve deneyim seviyesi tahmini

---

### 🧭 2. Akıllı Mülakat Hazırlık Rehberi

Kullanıcı hedef pozisyon, şirket ve seviye bilgilerini girerek kişiselleştirilmiş bir hazırlık planı oluşturabilir.

Üretilen içerikler:

- 3 haftalık çalışma yol haritası
- Teknik mülakat soruları
- Davranışsal mülakat soruları
- Zorlayıcı / tuzak sorular
- Şirket araştırma önerileri
- Cevap stratejileri

---

### 💬 3. Canlı Mülakat Simülasyonu

Kullanıcı, yapay zeka mülakatçı ile gerçek zamanlı bir mülakat deneyimi yaşar.

Simülasyon sonunda kullanıcıya:

- Genel performans puanı
- Teknik değerlendirme
- İletişim değerlendirmesi
- Güçlü yanlar
- Geliştirilmesi gereken noktalar
- En iyi ve en zayıf cevap özeti
- “İşe alınır mı?” değerlendirmesi

sunulur.

---

## 🛠️ Kullanılan Teknolojiler

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Shadcn/UI
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- python-dotenv

### Yapay Zeka ve CV İşleme

- OpenAI GPT-4o-mini
- OpenAI Python SDK
- pdfplumber

---

## 🧱 Proje Mimarisi

```txt
ai-mulakat/
│
├── app/                    # FastAPI Backend
│   ├── main.py              # Uygulama giriş noktası
│   ├── core/                # Konfigürasyon dosyaları
│   ├── api/routes/          # API endpointleri
│   └── services/            # İş mantığı servisleri
│
├── frontend/                # Next.js Frontend
│   ├── app/                 # Sayfalar
│   └── components/          # UI bileşenleri
│
├── requirements.txt         # Python bağımlılıkları
├── .env.example             # Ortam değişkenleri örneği
└── start.sh                 # Başlatma scripti
