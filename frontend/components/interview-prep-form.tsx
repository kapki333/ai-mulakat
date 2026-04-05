"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, BookOpen, Building2, User, ChevronDown } from "lucide-react";

interface InterviewPrepFormProps {
  onResult: (data: unknown) => void;
}

const SEVIYELER = ["Junior", "Mid-level", "Senior", "Lead", "Manager"];

export function InterviewPrepForm({ onResult }: InterviewPrepFormProps) {
  const [pozisyon, setPozisyon] = useState("");
  const [sirket, setSirket] = useState("");
  const [seviye, setSeviye] = useState("Mid-level");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const kayitli = JSON.parse(localStorage.getItem("mulakat_ayarlari") || "{}");
    if (kayitli.pozisyon) setPozisyon(kayitli.pozisyon);
    if (kayitli.sirket) setSirket(kayitli.sirket);
    if (kayitli.seviye) setSeviye(kayitli.seviye);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pozisyon.trim()) return;

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/interview-prep/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pozisyon, sirket, seviye }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Bir hata oluştu.");
      }

      const data = await res.json();
      localStorage.setItem("mulakat_ayarlari", JSON.stringify({ pozisyon, sirket, seviye }));
      onResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Pozisyon Bilgileri
        </CardTitle>
        <p className="text-sm text-gray-500">
          Başvurduğunuz pozisyonu girin, size özel hazırlık planı oluşturalım.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Pozisyon */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Pozisyon Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={pozisyon}
              onChange={(e) => setPozisyon(e.target.value)}
              placeholder="Örn: Frontend Developer, Data Scientist, Product Manager"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              required
            />
          </div>

          {/* Şirket */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Şirket Adı <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              type="text"
              value={sirket}
              onChange={(e) => setSirket(e.target.value)}
              placeholder="Örn: Google, Trendyol, Getir"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Seviye */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Deneyim Seviyesi</label>
            <div className="relative">
              <select
                value={seviye}
                onChange={(e) => setSeviye(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none cursor-pointer"
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

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pozisyon.trim()}
            className={cn(
              "w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200",
              loading || !pozisyon.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Hazırlık Planı Oluşturuluyor...
              </span>
            ) : (
              "Hazırlık Planımı Oluştur"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
