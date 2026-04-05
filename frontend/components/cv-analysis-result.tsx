"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Tag,
  Star,
  TrendingUp,
  User,
  Briefcase,
} from "lucide-react";
import type { AnalysisResult } from "./cv-uploader";

interface CvAnalysisResultProps {
  result: AnalysisResult;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-500" : "text-red-500";
  const bg =
    score >= 75 ? "bg-emerald-50 border-emerald-200" : score >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${bg}`}>
      <span className={`text-4xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-gray-500 mt-1">/ 100</span>
    </div>
  );
}

function IssueItem({ title, suggestion }: { title: string; suggestion: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100">
      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          {suggestion}
        </p>
      </div>
    </div>
  );
}

function SkillItem({ skill, reason }: { skill: string; reason: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-800">{skill}</p>
        <p className="text-xs text-gray-500 mt-0.5">{reason}</p>
      </div>
    </div>
  );
}

export function CvAnalysisResult({ result }: CvAnalysisResultProps) {
  const { analiz } = result;
  const totalIssues =
    analiz.yapisal_hatalar.length + analiz.icerik_hatalari.length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-0 shadow-md bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ScoreRing score={analiz.genel_puan} />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {analiz.tespit_edilen_sektör}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 border-0">
                  <User className="w-3 h-3 mr-1" />
                  {analiz.deneyim_seviyesi}
                </Badge>
                <Badge
                  className={`border-0 ${totalIssues > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {totalIssues} Sorun
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">{analiz.ozet}</p>
            </div>
          </div>

          {analiz.guclu_yonler.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Güçlü Yönler
                </p>
                <div className="flex flex-wrap gap-2">
                  {analiz.guclu_yonler.map((g) => (
                    <Badge key={g} className="bg-emerald-100 text-emerald-700 border-0 gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Tabs */}
      <Tabs defaultValue="hatalar">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="hatalar" className="gap-1.5 text-xs sm:text-sm">
            <XCircle className="w-4 h-4" />
            Sorunlar
            {totalIssues > 0 && (
              <Badge className="ml-1 bg-red-500 text-white border-0 text-xs px-1.5 py-0">
                {totalIssues}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="yetkinlikler" className="gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4" />
            Eksikler
            {analiz.eksik_yetkinlikler.length > 0 && (
              <Badge className="ml-1 bg-amber-500 text-white border-0 text-xs px-1.5 py-0">
                {analiz.eksik_yetkinlikler.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-1.5 text-xs sm:text-sm">
            <Tag className="w-4 h-4" />
            Anahtar Kelimeler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hatalar" className="mt-4 space-y-3">
          {analiz.yapisal_hatalar.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  Yapısal Hatalar ({analiz.yapisal_hatalar.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analiz.yapisal_hatalar.map((h, i) => (
                  <IssueItem key={i} title={h.hata} suggestion={h.oneri} />
                ))}
              </CardContent>
            </Card>
          )}
          {analiz.icerik_hatalari.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                  İçerik Hataları ({analiz.icerik_hatalari.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analiz.icerik_hatalari.map((h, i) => (
                  <IssueItem key={i} title={h.hata} suggestion={h.oneri} />
                ))}
              </CardContent>
            </Card>
          )}
          {totalIssues === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
              <p className="font-medium text-gray-700">Harika! Belirgin bir sorun tespit edilmedi.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="yetkinlikler" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-2">
              {analiz.eksik_yetkinlikler.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <Star className="w-12 h-12 text-amber-400" />
                  <p className="font-medium text-gray-700">Eksik yetkinlik bulunamadı.</p>
                </div>
              ) : (
                analiz.eksik_yetkinlikler.map((e, i) => (
                  <SkillItem key={i} skill={e.yetkinlik} reason={e.neden_onemli} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="mt-4 space-y-4">
          {(
            [
              { label: "Teknik", key: "teknik", color: "bg-blue-100 text-blue-700" },
              { label: "Sektörel", key: "sektörel", color: "bg-purple-100 text-purple-700" },
              { label: "Yumuşak Beceriler", key: "yumusak_beceriler", color: "bg-pink-100 text-pink-700" },
            ] as const
          ).map(({ label, key, color }) => {
            const keywords = analiz.anahtar_kelime_onerileri[key] ?? [];
            return (
              <Card key={key} className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {keywords.length === 0 ? (
                      <p className="text-sm text-gray-400">Öneri bulunamadı.</p>
                    ) : (
                      keywords.map((kw) => (
                        <Badge key={kw} className={`border-0 ${color}`}>
                          {kw}
                        </Badge>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
