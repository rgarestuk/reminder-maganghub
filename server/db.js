import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pada Vercel serverless, filesystem read-only kecuali /tmp
const isVercel = !!process.env.VERCEL;
const DB_FILE = isVercel
  ? path.join("/tmp", "db.json")
  : path.join(__dirname, "..", "data", "db.json");

// Pastikan direktori data ada (hanya untuk lokal, /tmp sudah ada di Vercel)
if (!isVercel) {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Skema default
const defaultData = {
  settings: {
    // Web Browser Notifications
    enableWebNotification: true,
    enableAudioAlert: true,

    // Logbook & Escalation Timing
    enableLogbookReminder: true,
    logbookTime: "17:00", // Jam 17:00 WIB
    enableEscalation: true,
    escalationIntervalMinutes: 30,
    escalationStartTime: "17:00",
    escalationEndTime: "23:59",
    workDaysOnly: true,
    workDays: [1, 2, 3, 4, 5], // Senin - Jumat
  },
  today: {
    date: new Date().toISOString().split("T")[0],
    logbookSubmitted: false,
    logbookSubmitTime: null,
    quickDraft: "",
    status: "RED", // RED, YELLOW, GREEN
  },
  logbooks: [],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  },
  heatmap: {},
};

let memoryDb = null;

export function getDb() {
  if (memoryDb) {
    return memoryDb;
  }
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = { ...defaultData, ...JSON.parse(raw) };
    } else {
      memoryDb = { ...defaultData };
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
    }
    return memoryDb;
  } catch (err) {
    console.error("Error reading db:", err);
    memoryDb = { ...defaultData };
    return memoryDb;
  }
}

export function saveDb(data) {
  try {
    memoryDb = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving db:", err);
    return false;
  }
}

export function updateTodayStatus() {
  const db = getDb();
  const todayStr = new Date().toISOString().split("T")[0];

  if (db.today.date !== todayStr) {
    // Reset hari baru jika tanggal berbeda
    db.today = {
      date: todayStr,
      logbookSubmitted: false,
      logbookSubmitTime: null,
      quickDraft: "",
      status: "RED",
    };
    saveDb(db);
  } else {
    let calculatedStatus = "RED";
    if (db.today.logbookSubmitted) {
      calculatedStatus = "GREEN";
    } else if (db.today.quickDraft && db.today.quickDraft.trim().length > 0) {
      calculatedStatus = "YELLOW";
    }

    if (db.today.status !== calculatedStatus) {
      db.today.status = calculatedStatus;
      saveDb(db);
    }
  }

  return db.today;
}
