import React from "react";
import { Flame, Trophy, Calendar, Award } from "lucide-react";

export default function StreakHeatmap({ streak, heatmap }) {
  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;

  // Generate last 16 weeks (approx 112 days) for GitHub-style heatmap display
  const days = [];
  const today = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = heatmap?.[dateStr] || 0;
    days.push({
      date: dateStr,
      count: count,
      dayOfWeek: d.getDay(),
    });
  }

  // Get color scale
  const getColorClass = (count) => {
    if (count === 0) return "bg-slate-800/80 border-slate-700/40";
    if (count === 1)
      return "bg-emerald-600/80 border-emerald-500/50 shadow-sm shadow-emerald-500/20";
    if (count === 2) return "bg-emerald-500 border-emerald-400";
    return "bg-emerald-400 border-emerald-300";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Visual Tracker & Streak Kalender
            </h3>
            <p className="text-xs text-slate-400">
              Konsistensi pengisian logbook & kehadiran magang
            </p>
          </div>
        </div>

        {/* Streak Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame className="w-4 h-4 fill-orange-500/20" />
            <div>
              <div className="text-[10px] text-orange-300/80 leading-none">
                Streak Aktif
              </div>
              <div className="text-sm font-extrabold leading-tight">
                {currentStreak} Hari 🔥
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-4 h-4" />
            <div>
              <div className="text-[10px] text-amber-300/80 leading-none">
                Rekor Terbaik
              </div>
              <div className="text-sm font-extrabold leading-tight">
                {longestStreak} Hari
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap Grid */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start">
            {days.map((item) => (
              <div
                key={item.date}
                title={`${item.date}: ${item.count > 0 ? `${item.count} logbook disubmit` : "Belum ada logbook"}`}
                className={`w-3 h-3 rounded-xs border transition hover:scale-125 cursor-pointer ${getColorClass(item.count)}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
            <span>Aktivitas 16 Minggu Terakhir</span>
            <div className="flex items-center gap-1.5">
              <span>Kurang</span>
              <div className="w-2.5 h-2.5 rounded-xs bg-slate-800 border border-slate-700" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
              <span>Sering</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
