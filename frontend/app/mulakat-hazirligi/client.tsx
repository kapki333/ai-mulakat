"use client";

import { useState } from "react";
import { InterviewPrepForm } from "@/components/interview-prep-form";
import { InterviewPrepResult } from "@/components/interview-prep-result";

export function InterviewPrepClient() {
  const [result, setResult] = useState<unknown>(null);

  if (result) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setResult(null)}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          ← Yeni Pozisyon Gir
        </button>
        <InterviewPrepResult data={result as Parameters<typeof InterviewPrepResult>[0]["data"]} />
      </div>
    );
  }

  return <InterviewPrepForm onResult={setResult} />;
}
