import React from "react";
import { X, Clock, BookOpen, AlertCircle, FileText } from "lucide-react";

export default function LogbookHistoryModal({
  isOpen,
  onClose,
  logbooks = [],
}) {
  if (!isOpen) return null;

  const exportToCSV = () => {
    if (logbooks.length === 0) return;
    const headers = [
      "ID",
      "Tanggal",
      "Jam Submit",
      "Aktivitas",
      "Pembelajaran",
      "Kendala",
    ];
    const rows = logbooks.map((l) => [
      l.id,
      l.date,
      l.submitTime || "-",
      `"${(l.activity || "").replace(/"/g, '""')}"`,
      `"${(l.learnings || "").replace(/"/g, '""')}"`,
      `"${(l.obstacles || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `maganghub_logbook_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (logbooks.length === 0) return;
    const jsonStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(logbooks, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute(
      "download",
      `maganghub_logbook_${new Date().toISOString().split("T")[0]}.json`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Riwayat & Ekspor Logbook
              </h3>
              <p className="text-xs text-slate-400">
                Total {logbooks.length} entri logbook tersimpan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              disabled={logbooks.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 disabled:opacity-40 transition cursor-pointer"
              title="Ekspor ke format CSV / Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={exportToJSON}
              disabled={logbooks.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 disabled:opacity-40 transition cursor-pointer"
              title="Ekspor ke format JSON"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Ekspor JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {logbooks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">
                Belum ada riwayat logbook tersimpan.
              </p>
              <p className="text-xs mt-1">
                Submit logbook pertama Anda dari dashboard!
              </p>
            </div>
          ) : (
            logbooks.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition"
              >
                {/* Header item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Disubmit
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      📅 {log.date}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {log.submitTime || "-"} WIB
                    </span>
                    <span>•</span>
                    <span>{log.durationHours || 8} Jam</span>
                  </div>
                </div>

                {/* Aktivitas */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-400" /> Aktivitas /
                    Tugas:
                  </div>
                  <div className="text-xs font-mono text-slate-200 whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    {log.activity}
                  </div>
                </div>

                {/* Pembelajaran (jika ada) */}
                {log.learnings && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-400" />{" "}
                      Pembelajaran yang Diperoleh:
                    </div>
                    <div className="text-xs text-emerald-200/90 whitespace-pre-wrap bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                      {log.learnings}
                    </div>
                  </div>
                )}

                {/* Kendala (jika ada) */}
                {log.obstacles && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-400" /> Kendala
                      yang Dialami:
                    </div>
                    <div className="text-xs text-amber-200/90 whitespace-pre-wrap bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                      {log.obstacles}
                    </div>
                  </div>
                )}

                {log.notes && (
                  <div className="text-[11px] text-slate-400 italic pt-1">
                    Catatan: {log.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
