import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getDb, saveDb, updateTodayStatus } from "./db.js";
import { initScheduler } from "./scheduler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend build files in production
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// Inisialisasi status hari ini dan schedule cron
updateTodayStatus();
initScheduler();

// --- 1. STATUS ---
app.get("/api/status/today", (req, res) => {
  const db = getDb();
  const today = updateTodayStatus();
  res.json({
    today,
    streak: db.streak,
    heatmap: db.heatmap,
  });
});

// --- 2. QUICK DRAFT ---
app.post("/api/drafts/save", (req, res) => {
  const { content } = req.body;
  const db = getDb();
  db.today.quickDraft = content || "";
  updateTodayStatus();
  res.json({ success: true, today: db.today });
});

// --- 3. LOGBOOK SUBMISSION & HISTORY ---
app.post("/api/logbooks/submit", (req, res) => {
  const { activity, learnings, obstacles } = req.body;
  const db = getDb();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const entry = {
    id: "log_" + Date.now(),
    date: todayStr,
    submitTime: timeStr,
    activity: activity || db.today.quickDraft || "Pekerjaan Harian Magang",
    learnings: learnings || "",
    obstacles: obstacles || "",
    status: "COMPLETED",
  };

  // Simpan ke riwayat logbook
  db.logbooks = [entry, ...(db.logbooks || [])];

  // Update status hari ini
  db.today.logbookSubmitted = true;
  db.today.logbookSubmitTime = timeStr;
  db.today.status = "GREEN";

  // Update Heatmap
  db.heatmap = db.heatmap || {};
  db.heatmap[todayStr] = (db.heatmap[todayStr] || 0) + 1;

  // Update Streak
  const lastComp = db.streak.lastCompletedDate;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (!lastComp) {
    db.streak.currentStreak = 1;
  } else if (lastComp === yesterdayStr) {
    db.streak.currentStreak += 1;
  } else if (lastComp === todayStr) {
    // Already counted today
  } else {
    // Missed a day
    db.streak.currentStreak = 1;
  }

  if (db.streak.currentStreak > (db.streak.longestStreak || 0)) {
    db.streak.longestStreak = db.streak.currentStreak;
  }
  db.streak.lastCompletedDate = todayStr;

  saveDb(db);
  res.json({
    success: true,
    logbook: entry,
    today: db.today,
    streak: db.streak,
  });
});

app.get("/api/logbooks", (req, res) => {
  const db = getDb();
  res.json(db.logbooks || []);
});

// --- 4. SETTINGS ---
app.get("/api/settings", (req, res) => {
  const db = getDb();
  res.json(db.settings);
});

app.post("/api/settings", (req, res) => {
  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  initScheduler(); // Restart scheduler dengan setting baru
  res.json({ success: true, settings: db.settings });
});

// --- RESET ENDPOINTS (MODE DEMO & TESTING) ---
// 1. Reset Logbook Hari Ini (Widget & Riwayat Hari Ini, Streak Aman)
app.post("/api/dev/reset-today-status", (req, res) => {
  const db = getDb();
  const todayStr = new Date().toISOString().split("T")[0];
  db.today = {
    date: todayStr,
    logbookSubmitted: false,
    logbookSubmitTime: null,
    quickDraft: "",
    status: "RED",
  };
  // Hapus entri riwayat logbook khusus hari ini
  db.logbooks = (db.logbooks || []).filter((item) => item.date !== todayStr);
  saveDb(db);
  res.json({ success: true, today: db.today, logbooks: db.logbooks });
});

// 2. Reset Visual Tracker (Streak & Heatmap, Widget & Riwayat Logbook Aman)
app.post("/api/dev/reset-visual-tracker", (req, res) => {
  const db = getDb();
  db.streak = {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  };
  db.heatmap = {};
  saveDb(db);
  res.json({ success: true, streak: db.streak, heatmap: db.heatmap });
});

// Backwards compatibility alias
app.post("/api/dev/reset-today", (req, res) => {
  const db = getDb();
  const todayStr = new Date().toISOString().split("T")[0];
  db.today = {
    date: todayStr,
    logbookSubmitted: false,
    logbookSubmitTime: null,
    quickDraft: "",
    status: "RED",
  };
  saveDb(db);
  res.json({ success: true, today: db.today });
});

app.post("/api/logbooks/clear", (req, res) => {
  const db = getDb();
  db.logbooks = [];
  saveDb(db);
  res.json({ success: true, logbooks: [] });
});

// Wildcard fallback untuk SPA React
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `🚀 MagangHub Backend Server berjalan di http://localhost:${PORT}`,
    );
  });
}

export default app;
