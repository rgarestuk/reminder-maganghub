import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import StatusWidget from "./components/StatusWidget";
import QuickDraftCard from "./components/QuickDraftCard";
import StreakHeatmap from "./components/StreakHeatmap";
import WebNotificationCard from "./components/WebNotificationCard";
import LogbookModal from "./components/LogbookModal";
import LogbookHistoryModal from "./components/LogbookHistoryModal";
import SettingsModal from "./components/SettingsModal";
import ResetModal from "./components/ResetModal";
import { AlertTriangle, X as CloseIcon, ArrowRight } from "lucide-react";

const DEFAULT_SETTINGS = {
  enableWebNotification: true,
  enableAudioAlert: true,
  logbookTime: "17:00",
  enableEscalation: true,
  escalationIntervalMinutes: 30,
  workDaysOnly: true,
};

// Helper aman untuk fetch JSON yang kebal dari error HTML/DOCTYPE fallback
const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn(`safeFetchJson warning on ${url}:`, err);
    return null;
  }
};

export default function App() {
  const [activeToast, setActiveToast] = useState(null);
  const [todayData, setTodayData] = useState({
    date: new Date().toISOString().split("T")[0],
    logbookSubmitted: false,
    logbookSubmitTime: null,
    quickDraft: "",
    status: "RED",
  });

  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [heatmap, setHeatmap] = useState({});
  const [logbooks, setLogbooks] = useState([]);
  const [settings, setSettings] = useState(() => {
    try {
      const local = localStorage.getItem("maganghub_settings");
      if (local) return { ...DEFAULT_SETTINGS, ...JSON.parse(local) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Modals
  const [isLogbookModalOpen, setIsLogbookModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const lastNotifiedMinuteRef = useRef("");

  // Load initial data
  const fetchData = async () => {
    try {
      const [statusRes, logbooksRes, settingsRes] = await Promise.all([
        safeFetchJson("/api/status/today"),
        safeFetchJson("/api/logbooks"),
        safeFetchJson("/api/settings"),
      ]);

      if (statusRes && statusRes.today) setTodayData(statusRes.today);
      if (statusRes && statusRes.streak) setStreak(statusRes.streak);
      if (statusRes && statusRes.heatmap) setHeatmap(statusRes.heatmap);
      if (logbooksRes && Array.isArray(logbooksRes)) setLogbooks(logbooksRes);
      if (
        settingsRes &&
        typeof settingsRes === "object" &&
        Object.keys(settingsRes).length > 0
      ) {
        setSettings((prev) => {
          const updated = { ...prev, ...settingsRes };
          try {
            localStorage.setItem("maganghub_settings", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Web Browser Audio / Beep Chime
  const playNotificationSound = () => {
    if (settings?.enableAudioAlert === false) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (err) {
      console.warn("Audio Context error:", err);
    }
  };

  // Trigger Web Notification Pop-up & Audio Chime
  const triggerWebNotification = async (customTitle, customBody) => {
    const title =
      typeof customTitle === "string" && customTitle.trim()
        ? customTitle
        : "⚠️ PENGINGAT LOGBOOK MAGANGHUB";
    const body =
      typeof customBody === "string" && customBody.trim()
        ? customBody
        : "isi absen buruan daripada kena potong gaji!";

    // 1. Getar perangkat jika didukung (Mobile Vibration)
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {}

    // 2. Bunyikan Suara Chime Audio
    playNotificationSound();

    // 3. Munculkan In-App Toast Banner di layar
    setActiveToast({
      id: Date.now(),
      title,
      body,
    });

    // 4. Picu Native Web Browser / OS Desktop Notification jika didukung
    if (typeof window !== "undefined" && "Notification" in window) {
      let permission = Notification.permission;
      if (permission === "default") {
        try {
          permission = await Notification.requestPermission();
        } catch {}
      }

      if (permission === "granted") {
        try {
          const notif = new Notification(title, {
            body: body,
            icon: "https://cdn-icons-png.flaticon.com/512/3239/3239952.png",
            badge: "https://cdn-icons-png.flaticon.com/512/3239/3239952.png",
            requireInteraction: true,
          });
          notif.onclick = () => {
            window.focus();
            setIsLogbookModalOpen(true);
            notif.close();
          };
        } catch (err) {
          // Normal pada sebagian browser mobile (misal Android Chrome memerlukan ServiceWorker)
          console.warn("Native Notification constructor note:", err);
        }
      }
    }
  };

  // Background Clock Checker: triggers notification at 17:00 WIB if tab is open
  useEffect(() => {
    const timer = setInterval(() => {
      if (todayData.logbookSubmitted) return;
      if (settings?.enableWebNotification === false) return;

      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, "0");
      const currentMin = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHour}:${currentMin}`;

      const targetTime = settings?.logbookTime || "17:00";

      if (
        currentTimeStr === targetTime &&
        lastNotifiedMinuteRef.current !== currentTimeStr
      ) {
        lastNotifiedMinuteRef.current = currentTimeStr;
        triggerWebNotification(
          "⚠️ PENGINGAT LOGBOOK SORE",
          "isi absen buruan daripada kena potong gaji! Batas submit dibuka hingga jam 23:59 WIB.",
        );
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [todayData.logbookSubmitted, settings]);

  const handleSaveDraft = async (content) => {
    try {
      const data = await safeFetchJson("/api/drafts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (data && data.today) setTodayData(data.today);
    } catch (err) {
      console.error("Save draft error:", err);
    }
  };

  const handleSubmitLogbook = async ({ activity, learnings, obstacles }) => {
    try {
      const data = await safeFetchJson("/api/logbooks/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity,
          learnings,
          obstacles,
        }),
      });
      if (data && data.today) setTodayData(data.today);
      if (data && data.streak) setStreak(data.streak);
      fetchData(); // Refresh all
    } catch (err) {
      console.error("Submit logbook error:", err);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    // 1. Save locally to state & localStorage immediately
    setSettings(newSettings);
    try {
      localStorage.setItem("maganghub_settings", JSON.stringify(newSettings));
    } catch (err) {
      console.warn("LocalStorage save failed:", err);
    }

    // 2. Persist to backend server API
    try {
      const data = await safeFetchJson("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (data && data.settings) {
        setSettings(data.settings);
        try {
          localStorage.setItem(
            "maganghub_settings",
            JSON.stringify(data.settings),
          );
        } catch {}
      }
    } catch (err) {
      console.warn("Server settings save error (saved to localStorage):", err);
    }
  };

  // 1. Reset Logbook Hari Ini pada Widget & Riwayat Hari Ini (Streak Tetap Aman)
  const handleResetTodayStatus = async () => {
    setIsResetting(true);
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Update state frontend seketika
    setTodayData({
      date: todayStr,
      logbookSubmitted: false,
      logbookSubmitTime: null,
      quickDraft: "",
      status: "RED",
    });
    setLogbooks((prev) =>
      Array.isArray(prev) ? prev.filter((item) => item.date !== todayStr) : [],
    );
    try {
      localStorage.removeItem("maganghub_latest_logbook");
    } catch {}

    // 2. Kirim request ke backend API
    try {
      const data = await safeFetchJson("/api/dev/reset-today-status", {
        method: "POST",
      });
      if (data && data.today) setTodayData(data.today);
      if (data && data.logbooks !== undefined) {
        setLogbooks(data.logbooks);
      }
    } catch (err) {
      console.error("Reset today status error:", err);
    } finally {
      setTimeout(() => setIsResetting(false), 400);
    }
  };

  // 2. Reset Visual Tracker (Streak & Heatmap, Widget & Riwayat Logbook Tetap Aman)
  const handleResetVisualTracker = async () => {
    setIsResetting(true);

    // 1. Update state frontend seketika (Streak 0, Heatmap Kosong)
    setStreak({
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
    });
    setHeatmap({});

    // 2. Kirim request ke backend API
    try {
      const data = await safeFetchJson("/api/dev/reset-visual-tracker", {
        method: "POST",
      });
      if (data && data.streak) setStreak(data.streak);
      if (data && data.heatmap) setHeatmap(data.heatmap);
    } catch (err) {
      console.error("Reset visual tracker error:", err);
    } finally {
      setTimeout(() => setIsResetting(false), 400);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Hapus semua riwayat logbook tersimpan?")) {
      return;
    }
    try {
      const data = await safeFetchJson("/api/logbooks/clear", {
        method: "POST",
      });
      if (data && data.success) {
        setLogbooks([]);
      }
    } catch (err) {
      console.error("Clear logbooks error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Core Widget 1: Today's Logbook Status Widget (17:00 - 23:59 WIB) */}
        <StatusWidget
          todayData={todayData}
          onOpenDraft={() => {
            const draftEl = document.getElementById("quick-draft-section");
            if (draftEl) draftEl.scrollIntoView({ behavior: "smooth" });
          }}
          onOpenLogbookModal={() => setIsLogbookModalOpen(true)}
        />

        {/* Section 2: Quick Draft & Web Notification Cards */}
        <div
          id="quick-draft-section"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-7">
            <QuickDraftCard
              draftContent={todayData.quickDraft}
              onSaveDraft={handleSaveDraft}
              onGenerateLogbook={(draftText) => {
                setIsLogbookModalOpen(true);
              }}
            />
          </div>

          <div className="lg:col-span-5">
            <WebNotificationCard
              settings={settings}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onTriggerWebNotification={triggerWebNotification}
            />
          </div>
        </div>

        {/* Section 3: Streak Tracker & GitHub Heatmap Calendar */}
        <StreakHeatmap streak={streak} heatmap={heatmap} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            MagangHub Reminder • Sistem Pengingat Logbook Web Browser (17:00 –
            23:59 WIB)
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>🔴 Belum Isi Logbook</span>
            <span>🟡 Draft Tersimpan</span>
            <span>🟢 Selesai</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LogbookModal
        isOpen={isLogbookModalOpen}
        onClose={() => setIsLogbookModalOpen(false)}
        initialActivity={todayData.quickDraft}
        onSubmitLogbook={handleSubmitLogbook}
      />

      <LogbookHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        logbooks={logbooks}
        onClearHistory={handleClearHistory}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onTriggerWebNotification={triggerWebNotification}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onResetTodayStatus={handleResetTodayStatus}
        onResetVisualTracker={handleResetVisualTracker}
        isResetting={isResetting}
      />

      {/* Floating In-App Notification Toast */}
      {activeToast && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-300 inset-x-3 sm:inset-x-auto sm:right-6 sm:left-auto sm:w-full sm:max-w-md"
          style={{
            top: "clamp(4.75rem, calc(env(safe-area-inset-top, 0px) + 4.5rem), 7rem)",
          }}
        >
          <div className="pointer-events-auto bg-slate-900/98 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-4.5 shadow-2xl backdrop-blur-xl flex items-start gap-3 sm:gap-3.5 ring-4 ring-amber-500/20">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 animate-bounce">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider truncate">
                  {activeToast.title}
                </h4>
                <button
                  onClick={() => setActiveToast(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                  aria-label="Tutup notifikasi"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug break-words">
                {activeToast.body}
              </p>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setActiveToast(null);
                    setIsLogbookModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  <span>Buka Form Logbook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
