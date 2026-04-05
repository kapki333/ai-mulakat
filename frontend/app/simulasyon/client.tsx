"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationChat } from "@/components/simulation-chat";
import { MessageSquare, Building2, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SEVIYELER = ["Junior", "Mid-level", "Senior", "Lead", "Manager"];

interface SimConfig {
  pozisyon: string;
  sirket: string;
  seviye: string;
}

function ConfigForm({ onStart }: { onStart: (config: SimConfig) => void }) {
  const [pozisyon, setPozisyon] = useState("");
  const [sirket, setSirket] = useState("");
  const [seviye, setSeviye] = useState("Mid-level");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pozisyon.trim()) return;
    onStart({ pozisyon, sirket, seviye });
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          Mülakat Ayarları
        </CardTitle>
        <p className="text-sm text-gray-500">
          Hangi pozisyon için mülakat yapmak istediğinizi belirtin.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Pozisyon Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={pozisyon}
              onChange={(e) => setPozisyon(e.target.value)}
              placeholder="Örn: Backend Developer, Data Analyst, UX Designer"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Şirket Adı <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              type="text"
              value={sirket}
              onChange={(e) => setSirket(e.target.value)}
              placeholder="Örn: Amazon, Enpara, Hepsiburada"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Deneyim Seviyesi</label>
            <div className="relative">
              <select
                value={seviye}
                onChange={(e) => setSeviye(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                {SEVIYELER.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Bilgi kutusu */}
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg space-y-1">
            <p className="text-xs font-semibold text-emerald-700">Nasıl çalışır?</p>
            <ul className="text-xs text-emerald-600 space-y-0.5">
              <li>• AI mülakatçı sizi karşılar ve sorular sorar</li>
              <li>• Cevaplarınıza göre derinleştirici sorular gelir</li>
              <li>• ~10 mesaj sonrası mülakat tamamlanır</li>
              <li>• Detaylı performans raporu alırsınız</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!pozisyon.trim()}
            className={cn(
              "w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200",
              !pozisyon.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
            )}
          >
            Simülasyona Geç
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SimulasyonClient() {
  const [config, setConfig] = useState<SimConfig | null>(null);
  const [key, setKey] = useState(0);

  function handleReset() {
    setConfig(null);
    setKey((k) => k + 1);
  }

  if (config) {
    return (
      <Card className="border-0 shadow-md" key={key}>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-gray-900">{config.pozisyon}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {config.sirket && `${config.sirket} • `}
                {config.seviye}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Değiştir
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <SimulationChat config={config} onReset={handleReset} />
        </CardContent>
      </Card>
    );
  }

  return <ConfigForm onStart={setConfig} />;
}
