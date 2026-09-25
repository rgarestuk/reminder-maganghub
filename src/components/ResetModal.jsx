import React, { useState } from "react";
import {
  X,
  RefreshCw,
  Clock,
  Flame,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export default function ResetModal({
  isOpen,
  onClose,
  onResetTodayStatus,
  onResetVisualTracker,
  isResetting,
}) {
  const [confirmTarget, setConfirmTarget] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setConfirmTarget(null);
    onClose();
  };

  const handleExecuteConfirm = async () => {
    if (!confirmTarget) return;
    if (confirmTarget.type === "today") {
      await onResetTodayStatus();
    } else if (confirmTarget.type === "visual") {
      await onResetVisualTracker();
    }
    setConfirmTarget(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {confirmTarget
                  ? "Konfirmasi Tindakan Reset"
                  : "Pilih Opsi Reset Data"}
              </h3>
              <p className="text-xs text-slate-400">
                {confirmTarget
                  ? "Pastikan Anda yakin sebelum melanjutkan"
                  : "Pilih 1 dari 2 opsi reset data di bawah ini"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmTarget ? (
          <div className="p-6 space-y-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-200">
                  Apakah Anda yakin ingin mereset {confirmTarget.title}?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {confirmTarget.warningText}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Efek yang terjadi:</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {confirmTarget.effects.map((ef, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{ef}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirm}
                disabled={isResetting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition active:scale-[0.98] cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`}
                />
                <span>
                  {isResetting ? "Mereset..." : "Ya, Lanjutkan Reset"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Selection 2 Options */
          <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Pilihan 1: Reset Logbook Hari Ini */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/40 transition space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>1. Reset Logbook Hari Ini</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Status widget kembali menjadi{" "}
                      <strong className="text-rose-400">
                        Merah (Belum Isi Logbook)
                      </strong>{" "}
                      dan otomatis mereset riwayat logbook hari ini.
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      ✓ Hitungan streak & visual tracker TIDAK ikut ter-reset
                      (tetap aman).
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-1 border-t border-slate-800/60">
                <button
                  onClick={() =>
                    setConfirmTarget({
                      type: "today",
                      title: "Logbook Hari Ini",
                      warningText:
                        "Status widget hari ini akan dikembalikan ke Belum Submit (Merah) dan riwayat logbook hari ini akan dihapus.",
                      effects: [
                        "Status widget kembali menjadi Merah (Belum Isi Logbook)",
                        "Quick draft hari ini dikosongkan",
                        "Riwayat logbook hari ini otomatis dihapus",
                        "Hitungan streak & visual tracker TETAP AMAN (tidak direset)",
                      ],
                    })
                  }
                  disabled={isResetting}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Logbook Hari Ini</span>
                </button>
              </div>
            </div>

            {/* Pilihan 2: Reset Visual Tracker */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-orange-500/40 transition space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 mt-0.5 shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>2. Reset Visual Tracker</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Streak tracker kembali menjadi kosong (
                      <strong className="text-orange-400">0 Hari</strong>) dan
                      membersihkan kalender heatmap aktivitas.
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      ✓ Status widget hari ini & riwayat logbook TIDAK ikut
                      ter-reset (tetap aman).
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-1 border-t border-slate-800/60">
                <button
                  onClick={() =>
                    setConfirmTarget({
                      type: "visual",
                      title: "Visual Tracker (Streak & Heatmap)",
                      warningText:
                        "Streak hari aktif akan diatur ulang ke 0 hari dan kotak kalender heatmap aktivitas akan dikosongkan.",
                      effects: [
                        "Streak tracker kembali menjadi kosong (0 Hari)",
                        "Kotak kalender heatmap aktivitas dibersihkan / kosong",
                        "Status widget hari ini & riwayat logbook TETAP AMAN (tidak direset)",
                      ],
                    })
                  }
                  disabled={isResetting}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Visual Tracker</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer (when not confirming) */}
        {!confirmTarget && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
