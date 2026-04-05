#!/bin/bash
# AI Mülakat Hazırlık Platformu - Başlatma Scripti

set -e

# Backend'i arka planda başlat
echo "Backend başlatılıyor (http://localhost:8000)..."
cd "$(dirname "$0")"

if [ ! -f ".env" ]; then
  echo "HATA: .env dosyası bulunamadı. .env.example'ı kopyalayın:"
  echo "  cp .env.example .env"
  echo "  Ardından OPENAI_API_KEY değerini doldurun."
  exit 1
fi

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Frontend'i başlat
echo "Frontend başlatılıyor (http://localhost:3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Platform çalışıyor:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Durdurmak için Ctrl+C"

# Her iki process'i bekle
wait $BACKEND_PID $FRONTEND_PID
