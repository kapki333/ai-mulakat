import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { ArrowLeft, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewPrepClient } from "./client";

export default function MulakatHazirligiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-gray-800">Modül 2: Mülakat Hazırlığı</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Akıllı Mülakat Hazırlık Rehberi</h1>
          <p className="text-gray-600">
            Pozisyonunuza özel yol haritası, soru bankası ve ideal cevap stratejileri.
          </p>
        </div>
        <InterviewPrepClient />
      </main>
    </div>
  );
}
