# Finvera App

Aplikasi web manajemen keuangan pribadi, dibangun dengan **Next.js 16** dan **React 19**.

> Backend: [Finvera-BE](https://github.com/Albaihaqi354/Finvera-BE)

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
- [Linting](#linting)
- [Autentikasi](#autentikasi)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Future Improvement](#future-improvement)

---

## Tentang

Finvera App adalah antarmuka web untuk aplikasi keuangan pribadi Finvera. Mendukung pencatatan transaksi, manajemen rekening, visualisasi statistik keuangan, dark mode, dan multi-bahasa.

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
| TypeScript | ^5 | Type checking (config files) |

---

## Arsitektur

```
app/layout.jsx          (ThemeProvider, I18nProvider, ToastProvider)
├── app/auth/*          (signin, signup)
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
    Backend API (Go/Gin)
```

---

## Struktur Folder

```
finvera-app/
├── app/
│   ├── auth/               # Login, registrasi
│   └── desktop/            # Semua halaman utama
│       ├── overview/       # Dashboard ringkasan
│       ├── transactions/   # Manajemen transaksi
│       ├── accounts/       # Manajemen rekening
│       ├── categories/     # Manajemen kategori
│       ├── tags/           # Manajemen tag
│       ├── scheduled/      # Transaksi terjadwal
│       ├── statistics/     # Statistik & grafik
│       └── settings/       # Pengaturan app & profil
├── components/
│   ├── desktop/            # AuthGuard, Sidebar, Navbar, Provider, dll.
│   ├── charts/             # EChart wrapper
│   ├── icons/              # MDI icon wrapper
│   └── ui/                 # CurrencyInput, Toast
├── hooks/                  # Custom hooks (useDebounce)
├── lib/
│   ├── api/client.js       # Fetch wrapper, token management, semua method API
│   ├── chart/              # Konfigurasi & warna chart
│   ├── i18n/               # Internasionalisasi (ID, EN)
│   ├── currency.js         # Daftar mata uang
│   └── presetCategories.js # Kategori preset
└── public/image/           # Static assets
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
- Multi-currency
- Server-side token validation

---

## Prasyarat

- [Node.js 20+](https://nodejs.org/)
- npm
- Backend Finvera berjalan di `http://localhost:8080`

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
# Edit .env.local
```

---

## Environment Variable

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

| Variable | Wajib | Deskripsi |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Ya | Base URL Backend API |

> ⚠️ Variabel `NEXT_PUBLIC_*` di-bake saat build time. Untuk Docker, diteruskan sebagai build argument.

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

Build menggunakan `output: 'standalone'` sehingga Docker image jauh lebih kecil.

---

## Linting

```bash
npm run lint
```

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

Data dimuat paralel saat provider pertama mount via `Promise.all`.

---

## Deployment

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

### CI/CD

Pipeline GitHub Actions berjalan otomatis saat push ke `master`/`main`:
- Build Docker image
- Push ke GHCR: `ghcr.io/albaihaqi354/finvera-app:master`

---

## Troubleshooting

**Halaman desktop redirect ke signin padahal sudah login**
→ Pastikan backend berjalan dan `NEXT_PUBLIC_API_URL` benar

**API calls gagal dengan CORS error**
→ Pastikan `ALLOWED_ORIGINS` di backend mencakup `http://localhost:3000`

**Build gagal "JavaScript heap out of memory"**
→ Jalankan: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

---

## Future Improvement

- [ ] Migrasi source files ke TypeScript (`.tsx`)
- [ ] Unit & integration test (Jest + React Testing Library)
- [ ] Pagination / infinite scroll di halaman transaksi
- [ ] Forget password flow
- [ ] httpOnly cookie untuk token (lebih aman dari XSS)
- [ ] Export transaksi CSV / Excel
- [ ] PWA support
