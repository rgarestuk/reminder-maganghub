import React, { useState, useEffect } from "react";
import { X, Save, Globe, Bell, Check, Clock, Volume2 } from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onTriggerWebNotification,
}) {
  const [form, setForm] = useState(settings || {});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen && settings) {
      setForm(settings);
      setIsSaved(false);
      setIsSaving(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(form);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsSaving(false);
        onClose(); // Otomatis tutup modal setelah berhasil menyimpan
      }, 700);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Pengaturan Notifikasi Web
            </h3>
            <p className="text-xs text-slate-400">
              Atur pop-up browser, suara alarm, dan jadwal pengingat logbook
            </p>
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
          onSubmit={handleSave}
          className="p-6 overflow-y-auto space-y-6 flex-1"
        >
          {/* Section 1: Web Browser Notifications */}
          <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Pengaturan Notifikasi Browser
            </h4>
            <p className="text-xs text-slate-400">
              Notifikasi pop-up & suara alarm muncul otomatis di layar komputer
              Anda.
            </p>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableWebNotification ?? true}
                  onChange={(e) =>
                    handleChange("enableWebNotification", e.target.checked)
                  }
                  className="rounded accent-sky-500"
                />
                <span className="text-xs text-slate-200 font-medium">
                  Aktifkan <b>Pop-up Notifikasi Web Browser</b>
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableAudioAlert ?? true}
                  onChange={(e) =>
                    handleChange("enableAudioAlert", e.target.checked)
                  }
                  className="rounded accent-sky-500"
                />
                <span className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  Bunyikan nada dering / suara chime alarm
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onTriggerWebNotification}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition cursor-pointer flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Uji Notifikasi Pop-up & Suara Sekarang</span>
              </button>
            </div>
          </div>

          {/* Section 2: Logbook Timing & Smart Escalation */}
          <div className="space-y-4 pt-1">
            <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Jadwal Pengingat Logbook Sore
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-200">
                  Waktu Mulai Pengingat
                </span>
                <input
                  type="time"
                  value={form.logbookTime || "17:00"}
                  onChange={(e) => handleChange("logbookTime", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Batas pengisian: 23:59 WIB
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-200">
                  Ulangi Pengingat (Escalation)
                </span>
                <select
                  value={form.escalationIntervalMinutes || 30}
                  onChange={(e) =>
                    handleChange(
                      "escalationIntervalMinutes",
                      Number(e.target.value),
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  <option value={15}>Setiap 15 Menit</option>
                  <option value={30}>Setiap 30 Menit</option>
                  <option value={60}>Setiap 60 Menit</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Jika belum disubmit
                </p>
              </div>
            </div>

            <div className="space-y-2.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableEscalation ?? true}
                  onChange={(e) =>
                    handleChange("enableEscalation", e.target.checked)
                  }
                  className="rounded accent-amber-500"
                />
                <span className="text-xs text-slate-300">
                  Ulangi notifikasi antara <b>18:00 – 23:59 WIB</b> jika logbook
                  belum disubmit
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.workDaysOnly ?? true}
                  onChange={(e) =>
                    handleChange("workDaysOnly", e.target.checked)
                  }
                  className="rounded accent-indigo-500"
                />
                <span className="text-xs text-slate-300">
                  Hanya aktif di <b>Hari Kerja (Senin–Jumat)</b>, nonaktif di
                  akhir pekan
                </span>
              </label>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {isSaved ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4" /> Pengaturan Berhasil Disimpan!
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Jadwal langsung aktif
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition active:scale-[0.98] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
