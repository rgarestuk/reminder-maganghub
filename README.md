# 🚀 MagangHub Reminder

> **Sistem Pengingat & Manajemen Logbook Harian MagangHub Kemnaker berbasis Web dengan Notifikasi Otomatis, Quick Draft, dan Visual Streak Tracker.**

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Latar Belakang & Masalah

Peserta magang Kemnaker sering kali lupa mengisi logbook harian di portal MagangHub sebelum batas waktu harian ditutup (**23:59 WIB**). Keterlambatan atau kealpaan pengisian logbook dapat berdampak pada penilaian, streak kehadiran, hingga pemotongan uang saku magang.

**MagangHub Reminder** hadir sebagai solusi berbasis web yang ringan, cepat, dan otomatis untuk membantu peserta magang mencatat progres kerja harian secara berkala dan mengingatkan pengisian logbook tepat waktu.

---

## ✨ Fitur Unggulan

### 1. 🔴/🟡/🟢 Status Widget Logbook Hari Ini

- **🔴 Merah (Belum Isi Logbook):** Pengingat visual aktif untuk jendela waktu pengisian **17:00 – 23:59 WIB**.
- **🟡 Kuning (Draft Tersimpan):** Menandakan Anda sudah mencatat draf kerja, siap disubmit ke Monev.
- **🟢 Hijau (Selesai / All Done):** Logbook hari ini telah berhasil disubmit dan tercatat rapi.

### 2. ⚡ Catatan Cepat / Quick Draft (Autosave)

- Tulis poin-poin pekerjaan harian sepanjang jam kerja tanpa khawatir hilang berkat fitur _autosave_ lokal & server.
- Tombol **Generate ke Logbook** untuk mentransfer draf langsung ke form submit modal.

### 3. 📝 Form Logbook Standar MagangHub

- Form 3 kolom wajib sesuai format resmi MagangHub:
  1. **Aktivitas / Pekerjaan Harian**
  2. **Pembelajaran yang Diperoleh (Key Learnings)**
  3. **Masalah yang Dihadapi (Obstacles)**
- Tombol **Salin Format**: Sekali klik menyalin seluruh isi form ke clipboard untuk kemudahan _paste_ di portal Kemnaker.
- Integrasi otomatis membuka halaman riwayat Monev MagangHub Kemnaker saat submit.

### 4. 🔔 Notifikasi Web Browser & Alarm Audio

- **Desktop Pop-up & Audio Chime:** Notifikasi native browser dan pesan pengingat _"isi absen buruan daripada kena potong gaji!"_.
- **Smart Escalation:** Mengulang pengingat secara berkala (tiap 15/30/60 menit) antara pukul 18:00 – 23:59 WIB jika logbook belum disubmit.
- **Filter Hari Kerja:** Otomatis aktif hanya pada hari kerja (Senin–Jumat).

### 5. 🔥 Visual Tracker & GitHub Heatmap Calendar

- Kalender kontribusi 16 minggu terakhir ala GitHub.
- Tracking **Active Streak** dan **Longest Streak** untuk menjaga motivasi konsistensi pengisian.

### 6. 📊 Riwayat & Ekspor Data

- Rekap seluruh logbook yang pernah disubmit.
- Ekspor data logbook ke format **CSV / Excel** untuk arsip laporan magang.

### 7. 🔄 Mode Demo / Granular Reset

- **Reset Logbook Hari Ini:** Mengembalikan status hari ini ke Merah dan membersihkan logbook hari ini (streak tetap aman).
- **Reset Visual Tracker:** Mengatur ulang streak ke 0 hari dan mengosongkan heatmap (status hari ini & riwayat tetap aman).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React (Modern Dark UI)
- **Backend:** Node.js, Express.js, node-cron
- **Database:** Lightweight JSON File Persistence (`data/db.json`) + LocalStorage Fallback

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat

- Node.js versi 18 atau lebih baru terpasang di komputer Anda.

### Instalasi & Menjalankan

1. **Clone repository:**

   ```bash
   git clone https://github.com/USERNAME/reminder-maganghub.git
   cd reminder-maganghub
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Jalankan aplikasi (Frontend + Backend):**

   ```bash
   npm run dev
   ```

4. Buka browser di [http://localhost:5173](http://localhost:5173).

---

## 🌐 Deploy Gratis (Production)

Aplikasi ini sudah dikonfigurasi untuk langsung di-deploy ke platform gratis seperti **[Render.com](https://render.com)** atau **[Railway.app](https://railway.app)**:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Port:** `3001` (atau otomatis sesuai variabel `PORT` environment)

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Silakan gunakan dan kembangkan secara bebas.
