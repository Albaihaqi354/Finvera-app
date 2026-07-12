# Finvera App — Frontend

Antarmuka web untuk aplikasi keuangan pribadi **Finvera**, dibangun dengan **Next.js 16** dan **React 19**.

> 🔗 Backend Repository: [Finvera-BE](https://github.com/Albaihaqi354/Finvera-BE)  
> 🚀 Production: [finvera-app.vercel.app](https://finvera-app.vercel.app)

---

## 🌐 Live Demo

**[➜ Buka Finvera di Browser](https://finvera-app.vercel.app)**

| Akun Demo | Password |
|---|---|
| `admin` | `admin123@` |

---

## Daftar Isi

- [Tentang](#tentang)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Struktur Folder](#struktur-folder)
- [Fitur](#fitur)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Environment Variable](#environment-variable)
- [Menjalankan Project](#menjalankan-project)
- [Build](#build)
- [Autentikasi](#autentikasi)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Tentang

Finvera App adalah antarmuka web untuk aplikasi keuangan pribadi Finvera. Mendukung pencatatan transaksi, manajemen rekening, visualisasi statistik keuangan, dark mode, multi-bahasa, dan multi-currency dengan kurs real-time.

---

## Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Next.js | 16.1.6 | Framework React (App Router) |
| React | 19.2.3 | UI library |
| Tailwind CSS | v4 | Styling |
| Redux Toolkit | ^2.11.2 | State management |
| ECharts | ^6.1.0 | Grafik & chart |
| @mdi/js | ^7.4.47 | Material Design Icons |
| lucide-react | ^0.577.0 | Icon set |
| @sentry/nextjs | ^9.x | Error monitoring & tracking |
| TypeScript | ^5 | Type checking (config files) |

---

## Arsitektur

```
app/layout.jsx          (ThemeProvider, I18nProvider, ToastProvider)
├── app/auth/*          (signin, signup)
├── app/api/*           (server-side route handlers: exchange-rates proxy)
└── app/desktop/
    ├── layout.jsx      (AuthGuard + DesktopProvider + Sidebar + Navbar)
    └── [halaman]/*     (overview, transactions, accounts, dll.)
            ↓
    components/         (UI components)
            ↓
    DesktopProvider     (Global state + semua API calls)
            ↓
    lib/api/client.js   (Fetch wrapper + token management)
            ↓
    Backend API (Go/Gin) — https://finvera-be-production.up.railway.app
```

---

## Struktur Folder

```
finvera-app/
├── app/
│   ├── api/
│   │   └── exchange-rates/     # Server-side proxy kurs mata uang (Frankfurter)
│   ├── auth/                   # Login, registrasi
│   └── desktop/                # Semua halaman utama
│       ├── overview/           # Dashboard ringkasan
│       ├── transactions/       # Manajemen transaksi
│       ├── accounts/           # Manajemen rekening
│       ├── categories/         # Manajemen kategori
│       ├── tags/               # Manajemen tag
│       ├── scheduled/          # Transaksi terjadwal
│       ├── statistics/         # Statistik & grafik
│       └── settings/           # Pengaturan app & profil
├── components/
│   ├── desktop/                # AuthGuard, Sidebar, Navbar, Provider, dll.
│   ├── charts/                 # EChart wrapper
│   ├── icons/                  # MDI icon wrapper
│   └── ui/                     # CurrencyInput, Toast
├── hooks/                      # Custom hooks (useDebounce)
├── lib/
│   ├── api/client.js           # Fetch wrapper, token management, semua method API
│   ├── chart/                  # Konfigurasi & warna chart
│   ├── i18n/                   # Internasionalisasi (ID, EN)
│   ├── currency.js             # Daftar mata uang + fetch kurs real-time
│   └── presetCategories.js     # Kategori preset (fallback)
├── public/image/               # Static assets
├── sentry.client.config.js     # Sentry — browser side
├── sentry.server.config.js     # Sentry — server side
├── sentry.edge.config.js       # Sentry — edge runtime
└── next.config.ts              # Next.js config (withSentryConfig)
```

---

## Fitur

- Dashboard ringkasan saldo, pemasukan, pengeluaran
- Manajemen transaksi dengan filter lengkap (tipe, akun, tanggal, search)
- Manajemen rekening, kategori, dan tag
- Transaksi terjadwal (harian, mingguan, bulanan, tahunan)
- Grafik statistik keuangan interaktif
- Dark mode (persist ke localStorage, support OS preference)
- Multi-bahasa (Indonesia & English)
- Multi-currency dengan **kurs real-time** (via server-side proxy Frankfurter API)
- Server-side token validation via `AuthGuard`
- Error monitoring via **Sentry**

---

## Prasyarat

- [Node.js 20+](https://nodejs.org/)
- npm
- Backend Finvera berjalan di `http://localhost:8080` (untuk development lokal)

---

## Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Albaihaqi354/Finvera-app.git
cd Finvera-app

# 2. Install dependencies
npm install

# 3. Siapkan environment variable
cp .env.local.example .env.local
# Edit .env.local sesuai kebutuhan
```

---

## Environment Variable

Buat file `.env.local`:

```env
# URL Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Sentry DSN (dari sentry.io dashboard)
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
```

| Variable | Wajib | Deskripsi |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Ya | Base URL Backend API |
| `NEXT_PUBLIC_SENTRY_DSN` | Direkomendasikan | DSN untuk Sentry error tracking |

> ⚠️ Variabel `NEXT_PUBLIC_*` di-bake saat build time. Pastikan sudah diset di Vercel Environment Variables sebelum deploy.

---

## Menjalankan Project

```bash
# Development
npm run dev
# Buka http://localhost:3000

# Docker Compose (dari root project)
docker compose up --build
```

---

## Build

```bash
npm run build   # Build production (output: standalone)
npm run start   # Jalankan hasil build
```

Build menggunakan `output: 'standalone'` sehingga Docker image jauh lebih kecil (~50 MB vs ~500 MB).

---

## Autentikasi

Token JWT disimpan di `localStorage` (`finvera_token`).

Saat mengakses halaman `/desktop/*`, `AuthGuard` memanggil `GET /users/me` ke backend untuk memverifikasi token secara server-side. Jika token invalid atau expired, user otomatis di-redirect ke `/auth/signin`.

API client menangani 401 secara otomatis: hapus token dan redirect ke signin.

---

## State Management

Hampir seluruh state dikelola oleh `DesktopProvider` (React Context):

| State | Deskripsi |
|---|---|
| `accounts` | Daftar rekening |
| `categories` | Kategori (global + user) |
| `tags` | Tag transaksi |
| `transactions` | Daftar transaksi (paginated) |
| `scheduled` | Transaksi terjadwal |
| `isBalanceVisible` | Toggle tampilan saldo |
| `currency` | Mata uang aktif |
| `exchangeRates` | Kurs real-time (di-fetch via `/api/exchange-rates`) |

Data dimuat paralel saat provider pertama mount via `Promise.all`.

---

## Deployment

### Vercel (Production)

Frontend di-deploy ke **[Vercel](https://vercel.com)**. Deploy otomatis berjalan setiap kali push ke branch `master`.

**Environment Variables yang harus diset di Vercel:**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://finvera-be-production.up.railway.app/api/v1` |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN dari sentry.io |

### Docker

```bash
docker build -t finvera-app \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1 .

docker run -p 3000:3000 \
  -e HOSTNAME=0.0.0.0 \
  -e PORT=3000 \
  finvera-app
```

> `HOSTNAME=0.0.0.0` wajib agar standalone `server.js` mendengarkan semua interface.

---

## Troubleshooting

**Halaman desktop redirect ke signin padahal sudah login**  
→ Pastikan backend berjalan dan `NEXT_PUBLIC_API_URL` benar

**API calls gagal dengan CORS error**  
→ Pastikan `ALLOWED_ORIGINS` di backend Railway mencakup URL Vercel Anda (tanpa trailing slash `/`)

**Kurs mata uang tidak update / error CORS ke frankfurter.app**  
→ Kurs diambil via server-side proxy `/api/exchange-rates`. Pastikan Vercel deployment sudah menggunakan kode terbaru.

**Build gagal "JavaScript heap out of memory"**  
→ Jalankan: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

**Sentry tidak menerima event**  
→ Pastikan `NEXT_PUBLIC_SENTRY_DSN` sudah diset di Vercel Environment Variables dan sudah redeploy setelah menambahkannya.
