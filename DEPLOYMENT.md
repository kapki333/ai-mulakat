# Yayınlama Notları

Bu proje iki parçadan oluşur:

- `frontend/`: Next.js arayüzü
- `app/`: FastAPI backend ve OpenAI entegrasyonu

Sunum için en sade ücretsiz kurulum:

1. Backend: Render Free Web Service
2. Frontend: Vercel Hobby

## Gerekli Gizli Anahtar

Backend'in yapay zeka özellikleri için `OPENAI_API_KEY` zorunludur. Bu anahtarı GitHub'a yazmayın; yalnızca `.env`, Render environment variables veya Vercel environment variables ekranına girin.

Yerel backend `.env` örneği:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=
APP_ENV=development
APP_DEBUG=True
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

OpenAI yerine OpenAI uyumlu ücretsiz/deneme servis kullanacaksanız örnek Gemini ayarı:

```env
OPENAI_API_KEY=AIza...
OPENAI_MODEL=gemini-2.5-flash-lite
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
APP_ENV=development
APP_DEBUG=True
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

Yerel frontend `frontend/.env.local` örneği:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Backend'i Render'da Yayınlama

Render, FastAPI için Python web servislerini destekler. Bu repoya `render.yaml` eklendi; Render Blueprint veya manuel web service kurulumu için kullanılabilir.

Manuel kurulum değerleri:

- Runtime: `Python`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/health`

Environment variables:

- `PYTHON_VERSION`: `3.11.11`
- `OPENAI_API_KEY`: OpenAI anahtarı
- `OPENAI_MODEL`: `gpt-4o-mini`
- `OPENAI_BASE_URL`: OpenAI kullanırken boş bırakılır. Gemini gibi OpenAI uyumlu servislerde ilgili base URL yazılır.
- `APP_ENV`: `production`
- `APP_DEBUG`: `False`
- `UPLOAD_DIR`: `uploads`
- `MAX_UPLOAD_SIZE_MB`: `10`
- `ALLOWED_ORIGINS`: `https://ai-mulakat-i0bnwaica-sef1.vercel.app,https://ai-mulakat-1.vercel.app`
- `RATE_LIMIT_REQUESTS`: `30`
- `RATE_LIMIT_WINDOW_SECONDS`: `3600`

Render Free servisleri boşta kaldığında uykuya geçebilir. Sunumdan 5 dakika önce backend URL'sindeki `/health` adresini açmak ilk beklemeyi azaltır.

## Frontend'i Vercel'de Yayınlama

Vercel'de GitHub reposunu import ederken root directory olarak `frontend` seçin.

Build ayarları genellikle otomatik algılanır:

- Framework: `Next.js`
- Install Command: `npm install` veya `npm ci`
- Build Command: `npm run build`
- Output: otomatik

Environment variable:

```env
NEXT_PUBLIC_API_URL=https://render-backend-adresiniz.onrender.com
```

Backend yayına çıktıktan sonra bu URL'yi Vercel'deki frontend projesine ekleyin ve yeniden deploy edin.

## Yerel Çalıştırma

Backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```

Frontend:

```powershell
cd frontend
npm run dev
```

Adresler:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/health`
- Backend docs: `http://localhost:8000/docs`
