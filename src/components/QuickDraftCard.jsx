import React, { useState, useEffect } from "react";
import { FileText, Wand2, Check } from "lucide-react";

export default function QuickDraftCard({
  draftContent,
  onSaveDraft,
  onGenerateLogbook,
}) {
  const [text, setText] = useState(draftContent || "");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setText(draftContent || "");
  }, [draftContent]);

  const handleChange = (val) => {
    setText(val);
    onSaveDraft(val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Catatan Cepat / Quick Draft
              </h3>
              <p className="text-xs text-slate-400">
                Catat poin kerja sepanjang hari, generate logbook saat jam
                pulang
              </p>
            </div>
          </div>

          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md">
            {isSaved ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" /> Tersimpan
              </span>
            ) : (
              "Autosave aktif"
            )}
          </span>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Contoh:&#10;- Slicing UI halaman login dan dashboard&#10;- Fixing responsive styling di mobile&#10;- Diskusi API contract bareng backend engineer"
            className="w-full h-48 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 font-mono resize-none transition outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Action to Generate Logbook */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {text.trim().split("\n").filter(Boolean).length} poin tugas tercatat
        </span>
        <button
          onClick={() => onGenerateLogbook(text)}
          disabled={!text.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition active:scale-[0.98] cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Generate ke Logbook</span>
        </button>
      </div>
    </div>
  );
}
