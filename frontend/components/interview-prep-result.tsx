"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Target,
  AlertTriangle,
  MessageSquare,
  Map,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrepResult {
  pozisyon: string;
  plan: {
    pozisyon: string;
    seviye: string;
    yol_haritasi: Record<
      string,
      { baslik: string; konular: string[]; kaynaklar: string[] }
    >;
    teknik_sorular: Array<{
      soru: string;
      zorluk: string;
      kategori: string;
      ideal_cevap_stratejisi: string;
      dikkat_edilecekler: string[];
    }>;
    davranissal_sorular: Array<{
      soru: string;
      teknik: string;
      ideal_cevap_stratejisi: string;
      ornek_cevap_cercevesi: string;
    }>;
    zor_sorular: Array<{
      soru: string;
      neden_zor: string;
      ideal_cevap_stratejisi: string;
      kacinilamasi_gerekenler: string[];
    }>;
    sirket_arastirma_sorulari: Array<{ soru: string; ipucu: string }>;
    hazirlik_tavsiyeler: string[];
  };
}

const ZORLUK_RENK: Record<string, string> = {
  Kolay: "bg-green-100 text-green-700",
  Orta: "bg-yellow-100 text-yellow-700",
  Zor: "bg-red-100 text-red-700",
};

function CollapsibleQuestion({
  soru,
  index,
  children,
}: {
  soru: string;
  index: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-800">{soru}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">{children}</div>}
    </div>
  );
}

type TabKey = "yol_haritasi" | "teknik" | "davranissal" | "zor" | "sirket";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "yol_haritasi", label: "Yol Haritası", icon: <Map className="w-4 h-4" /> },
  { key: "teknik", label: "Teknik Sorular", icon: <Target className="w-4 h-4" /> },
  { key: "davranissal", label: "Davranışsal", icon: <MessageSquare className="w-4 h-4" /> },
  { key: "zor", label: "Zor Sorular", icon: <AlertTriangle className="w-4 h-4" /> },
  { key: "sirket", label: "Şirket Araştırma", icon: <BookOpen className="w-4 h-4" /> },
];

export function InterviewPrepResult({ data }: { data: PrepResult }) {
  const [activeTab, setActiveTab] = useState<TabKey>("yol_haritasi");
  const plan = data.plan;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{plan.pozisyon || data.pozisyon}</h2>
              <p className="text-purple-200 text-sm">{plan.seviye} — Mülakat Hazırlık Planı</p>
            </div>
          </div>

          {plan.hazirlik_tavsiyeler?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-purple-200 font-medium mb-2 uppercase tracking-wide">
                Genel Tavsiyeler
              </p>
              <ul className="space-y-1">
                {plan.hazirlik_tavsiyeler.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple-300" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              activeTab === tab.key
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "yol_haritasi" && (
        <div className="space-y-4">
          {Object.entries(plan.yol_haritasi || {}).map(([hafta, info]) => (
            <Card key={hafta} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold uppercase">
                    {hafta.replace("_", " ")}
                  </span>
                  {info.baslik}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Konular</p>
                  <ul className="space-y-1">
                    {info.konular.map((k, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
                {info.kaynaklar?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Kaynaklar</p>
                    <ul className="space-y-1">
                      {info.kaynaklar.map((k, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "teknik" && (
        <div className="space-y-3">
          {(plan.teknik_sorular || []).map((q, i) => (
            <CollapsibleQuestion key={i} soru={q.soru} index={i}>
              <div className="pt-3 space-y-3">
                <div className="flex gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      ZORLUK_RENK[q.zorluk] || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {q.zorluk}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    {q.kategori}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">İdeal Cevap Stratejisi</p>
                  <p className="text-sm text-gray-700">{q.ideal_cevap_stratejisi}</p>
                </div>
                {q.dikkat_edilecekler?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Dikkat Edilecekler</p>
                    <ul className="space-y-1">
                      {q.dikkat_edilecekler.map((d, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleQuestion>
          ))}
        </div>
      )}

      {activeTab === "davranissal" && (
        <div className="space-y-3">
          {(plan.davranissal_sorular || []).map((q, i) => (
            <CollapsibleQuestion key={i} soru={q.soru} index={i}>
              <div className="pt-3 space-y-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                  {q.teknik} Tekniği
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Strateji</p>
                  <p className="text-sm text-gray-700">{q.ideal_cevap_stratejisi}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Örnek Cevap Çerçevesi</p>
                  <p className="text-sm text-gray-600 italic">{q.ornek_cevap_cercevesi}</p>
                </div>
              </div>
            </CollapsibleQuestion>
          ))}
        </div>
      )}

      {activeTab === "zor" && (
        <div className="space-y-3">
          {(plan.zor_sorular || []).map((q, i) => (
            <CollapsibleQuestion key={i} soru={q.soru} index={i}>
              <div className="pt-3 space-y-3">
                <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs font-semibold text-red-600 mb-1">Neden Zor?</p>
                  <p className="text-sm text-red-700">{q.neden_zor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">İdeal Strateji</p>
                  <p className="text-sm text-gray-700">{q.ideal_cevap_stratejisi}</p>
                </div>
                {q.kacinilamasi_gerekenler?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-1">Kaçınılması Gerekenler</p>
                    <ul className="space-y-1">
                      {q.kacinilamasi_gerekenler.map((k, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleQuestion>
          ))}
        </div>
      )}

      {activeTab === "sirket" && (
        <div className="space-y-3">
          {(plan.sirket_arastirma_sorulari || []).map((q, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-medium text-gray-800">{q.soru}</p>
                <div className="flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600">{q.ipucu}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
