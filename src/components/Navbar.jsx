import React from "react";
import { Sparkles, History, Settings, RefreshCw } from "lucide-react";

export default function Navbar({
  onOpenHistory,
  onOpenSettings,
  onOpenResetModal,
  onResetToday,
  isResetting,
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                MagangHub
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Reminder Web
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sistem Pengingat Logbook Otomatis (17:00–23:59 WIB)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logbook History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition cursor-pointer"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Riwayat Logbook</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition cursor-pointer"
            title="Pengaturan Notifikasi Web"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onOpenResetModal || onResetToday}
            disabled={isResetting}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition cursor-pointer"
            title="Pilih Opsi Reset Data (Mode Demo)"
          >
            <RefreshCw
              className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
