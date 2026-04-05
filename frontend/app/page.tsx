import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  {
    id: 1,
    href: "/cv-analiz",
    icon: FileText,
    title: "CV Analizi",
    description:
      "PDF CV'nizi yükleyin. Yapısal hatalar, eksik yetkinlikler ve sektörel anahtar kelimeler için AI destekli analiz alın.",
    badge: "Adım 1",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["Yapısal hata tespiti", "Anahtar kelime önerileri", "Puan değerlendirmesi"],
  },
  {
    id: 2,
    href: "/mulakat-hazirligi",
    icon: BookOpen,
    title: "Mülakat Hazırlığı",
    description:
      "Hedef pozisyonunuzu girin. CV'nize özel kişiselleştirilmiş çalışma yol haritası ve soru bankası oluşturun.",
    badge: "Adım 2",
    badgeColor: "bg-purple-100 text-purple-700",
    features: ["Kişiselleştirilmiş yol haritası", "Zor soru bankası", "Cevap stratejileri"],
  },
  {
    id: 3,
    href: "/simulasyon",
    icon: MessageSquare,
    title: "Canlı Simülasyon",
    description:
      "AI mülakatçı ile gerçek mülakat pratiği yapın. Dinamik sorularla test edilin, sonunda detaylı değerlendirme alın.",
    badge: "Adım 3",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["Gerçek mülakat deneyimi", "Dinamik sorgulama", "Detaylı değerlendirme raporu"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">AI Kariyer Platformu</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/cv-analiz" className="hover:text-blue-600 transition-colors">CV Analizi</Link>
            <Link href="/mulakat-hazirligi" className="hover:text-blue-600 transition-colors">Hazırlık</Link>
            <Link href="/simulasyon" className="hover:text-blue-600 transition-colors">Simülasyon</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <Badge className="mb-6 bg-blue-100 text-blue-700 border-0 px-4 py-1 text-sm">
          GPT-4o-mini Destekli
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          AI İş Görüşmesi
          <span className="text-blue-600 block">Hazırlık Platformu</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          CV&apos;nizi analiz edin, kişiselleştirilmiş hazırlık planınızı oluşturun ve
          canlı mülakat simülasyonuyla kendinizi test edin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cv-analiz"
            className={cn(buttonVariants({ size: "lg" }), "bg-blue-600 hover:bg-blue-700 text-white px-8")}
          >
            Hemen Başla <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="/simulasyon"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8")}
          >
            Simülasyonu Dene
          </Link>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Card
                key={mod.id}
                className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge className={`text-xs border-0 ${mod.badgeColor}`}>{mod.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{mod.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {mod.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 mb-5">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={mod.href}
                    className={cn(buttonVariants(), "w-full bg-gray-900 hover:bg-gray-700 text-white justify-center")}
                  >
                    Başla <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
