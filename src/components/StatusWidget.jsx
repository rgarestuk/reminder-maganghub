import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileEdit,
  Check,
  ArrowRight,
} from "lucide-react";

export default function StatusWidget({
  todayData = {},
  onOpenDraft,
  onOpenLogbookModal,
}) {
  const {
    logbookSubmitted = false,
    logbookSubmitTime = null,
    status = "RED",
  } = todayData || {};

  // Status theme configuration
  let statusTheme = {
    bg: "from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30 shadow-rose-950/30",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    indicatorDot: "bg-rose-500 shadow-rose-500/50",
    title: "🔴 Belum Mengisi Logbook Hari Ini",
    description:
      "Batas waktu pengisian logbook harian dibuka sore hari mulai pukul 17:00 WIB hingga 23:59 WIB.",
  };

  if (status === "GREEN" || logbookSubmitted) {
    statusTheme = {
      bg: "from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30 shadow-emerald-950/30",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      indicatorDot: "bg-emerald-500 shadow-emerald-500/50 animate-pulse",
      title: "🟢 Logbook Selesai (All Done!)",
      description:
        "Luar biasa! Anda sudah mengisi dan menyelesaikan logbook harian hari ini.",
    };
  } else if (status === "YELLOW") {
    statusTheme = {
      bg: "from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/30 shadow-amber-950/30",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      indicatorDot: "bg-amber-500 shadow-amber-500/50",
      title: "🟡 Draft Tersimpan (Belum Disubmit)",
      description:
        "Anda memiliki catatan draf cepat yang siap disubmit menjadi logbook harian.",
    };
  }

  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${statusTheme.bg} p-6 sm:p-7 shadow-xl transition-all duration-300`}
    >
      {/* Decorative Glow Background */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Status Information */}
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusTheme.badgeBg}`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${statusTheme.indicatorDot}`}
              />
              Widget Status Logbook Hari Ini
            </span>
            <span className="text-xs font-medium text-slate-400">
              📅 {currentDateFormatted}
            </span>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              ⏰ Jadwal: 17:00 – 23:59 WIB
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {statusTheme.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {statusTheme.description}
            </p>
          </div>

          {/* Status Indicator Card */}
          <div className="pt-1">
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                logbookSubmitted
                  ? "bg-emerald-950/25 border-emerald-500/30 text-emerald-300 shadow-sm"
                  : status === "YELLOW"
                    ? "bg-amber-950/25 border-amber-500/30 text-amber-300"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    logbookSubmitted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : status === "YELLOW"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {logbookSubmitted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : status === "YELLOW" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-rose-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    Status Pengisian Logbook
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {logbookSubmitted
                      ? `Sudah Mengisi Logbook Hari Ini (${logbookSubmitTime || "17:15"} WIB)`
                      : status === "YELLOW"
                        ? "Draft Tersimpan (Belum Disubmit)"
                        : "Belum Mengisi Logbook Hari Ini (17:00 – 23:59 WIB)"}
                  </div>
                </div>
              </div>

              {logbookSubmitted && (
                <span className="self-start sm:self-center px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Tuntas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
          {!logbookSubmitted ? (
            <button
              onClick={onOpenLogbookModal}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 transition active:scale-[0.98] cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>
                {status === "YELLOW"
                  ? "Submit Logbook Sekarang"
                  : "Isi Logbook Hari Ini"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="px-5 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Sudah Mengisi Logbook Hari Ini
            </div>
          )}

          <button
            onClick={onOpenDraft}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition cursor-pointer"
          >
            ⚡ Buka / Tulis Quick Draft
          </button>
        </div>
      </div>
    </div>
  );
}
