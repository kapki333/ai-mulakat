"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

interface CvUploaderProps {
  onAnalysisComplete: (data: AnalysisResult) => void;
}

export interface AnalysisResult {
  dosya_adi: string;
  metin_uzunlugu: number;
  analiz: {
    genel_puan: number;
    ozet: string;
    yapisal_hatalar: Array<{ hata: string; oneri: string }>;
    icerik_hatalari: Array<{ hata: string; oneri: string }>;
    eksik_yetkinlikler: Array<{ yetkinlik: string; neden_onemli: string }>;
    anahtar_kelime_onerileri: {
      teknik: string[];
      sektörel: string[];
      yumusak_beceriler: string[];
    };
    guclu_yonler: string[];
    tespit_edilen_sektör: string;
    deneyim_seviyesi: string;
  };
}

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

export function CvUploader({ onAnalysisComplete }: CvUploaderProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setErrorMsg("Sadece PDF dosyaları kabul edilir.");
        setState("error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Dosya boyutu 10MB'dan büyük olamaz.");
        setState("error");
        return;
      }

      setSelectedFile(file);
      setState("uploading");
      setProgress(0);
      setErrorMsg("");

      // Fake progress animation
      const interval = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 5 : p));
      }, 300);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${BACKEND_URL}/api/v1/cv/analyze`, {
          method: "POST",
          body: formData,
        });

        clearInterval(interval);

        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Sunucu hatası" }));
          throw new Error(err.detail ?? "Analiz başarısız");
        }

        const data: AnalysisResult = await res.json();
        setProgress(100);
        setState("success");
        onAnalysisComplete(data);
      } catch (e: unknown) {
        clearInterval(interval);
        setErrorMsg(e instanceof Error ? e.message : "Bilinmeyen hata");
        setState("error");
        setProgress(0);
      }
    },
    [onAnalysisComplete, BACKEND_URL]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setState("idle");
    setSelectedFile(null);
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {state === "idle" || state === "dragging" ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer
            ${state === "dragging"
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/40 bg-white"
            }`}
          onDragEnter={(e) => { e.preventDefault(); setState("dragging"); }}
          onDragLeave={(e) => { e.preventDefault(); setState("idle"); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-colors ${state === "dragging" ? "bg-blue-100" : "bg-gray-100"}`}>
              <Upload className={`w-8 h-8 ${state === "dragging" ? "text-blue-600" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {state === "dragging" ? "Dosyayı bırakın" : "CV'nizi buraya sürükleyin"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                veya <span className="text-blue-600 font-medium">dosya seçmek için tıklayın</span>
              </p>
            </div>
            <p className="text-xs text-gray-400">Sadece PDF — maksimum 10 MB</p>
          </div>
        </div>
      ) : state === "uploading" ? (
        <div className="border-2 border-blue-200 rounded-2xl p-10 text-center bg-blue-50/30">
          <div className="flex flex-col items-center gap-5">
            <div className="p-4 bg-blue-100 rounded-full animate-pulse">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="w-full max-w-xs">
              <p className="text-sm font-medium text-gray-700 mb-2 truncate">{selectedFile?.name}</p>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {progress < 90 ? "Dosya yükleniyor..." : "AI analizi yapılıyor..."}
              </p>
            </div>
          </div>
        </div>
      ) : state === "success" ? (
        <div className="border-2 border-emerald-200 rounded-2xl p-8 text-center bg-emerald-50/30">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
            <p className="font-semibold text-gray-800">{selectedFile?.name}</p>
            <p className="text-sm text-emerald-700">Analiz tamamlandı! Sonuçlar aşağıda görüntüleniyor.</p>
            <Button variant="outline" size="sm" onClick={reset} className="mt-2">
              Yeni CV Yükle
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-red-200 rounded-2xl p-8 text-center bg-red-50/30">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="font-semibold text-gray-800">Hata oluştu</p>
            <p className="text-sm text-red-600">{errorMsg}</p>
            <Button variant="outline" size="sm" onClick={reset} className="mt-2 flex items-center gap-2">
              <X className="w-4 h-4" /> Tekrar Dene
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
