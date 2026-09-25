import cron from "node-cron";
import { getDb, updateTodayStatus } from "./db.js";

let cronJobs = [];

export function isWorkDay(date = new Date()) {
  const day = date.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const db = getDb();
  if (!db.settings.workDaysOnly) return true;
  return (db.settings.workDays || [1, 2, 3, 4, 5]).includes(day);
}

export function initScheduler() {
  // Clear existing jobs
  cronJobs.forEach((job) => job.stop());
  cronJobs = [];

  const db = getDb();
  const settings = db.settings;

  console.log(
    "🔄 Menginisialisasi Scheduler Pengingat Logbook (17:00–23:59 WIB)...",
  );

  // 1. Logbook Sore Reminder - Default 17:00 WIB
  const logbookTime = settings.logbookTime || "17:00";
  if (settings.enableLogbookReminder !== false && logbookTime) {
    const [aHour, aMinute] = logbookTime.split(":");
    const cronExp = `${aMinute || "00"} ${aHour || "17"} * * *`;

    const job = cron.schedule(cronExp, () => {
      if (!isWorkDay()) {
        console.log("Hari libur/weekend, lewati pengingat logbook.");
        return;
      }
      const today = updateTodayStatus();
      if (!today.logbookSubmitted) {
        console.log("📝 Pengingat Logbook Sore (17:00 WIB) terjadwal aktif.");
      }
    });

    cronJobs.push(job);
    console.log(`✅ Jadwal Pengingat Logbook Sore aktif: ${logbookTime} WIB`);
  }

  // 2. Smart Escalation (Tiap 30/60 menit antara 18:00 - 23:00)
  if (settings.enableEscalation !== false) {
    const intervalMin = settings.escalationIntervalMinutes || 30;
    const cronExp = `*/${intervalMin} 18-23 * * *`;

    const job = cron.schedule(cronExp, () => {
      if (!isWorkDay()) return;
      const today = updateTodayStatus();

      if (!today.logbookSubmitted) {
        console.log(
          `🚨 Smart Escalation check: Logbook belum disubmit (${today.status}).`,
        );
      }
    });

    cronJobs.push(job);
    console.log(
      `✅ Smart Escalation aktif (Tiap ${intervalMin} menit 18:00-23:59 WIB)`,
    );
  }
}
