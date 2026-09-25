import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Info,
} from "lucide-react";

export default function LogbookModal({
  isOpen,
  onClose,
  initialActivity,
  onSubmitLogbook,
}) {
  const [activity, setActivity] = useState("");
  const [learnings, setLearnings] = useState("");
  const [obstacles, setObstacles] = useState("");
  const [autoOpenMonev, setAutoOpenMonev] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActivity(initialActivity || "");
      setLearnings("");
      setObstacles("");
      setCopied(false);
    }
  }, [isOpen, initialActivity]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const monevUrl = `https://monev.maganghub.kemnaker.go.id/dashboard/riwayat?date=${todayStr}&view=edit`;

  const handleCopyFormattedText = () => {
    const textToCopy = `AKTIVITAS:\n${activity}\n\nPEMBELAJARAN:\n${learnings || "-"}\n\nMASALAH / KENDALA:\n${obstacles || "-"}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.trim()) return;

    setIsSubmitting(true);
    try {
      // Simpan juga ke localStorage agar bisa dibaca otomatis oleh Userscript/Bookmarklet Autofill
      const logbookPayload = {
        date: todayStr,
        activity,
        learnings,
        obstacles,
        timestamp: Date.now(),
      };
      try {
        localStorage.setItem(
          "maganghub_latest_logbook",
          JSON.stringify(logbookPayload),
        );
      } catch (err) {
        console.warn("LocalStorage save failed:", err);
      }

      await onSubmitLogbook({
        activity,
        learnings,
        obstacles,
      });

      // Buka website Monev MagangHub jika opsi aktif
      if (autoOpenMonev) {
        window.open(monevUrl, "_blank", "noopener,noreferrer");
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Submit Logbook Harian
              </h3>
              <p className="text-xs text-slate-400">
                Lengkapi rincian aktivitas, pembelajaran, dan masalah magang
                hari ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4 flex-1"
        >
          {/* Reminder Note Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>Catatan Pengingat Pengisian:</span>
              </div>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  Jangan lupa mengisi 3 kolom wajib:{" "}
                  <strong className="text-slate-100">Aktivitas</strong>,{" "}
                  <strong className="text-emerald-300">
                    Pembelajaran yang Diperoleh
                  </strong>
                  , dan{" "}
                  <strong className="text-amber-300">
                    Masalah yang Dihadapi
                  </strong>
                  .
                </li>
                <li>
                  Disarankan untuk mengklik tombol{" "}
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/40">
                    <Copy className="w-3 h-3 text-indigo-400 inline" /> Salin
                    Format
                  </span>{" "}
                  sebelum klik{" "}
                  <strong className="text-indigo-400">
                    Submit & Buka Monev MagangHub
                  </strong>{" "}
                  agar seluruh isian tersalin rapi ke clipboard Anda.
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom 1: Aktivitas / Pekerjaan Harian */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                Aktivitas / Pekerjaan Harian{" "}
                <span className="text-rose-400">*</span>
              </span>
            </label>
            <textarea
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Contoh:&#10;- Slicing UI halaman profil dan integrasi endpoint update&#10;- Perbaikan bug validasi form login&#10;- Mengikuti daily standup meeting"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 font-mono outline-none resize-none"
            />
          </div>

          {/* Kolom 2: Pembelajaran yang Diperoleh */}
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Pembelajaran yang Diperoleh (Key Learnings){" "}
                <span className="text-rose-400">*</span>
              </span>
            </label>
            <textarea
              required
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="Apa ilmu, teknik, atau pengalaman baru yang kamu pelajari hari ini? (Contoh: Memahami cara optimasi query dan manajemen state React)"
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 font-mono outline-none resize-none"
            />
          </div>

          {/* Kolom 3: Kendala yang Dialami */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Masalah yang dihadapi (Obstacles){" "}
                <span className="text-rose-400">*</span>
              </span>
            </label>
            <textarea
              required
              value={obstacles}
              onChange={(e) => setObstacles(e.target.value)}
              placeholder="Apakah ada kendala teknis/komunikasi? Bagaimana solusinya? (Contoh: Sempat error CORS pada API local, teratasi setelah configure proxy di vite.config.js)"
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 font-mono outline-none resize-none"
            />
          </div>

          {/* Opsi Integrasi Monev Kemnaker */}
          <div className="p-3.5 bg-indigo-950/30 rounded-xl border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOpenMonev}
                  onChange={(e) => setAutoOpenMonev(e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Otomatis buka website Monev MagangHub setelah submit
                </span>
              </label>

              <button
                type="button"
                onClick={handleCopyFormattedText}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                title="Salin isi seluruh kolom logbook ke clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      Tersalin!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-indigo-400" />
                    <span>Salin Format</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Target URL:{" "}
              <a
                href={monevUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline font-mono text-[10px] break-all hover:text-indigo-300"
              >
                {monevUrl}
              </a>
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Data akan tersimpan di database lokal & streak diperbarui
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !activity.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition active:scale-[0.98] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting
                    ? "Menyimpan..."
                    : "Submit & Buka Monev MagangHub"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
