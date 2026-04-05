"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Send,
  User,
  Bot,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Star,
} from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface SimConfig {
  pozisyon: string;
  sirket: string;
  seviye: string;
}

interface Evaluation {
  genel_puan: number;
  genel_degerlendirme: string;
  teknik_puan: number;
  iletisim_puan: number;
  guclu_yanlar: string[];
  gelistirilmesi_gerekenler: string[];
  en_iyi_cevap: string;
  en_zayif_cevap: string;
  tavsiyeler: string[];
  ise_alinir_mi: boolean;
  ise_alinir_aciklama: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-800">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function EvaluationPanel({ ev, pozisyon }: { ev: Evaluation; pozisyon: string }) {
  return (
    <div className="space-y-4 mt-4">
      {/* Genel puan */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div
          className={cn(
            "p-6 text-white",
            ev.genel_puan >= 70
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : ev.genel_puan >= 50
              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Genel Mülakat Puanı</p>
              <p className="text-5xl font-bold mt-1">{ev.genel_puan}</p>
              <p className="text-white/80 text-xs mt-1">/ 100</p>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
                  ev.ise_alinir_mi ? "bg-white/20 text-white" : "bg-white/20 text-white"
                )}
              >
                {ev.ise_alinir_mi ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {ev.ise_alinir_mi ? "İşe Alınır" : "Gelişim Gerekli"}
              </div>
              <p className="text-white/70 text-xs mt-2 max-w-[180px]">{ev.ise_alinir_aciklama}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-5 space-y-4">
          <p className="text-sm text-gray-600">{ev.genel_degerlendirme}</p>
          <ScoreBar label="Teknik Yetkinlik" score={ev.teknik_puan} color="bg-blue-500" />
          <ScoreBar label="İletişim Becerisi" score={ev.iletisim_puan} color="bg-purple-500" />
        </CardContent>
      </Card>

      {/* Güçlü yanlar & gelişim */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
              <Star className="w-4 h-4" /> Güçlü Yanlar
            </p>
            <ul className="space-y-1.5">
              {ev.guclu_yanlar.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  {g}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-semibold text-orange-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Gelişim Alanları
            </p>
            <ul className="space-y-1.5">
              {ev.gelistirilmesi_gerekenler.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  {g}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tavsiyeler */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Sonraki Adımlar İçin Tavsiyeler</p>
          <ul className="space-y-1.5">
            {ev.tavsiyeler.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                {t}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function SimulationChat({ config, onReset }: { config: SimConfig; onReset: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sistemMesaji, setSistemMesaji] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [bitti, setBitti] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [mesajSayisi, setMesajSayisi] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startSimulation() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/simulation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setSistemMesaji(data.sistem_mesaji);
      setMessages([{ role: "assistant", content: data.mesaj }]);
      setMesajSayisi(data.mesaj_sayisi);
      setStarted(true);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/simulation/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sistem_mesaji: sistemMesaji,
          mesaj_gecmisi: messages,
          kullanici_cevabi: userMsg,
          mesaj_sayisi: mesajSayisi,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.mesaj }]);
      setMesajSayisi(data.mesaj_sayisi);

      if (data.bitti) {
        setBitti(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getEvaluation() {
    setEvaluating(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/simulation/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mesaj_gecmisi: messages,
          pozisyon: config.pozisyon,
        }),
      });
      const data = await res.json();
      setEvaluation(data.degerlendirme);
    } finally {
      setEvaluating(false);
    }
  }

  if (!started) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="p-4 bg-emerald-100 rounded-full w-fit mx-auto">
          <Bot className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Simülasyon Hazır</h3>
          <p className="text-gray-500 mt-1 text-sm">
            <span className="font-medium text-gray-700">{config.pozisyon}</span>
            {config.sirket && ` — ${config.sirket}`} mülakatı başlayacak.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            AI mülakatçı sizi gerçekçi sorularla değerlendirecek ve cevaplarınıza göre derinleşecek.
          </p>
        </div>
        <button
          onClick={startSimulation}
          disabled={loading}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Hazırlanıyor...
            </span>
          ) : (
            "Mülakatı Başlat"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chat messages */}
      <div className="bg-gray-50 rounded-xl p-4 h-[420px] overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === "assistant" ? "bg-emerald-100" : "bg-blue-100"
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4 text-emerald-600" />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-white shadow-sm text-gray-800 rounded-tl-sm"
                  : "bg-blue-600 text-white rounded-tr-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!bitti ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Cevabınızı yazın..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 bg-white"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 text-center font-medium">
            Mülakat tamamlandı!
          </div>
          {!evaluation && (
            <div className="flex gap-3">
              <button
                onClick={getEvaluation}
                disabled={evaluating}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {evaluating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Değerlendiriliyor...
                  </span>
                ) : (
                  "Performans Raporumu Gör"
                )}
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Yeni Mülakat
              </button>
            </div>
          )}
        </div>
      )}

      {evaluation && (
        <EvaluationPanel ev={evaluation} pozisyon={config.pozisyon} />
      )}

      {evaluation && (
        <button
          onClick={onReset}
          className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
        >
          Yeni Mülakat Başlat
        </button>
      )}
    </div>
  );
}
