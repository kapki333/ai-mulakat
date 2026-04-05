"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { CvUploader, type AnalysisResult } from "@/components/cv-uploader";
import { CvAnalysisResult } from "@/components/cv-analysis-result";
import { ArrowLeft, ArrowRight, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CvAnalyzePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">Modül 1: CV Analizi</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            GPT-4o-mini
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Upload Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Analizi</h1>
          <p className="text-gray-600">
            PDF formatındaki CV&apos;nizi yükleyin. AI, yapısal hatalar, eksik yetkinlikler
            ve anahtar kelime önerileri için detaylı analiz yapacak.
          </p>
        </div>

        <CvUploader onAnalysisComplete={setResult} />

        {/* Results */}
        {result && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Analiz Sonuçları</h2>
              <span className="text-sm text-gray-500">— {result.dosya_adi}</span>
            </div>
            <CvAnalysisResult result={result} />

            {/* Next Step CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-center">
              <h3 className="text-lg font-bold mb-2">Sonraki Adım: Mülakat Hazırlığı</h3>
              <p className="text-blue-100 text-sm mb-4">
                CV analizinizi kullanarak pozisyonunuza özel bir çalışma yol haritası oluşturun.
              </p>
              <Link
                href="/mulakat-hazirligi"
                className={cn(buttonVariants(), "bg-white text-blue-700 hover:bg-blue-50 inline-flex items-center")}
              >
                Mülakat Hazırlığına Geç <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
