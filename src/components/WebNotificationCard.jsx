import React, { useState, useEffect } from "react";
import { Bell, Globe, Volume2, Clock } from "lucide-react";

export default function WebNotificationCard({
  settings,
  onOpenSettings,
  onTriggerWebNotification,
}) {
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Browser Anda belum mendukung Web Notification API.");
      return;
    }
    const res = await Notification.requestPermission();
    setPermission(res);
    if (res === "granted") {
      onTriggerWebNotification();
    }
  };

  const isGranted = permission === "granted";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Notifikasi Web Browser
              </h3>
              <p className="text-xs text-slate-400">
                Desktop Pop-up & Alarm Audio Otomatis
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
              isGranted
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isGranted ? "bg-emerald-400" : "bg-amber-400"}`}
            />
            {isGranted ? "Izin Aktif" : "Perlu Izin"}
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
            <span className="text-slate-300 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              Status Pop-up Browser
            </span>
            <span
              className={`font-semibold ${isGranted ? "text-emerald-400" : "text-amber-400"}`}
            >
              {isGranted ? "✅ Diizinkan" : "⚠️ Belum Diizinkan"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
            <span className="text-slate-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              Suara Alarm Chime
            </span>
            <span className="font-semibold text-indigo-300">
              {settings?.enableAudioAlert !== false
                ? "✅ Aktif"
                : "❌ Nonaktif"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Jadwal Notifikasi Sore
            </span>
            <span className="font-mono font-bold text-indigo-300">
              {settings?.logbookTime || "17:00"} WIB (Batas 23:59)
            </span>
          </div>
        </div>
      </div>

      {/* Action triggers */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        {!isGranted ? (
          <button
            onClick={handleRequestPermission}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Aktifkan Izin Notifikasi Browser Sekarang</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onTriggerWebNotification}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>🔔 Uji Pop-up & Suara</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition cursor-pointer text-center"
            >
              ⚙️ Atur Jam Pengingat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
