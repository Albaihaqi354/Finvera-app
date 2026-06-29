# Finvera App — Analisis Komprehensif & Rancangan Backend (v2.0)

> Dokumen ini merangkum analisis **Finvera** (`finvera-app`) dibandingkan referensi **ezBookkeeping**, gap fitur/UI/UX/flow, dan rancangan backend **Golang + Gin** di folder `finvera-be`.
>
> **Referensi:** [ezBookkeeping Demo](https://ezbookkeeping-demo.mayswind.net/desktop#/login) (demo / ezbookkeeping) · [Feature List](https://ezbookkeeping.mayswind.net/features/) · [HTTP API](https://ezbookkeeping.mayswind.net/httpapi/)
>
> **Diperbarui:** 13 Juni 2026

---

## 0. Struktur Monorepo yang Direkomendasikan

```
finace-finvera-app/
├── finvera-app/          ← Frontend (Next.js 16 + React 19) — SUDAH ADA
├── finvera-be/           ← Backend (Golang + Gin) — BELUM DIBUAT
└── finvera_analysis.md   ← Dokumen ini (pindahkan ke root jika perlu)
```

**Catatan arsitektur:** ezBookkeeping menggunakan **Go + Vue.js** (monolith, FE embedded). Finvera memisahkan FE/BE — valid untuk portfolio, asalkan API contract dirancang konsisten agar FE bisa swap dari localStorage ke HTTP tanpa rewrite besar.

---

## 1. Inventaris Finvera — Status Aktual (Juni 2026)

### Tech Stack Frontend

| Komponen | Teknologi | Status |
|---|---|---|
| Framework | Next.js 16 + React 19 | ✅ |
| Styling | Tailwind CSS v4 | ✅ |
| Charts | Apache ECharts | ✅ |
| Icons | MDI + Lucide | ✅ |
| State | React Context (`DesktopProvider`) | ✅ aktif |
| Redux Toolkit | Tersedia di deps | ⚠️ belum dipakai |
| Storage | **localStorage** via `lib/storage.js` | ⚠️ sementara |
| Auth | Mock localStorage session | ⚠️ bukan JWT real |
| TypeScript | deps ada, file masih `.jsx` | ⚠️ belum migrasi |

### Halaman & Fitur — Status Terkini

| Halaman | Status | Catatan vs v1.0 |
|---|---|---|
| Overview | ✅ | Hero toggle income/expense, skeleton loader, net flow |
| Transactions | ✅ | **Edit** sudah ada, multi-field search, calendar view, delete confirm |
| Statistics | ✅ | Pie + bar chart, custom date range |
| Insights Explorer | ⚠️ Basic | Horizontal bar saja — bukan query builder ezBookkeeping |
| Accounts | ✅ | **Edit + delete confirm** sudah ada |
| Categories | ✅ | Edit, sub-category (parentId), emoji icon |
| Tags | ✅ | Edit, color — **tanpa tag group & sort order** |
| Templates | ✅ | CRUD + apply template → transaksi |
| Scheduled | ✅ | CRUD, toggle active, **auto-process di client** |
| Exchange Rates | ⚠️ Mock | Data hardcoded, tombol tidak fungsional |
| User Settings | ⚠️ UI | Profile/password/2FA UI — tidak ke backend |
| App Settings | ⚠️ Partial | Language/theme/timezone UI only; **JSON backup/restore** ada |
| Mobile Device | ⚠️ Placeholder | QR/link — belum PWA |
| About | ⚠️ Placeholder | Info minimal |
| Auth | ⚠️ Mock | demo/ezbookkeeping works; bukan server auth |
| Navbar | ✅ | User dropdown, settings link, logout confirm |
| Sidebar | ✅ | Hamburger mobile, balance toggle, quick-add tx |
| Error Boundary | ✅ | Ada di layout desktop |

### Yang Sudah Diperbaiki Sejak v1.0 (Jangan Ulangi)

- ✅ Warna income (hijau) / expense (merah) sudah benar
- ✅ Edit transaksi, akun, kategori, tag
- ✅ Konfirmasi hapus akun & transaksi
- ✅ Multi-field search (note, kategori, akun, amount)
- ✅ Custom date range di Statistics & Insights
- ✅ Mobile sidebar drawer + hamburger
- ✅ Loading skeleton (overview, transactions, insights)
- ✅ Scheduled transactions & templates — **bukan placeholder lagi**
- ✅ User profile section di Navbar (bukan sidebar bawah seperti ezBookkeeping)

---

## 2. Perbandingan Fitur: Finvera vs ezBookkeeping

Skala gap: 🔴 High · 🟡 Medium · 🟢 OK/Low · ⚪ Future/Optional

### 2.1 Core Bookkeeping

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| CRUD Transaksi (income/expense/transfer) | ✅ | ✅ | 🟢 |
| Edit transaksi | ✅ | ✅ | 🟢 |
| Batch modify transaksi | ✅ ≥1.5 | ❌ | 🟡 |
| Auto-save draft transaksi | ✅ ≥0.6 | ❌ | 🟡 |
| Scheduled transactions | ✅ server cron | ⚠️ client-side only | 🔴 |
| Transaction templates | ✅ | ✅ | 🟢 |
| Balance modification tx type | ✅ | ❌ | 🟡 |
| Two-level categories | ✅ | ✅ parentId | 🟢 |
| Category color/sort/notes | ✅ | ⚠️ icon saja | 🟡 |
| Two-level **accounts** (sub-accounts) | ✅ | ❌ flat list | 🔴 |
| Account hide/archive | ✅ | ❌ | 🟡 |
| Account sort order | ✅ | ❌ | 🟡 |
| Account icon (built-in) | ✅ | ⚠️ huruf initial | 🟡 |
| Credit card statement date | ✅ ≥0.7 | ❌ | 🟡 |
| Account reconciliation | ✅ ≥1.0 | ❌ | 🔴 |
| Tag groups | ✅ ≥1.3 | ❌ | 🟡 |
| Tag sort order | ✅ | ❌ | 🟡 |

### 2.2 Transaction Query & Views

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| List view | ✅ | ✅ grouped by date | 🟢 |
| Calendar view | ✅ ≥0.9 | ✅ | 🟢 |
| Gallery view (foto struk) | ✅ ≥1.5 | ❌ | 🔴 |
| Filter by category | ✅ | ⚠️ via search, bukan filter panel | 🟡 |
| Filter by account | ✅ | ✅ | 🟢 |
| Filter by tags | ✅ | ❌ | 🟡 |
| Filter by amount range | ✅ | ❌ | 🟡 |
| Filter by keyword | ✅ | ✅ multi-field | 🟢 |
| Sort by date | ✅ | ✅ auto desc | 🟢 |
| Sort by amount | ✅ | ❌ | 🟡 |
| Pagination / virtual scroll | ✅ server-side | ❌ render all | 🔴 |

### 2.3 Statistics & Insights

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| Category pie/bar/radar/sankey | ✅ | ⚠️ pie + bar basic | 🔴 |
| Account proportion charts | ✅ | ❌ | 🟡 |
| Asset proportion & trend | ✅ | ⚠️ summary card only | 🟡 |
| Category/account trend (line/area) | ✅ | ⚠️ 12-month bar overview | 🟡 |
| YoY / period-over-period comparison | ✅ ≥1.4 | ❌ | 🟡 |
| Tag charts | ✅ Insights | ❌ | 🟡 |
| Account balance trend (candlestick, dll) | ✅ | ❌ | 🟡 |
| Reconciliation statements | ✅ | ❌ | 🔴 |
| Export chart → CSV/TSV/Markdown/Mermaid | ✅ | ❌ | 🟡 |
| **Insights Explorer** (query builder) | ✅ AND/OR, 30+ dimensi, 12+ chart types | ⚠️ 1 bar chart, 3 dimensi | 🔴 |

### 2.4 Data Import / Export

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| Export CSV (filtered) | ✅ | ❌ | 🔴 |
| Export TSV | ✅ | ❌ | 🟡 |
| Import CSV/Excel + column mapping | ✅ | ❌ | 🔴 |
| Import OFX/QFX/QIF/IIF | ✅ | ❌ | 🔴 |
| Import bank formats (MT940, Camt, dll) | ✅ | ❌ | ⚪ |
| Import GnuCash/Firefly/Beancount | ✅ | ❌ | ⚪ |
| JSON backup (internal) | ❌ | ✅ app settings | 🟢 (Finvera extra) |
| Clear all data / clear by account | ✅ | ❌ | 🟡 |

### 2.5 Multi-Currency & Exchange Rates

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| Multi-currency per akun/transaksi | ✅ | ❌ hardcoded IDR | 🔴 |
| Auto-update dari 15+ sumber bank sentral | ✅ | ❌ mock data | 🔴 |
| Manual exchange rate input | ✅ ≥1.1 | ❌ | 🔴 |
| Per-transaction exchange rate | ✅ | ❌ | 🔴 |

### 2.6 Media, Lokasi & AI

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| Foto struk / image attachment | ✅ ≥0.6 | ❌ | 🔴 |
| Geolocation + maps (OSM, Google, dll) | ✅ ≥0.3 | ❌ | 🟡 |
| AI receipt recognition | ✅ ≥1.1 | ❌ | ⚪ |
| MCP / API token / Agent Skill | ✅ | ❌ | ⚪ |

### 2.7 Auth, Security & Multi-User

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| Real server auth (JWT/session) | ✅ | ❌ mock | 🔴 |
| Register / email verify | ✅ | ⚠️ UI signup | 🔴 |
| Password recovery via email | ✅ | ⚠️ UI only | 🔴 |
| 2FA TOTP | ✅ | ⚠️ UI only | 🔴 |
| App lock PIN / WebAuthn | ✅ | ❌ | 🟡 |
| Session management | ✅ | ❌ | 🟡 |
| Login rate limiting | ✅ | ❌ | 🟡 |
| API tokens | ✅ | ❌ | 🟡 |
| OIDC/SSO (GitHub, Gitea, dll) | ✅ | ⚪ optional | ⚪ |
| Multi-user self-hosted | ✅ | ❌ single browser | 🔴 |

### 2.8 UI/UX & Platform

| Fitur | ezBookkeeping | Finvera | Gap |
|---|---|---|---|
| Desktop interface | ✅ Vue | ✅ Next.js | 🟢 (beda stack) |
| **Mobile interface terpisah** | ✅ route `/mobile` | ❌ responsive desktop saja | 🔴 |
| Dark mode | ✅ | ⚠️ select UI, tidak aktif | 🔴 |
| PWA / Add to home screen | ✅ | ❌ | 🟡 |
| 19 bahasa i18n | ✅ | ⚠️ EN/ID/ZH select only | 🔴 |
| Custom date/number/currency format | ✅ | ❌ | 🟡 |
| Custom fiscal year / first day of week | ✅ | ❌ | 🟡 |
| Font size settings | ✅ | ❌ | 🟢 |
| Multi-device settings sync | ✅ ≥0.10 | ❌ | 🟡 |
| User avatar upload | ✅ | ⚠️ UI only | 🟡 |

### 2.9 Kelebihan Finvera vs ezBookkeeping

1. **Design language premium** — warm palette (#F9EFE5, #E6923F) konsisten & distinct
2. **Transaction Calendar View** — sudah bagus, ezBookkeeping punya tapi tidak di-highlight
3. **Overview hero toggle** income/expense + net flow indicator
4. **JSON backup/restore** — berguna untuk dev/portfolio sebelum CSV import siap
5. **Preset categories dengan versioning** — migrasi otomatis via `PRESET_CATEGORIES_VERSION`
6. **Storage abstraction** — `storageAPI` siap di-swap ke HTTP

---

## 3. Perbandingan UI/UX Flow

### 3.1 Flow Autentikasi

| Step | ezBookkeeping | Finvera | Action |
|---|---|---|---|
| Landing | `/desktop#/login` atau `/mobile#/login` | `/auth/signin` | 🟢 similar |
| Login | Server JWT + optional 2FA step | Mock `localStorage` | 🔴 butuh BE |
| Remember me | Server session | Checkbox UI only | 🔴 |
| Demo account | Built-in demo user | demo/ezbookkeeping button | 🟢 |
| Post-login | Overview dashboard | `/desktop/overview` | 🟢 |
| Logout | Clear session server-side | Clear `finvera_user` | 🔴 butuh BE |

### 3.2 Flow Navigasi Utama

```
ezBookkeeping Desktop Sidebar          Finvera Sidebar
─────────────────────────────          ─────────────────────────────
Overview                          ≈    Overview (pill style)
Transaction List (+ quick add)      ≈    Transaction Details (+)
Statistics & Analysis               ≈    Statistics & Analysis
Insights Explorer                   ≈    Insights Explorer (basic)
──────── Basis Data ────────            ──────── Basis Data ────────
Accounts                            ≈    Accounts
Transaction Categories              ≈    Transaction Categories
Transaction Tags                    ≈    Transaction Tags
Transaction Templates               ≈    Transaction Templates ✅
Scheduled Transactions              ≈    Scheduled Transactions ✅
──────── Miscellaneous ─────            ──────── Miscellaneous ─────
Exchange Rates Data                 ≈    Exchange Rates (mock)
Use on Mobile Device                ≈    Mobile (placeholder)
About                               ≈    About (placeholder)
(User di bottom sidebar)            ≠    User di Navbar dropdown ✅
Hide balance                        ≈    Hide amounts toggle ✅
```

**Perbedaan UX penting:**
- ezBookkeeping: user profile **di bawah sidebar** + switch desktop/mobile
- Finvera: user profile **di Navbar kanan** — acceptable, tapi perlu tambah link ke mobile view & app lock
- ezBookkeeping: transaction form support foto, lokasi, multi-currency inline
- Finvera: form lebih sederhana (amount, account, category, date, note, tags)

### 3.3 Flow Tambah Transaksi

| Step | ezBookkeeping | Finvera |
|---|---|---|
| Trigger | Sidebar `+`, list header, template apply | Sidebar `+`, list Add, URL `?add=1` |
| Pilih type | Income / Expense / Transfer | ✅ sama |
| Isi form | + currency, rate, geo, photos | Basic fields only |
| Save | POST API → update balance server | Context → localStorage |
| Scheduled auto-run | Server cron daily | Client `useEffect` on load ⚠️ |

---

## 4. Gap Kritis — Prioritas Implementasi

### 🔴 P0 — Blocker untuk parity & production

1. **Backend `finvera-be`** — semua data masih localStorage, hilang antar device
2. **Auth real** — JWT + refresh token, register, login, logout
3. **API CRUD** — accounts, categories, tags, transactions, templates, scheduled
4. **Scheduled job server-side** — jangan andalkan client tab terbuka
5. **Pagination transaksi** — performa + align dengan ezBookkeeping list API
6. **Multi-currency foundation** — meski awalnya IDR-only, schema harus siap

### 🟡 P1 — Parity fitur utama

7. Sub-accounts (two-level accounts)
8. Filter by tags & amount range di transaction list
9. Export CSV transaksi
10. Import CSV dengan column mapping
11. Exchange rates API + manual rate
12. Dark mode functional
13. Statistics: trend line, account charts
14. Insights Explorer v2 — minimal filter builder + export CSV

### 🟡 P2 — Polish & advanced

15. Account reconciliation
16. Transaction gallery view (butuh image upload)
17. Image attachment + object storage (local/S3)
18. Geolocation
19. 2FA TOTP
20. PWA manifest
21. i18n (next-intl atau serupa)
22. Batch edit transactions

### ⚪ P3 — Future / diferensiasi portfolio

23. AI receipt OCR
24. MCP / API tokens
25. OIDC SSO
26. Import OFX/QFX/bank formats

---

## 5. Rancangan Backend — `finvera-be` (Golang + Gin)

> Folder `finvera-be` **belum ada**. Desain ini melengkapi v1.0 dengan field & endpoint yang selaras ezBookkeeping.

### 5.1 Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│  finvera-app (Next.js)  — NEXT_PUBLIC_API_URL              │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS REST /api/v1
┌────────────────────────────▼────────────────────────────────┐
│  finvera-be (Gin)                                            │
│  ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌───────────────┐  │
│  │ Auth    │ │Middleware│ │ Services   │ │ Cron Scheduler│  │
│  │ JWT 2FA │ │CORS Log  │ │ Business   │ │ (scheduled tx)│  │
│  └─────────┘ └──────────┘ └────────────┘ └───────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ PostgreSQL (prod) / SQLite (dev)                        ││
│  │ Optional: Redis (rate limit, session)                   ││
│  │ Optional: MinIO/S3 (transaction images)                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Struktur Project

```
finvera-be/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   ├── database/
│   │   └── migrations/
│   ├── middleware/          # auth, cors, ratelimit, timezone
│   ├── models/
│   ├── handlers/
│   ├── services/
│   ├── scheduler/           # robfig/cron — scheduled transactions
│   └── router/
├── pkg/
│   ├── response/
│   ├── validator/
│   └── utils/
├── go.mod
├── go.sum
├── .env.example
├── Dockerfile
└── README.md
```

### 5.3 Schema Database — Tambahan vs v1.0

Field/kolom baru yang **belum ada di v1.0** tapi diperlukan untuk parity ezBookkeeping:

```sql
-- USERS: tambahan
ALTER TABLE users ADD COLUMN
    default_currency    VARCHAR(10) DEFAULT 'IDR',
    first_day_of_week   INT DEFAULT 1,
    fiscal_year_start   INT DEFAULT 1,       -- month 1-12
    theme               VARCHAR(20) DEFAULT 'light',
    totp_secret         VARCHAR(255),          -- encrypted, nullable
    totp_enabled        BOOLEAN DEFAULT FALSE,
    email_verified_at   TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ;           -- soft delete

-- ACCOUNTS: tambahan
ALTER TABLE accounts ADD COLUMN
    parent_id           UUID REFERENCES accounts(id),
    icon                VARCHAR(100),
    initial_balance     DECIMAL(15,2) DEFAULT 0,
    statement_day       INT,                   -- credit card billing day
    is_hidden           BOOLEAN DEFAULT FALSE,
    sort_order          INT DEFAULT 0,
    note                VARCHAR(500),
    last_reconciled_at  TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ;
-- HAPUS kolom balance mutable — hitung dari transaksi + initial_balance

-- CATEGORIES: tambahan
ALTER TABLE categories ADD COLUMN
    note                VARCHAR(500),
    deleted_at          TIMESTAMPTZ;

-- TAGS: tambahan
ALTER TABLE tags ADD COLUMN
    group_id            UUID REFERENCES tag_groups(id),
    sort_order          INT DEFAULT 0,
    deleted_at          TIMESTAMPTZ;

CREATE TABLE tag_groups (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS: tambahan
ALTER TABLE transactions ADD COLUMN
    geo_lat             DECIMAL(10,7),
    geo_lng             DECIMAL(10,7),
    geo_name            VARCHAR(255),
    deleted_at          TIMESTAMPTZ;

CREATE TABLE transaction_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    storage_key     VARCHAR(500) NOT NULL,
    mime_type       VARCHAR(50),
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- EXCHANGE RATES
CREATE TABLE exchange_rates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL = global
    base        VARCHAR(10) NOT NULL,
    target      VARCHAR(10) NOT NULL,
    rate        DECIMAL(15,6) NOT NULL,
    source      VARCHAR(50) DEFAULT 'manual',  -- 'ecb', 'manual', etc.
    fetched_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, base, target)
);

-- USER PREFERENCES (sync antar device)
CREATE TABLE user_settings (
    user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    settings    JSONB NOT NULL DEFAULT '{}',
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- API TOKENS (untuk automation — seperti ezBookkeeping)
CREATE TABLE api_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100),
    token_hash  VARCHAR(255) NOT NULL,
    scopes      TEXT[],
    ip_allowlist TEXT[],
    last_used_at TIMESTAMPTZ,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ACCOUNT RECONCILIATION
CREATE TABLE reconciliations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    statement_date  DATE NOT NULL,
    statement_balance DECIMAL(15,2) NOT NULL,
    note            VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- SCHEDULED: tambahan vs v1.0
ALTER TABLE scheduled_transactions ADD COLUMN
    name                VARCHAR(100),
    target_account_id   UUID REFERENCES accounts(id),
    tag_ids             UUID[],
    end_date            DATE,
    deleted_at          TIMESTAMPTZ;
```

### 5.4 REST API Endpoints — Lengkap

Base: `/api/v1` · Auth header: `Authorization: Bearer <access_token>`

**Opsi kompatibilitas:** ezBookkeeping memakai pola `/accounts.json`, `/transactions/list.json`. Finvera bisa pakai REST idiomatic (`GET /accounts`) **atau** alias `.json` untuk kemudahan porting — pilih satu, dokumentasikan di Swagger.

```
── AUTH ──────────────────────────────────────────────────────
POST   /auth/register
POST   /auth/login              → { accessToken, refreshToken, user }
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/2fa/verify         → step 2 login

── USERS ─────────────────────────────────────────────────────
GET    /users/me
PUT    /users/me
PUT    /users/me/password
PUT    /users/me/settings       → theme, locale, timezone, currency format
POST   /users/me/avatar         → multipart upload
DELETE /users/me
GET    /users/me/sessions
DELETE /users/me/sessions/:id

── 2FA ───────────────────────────────────────────────────────
POST   /users/me/2fa/setup      → QR secret
POST   /users/me/2fa/confirm
DELETE /users/me/2fa

── API TOKENS ────────────────────────────────────────────────
GET    /tokens
POST   /tokens
DELETE /tokens/:id

── ACCOUNTS ──────────────────────────────────────────────────
GET    /accounts                → tree (parent + sub-accounts)
POST   /accounts
GET    /accounts/:id
PUT    /accounts/:id
DELETE /accounts/:id
PATCH  /accounts/:id/hide
PATCH  /accounts/reorder
GET    /accounts/:id/balance    → computed balance

── CATEGORIES ────────────────────────────────────────────────
GET    /categories              → ?tree=true
POST   /categories
PUT    /categories/:id
DELETE /categories/:id
PATCH  /categories/reorder

── TAGS & TAG GROUPS ─────────────────────────────────────────
GET    /tag-groups
POST   /tag-groups
GET    /tags
POST   /tags
PUT    /tags/:id
DELETE /tags/:id
PATCH  /tags/reorder

── TRANSACTIONS ──────────────────────────────────────────────
GET    /transactions            → pagination + filters (see below)
POST   /transactions
GET    /transactions/:id
PUT    /transactions/:id
DELETE /transactions/:id
POST   /transactions/batch      → batch modify ≥ ezBookkeeping 1.5
POST   /transactions/:id/images → upload receipt

Query params (align ezBookkeeping):
  page, limit, type, category_ids, account_ids, tag_ids,
  amount_min, amount_max, keyword, start_date, end_date,
  sort (date|amount), order (asc|desc), has_images

── STATISTICS ────────────────────────────────────────────────
GET    /statistics/overview
GET    /statistics/by-category
GET    /statistics/by-account
GET    /statistics/by-tag
GET    /statistics/trend
GET    /statistics/assets
POST   /statistics/insights     → body: query builder JSON

── TEMPLATES ─────────────────────────────────────────────────
GET    /templates
POST   /templates
PUT    /templates/:id
DELETE /templates/:id
POST   /templates/:id/apply

── SCHEDULED ─────────────────────────────────────────────────
GET    /scheduled
POST   /scheduled
PUT    /scheduled/:id
DELETE /scheduled/:id
PATCH  /scheduled/:id/toggle
POST   /scheduled/process       → manual trigger (admin/dev)

── EXCHANGE RATES ────────────────────────────────────────────
GET    /exchange-rates
POST   /exchange-rates          → manual
POST   /exchange-rates/sync     → fetch from ECB/etc.
DELETE /exchange-rates/:id

── DATA MANAGEMENT ───────────────────────────────────────────
GET    /export/transactions     → ?format=csv|tsv|json&filters...
POST   /import/transactions     → ?format=csv + column mapping body
POST   /import/preview          → validate before import
GET    /data/statistics         → counts
POST   /data/clear              → requires password confirm
POST   /data/clear/transactions
POST   /data/clear/account/:id

── RECONCILIATION ────────────────────────────────────────────
GET    /accounts/:id/reconciliations
POST   /accounts/:id/reconciliations
GET    /reconciliations/:id/export
```

### 5.5 Response Format

```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 150, "total_pages": 8 }
}
```

Error:
```json
{ "success": false, "error": "TRANSACTION_NOT_FOUND", "message": "..." }
```

**Timezone headers** (seperti ezBookkeeping):
- `X-Timezone-Name: Asia/Jakarta` (preferred)
- `X-Timezone-Offset: 420` (minutes)

### 5.6 Go Dependencies

```go
require (
    github.com/gin-gonic/gin           v1.10.0
    github.com/golang-jwt/jwt/v5       v5.2.1
    github.com/google/uuid             v1.6.0
    golang.org/x/crypto                v0.24.0
    gorm.io/gorm                       v1.25.10
    gorm.io/driver/postgres            v1.5.9
    gorm.io/driver/sqlite              v1.5.5
    github.com/joho/godotenv           v1.5.1
    github.com/go-playground/validator/v10
    github.com/rs/zerolog              v1.33.0
    github.com/robfig/cron/v3          v3.0.1
    github.com/pquerna/otp             v1.4.0   // 2FA TOTP
    github.com/swaggo/gin-swagger      v1.6.0   // optional
)
```

### 5.7 Prinsip Backend Penting

1. **Balance = `initial_balance` + SUM(transactions)** — jangan update balance manual per tx (race condition)
2. **Soft delete** (`deleted_at`) pada semua entitas user-facing
3. **Scheduled tx** via `robfig/cron` — `ProcessDueTransactions()` setiap hari 00:05 user timezone
4. **JWT strategy:** access 15 menit (memory), refresh 30 hari (httpOnly cookie)
5. **File upload:** abstraksi `StorageProvider` interface (local → S3 later)
6. **CORS:** allow `finvera-app` origin dari env
7. **Seed demo user:** username `demo`, password `ezbookkeeping` — mirror ezBookkeeping demo

---

## 6. Integrasi Frontend ↔ Backend

### 6.1 Abstraction Layer (sudah disiapkan sebagian)

File `lib/storage.js` → refactor menjadi:

```
lib/
├── storage.js          ← keep for offline/dev fallback
├── api/
│   ├── client.js       ← fetch wrapper, auth header, refresh
│   ├── accounts.js
│   ├── transactions.js
│   ├── categories.js
│   ├── tags.js
│   ├── templates.js
│   ├── scheduled.js
│   ├── statistics.js
│   ├── exchange.js
│   └── auth.js
└── hooks/
    └── useApi.js       ← or RTK Query slices
```

Env:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 6.2 Migrasi Bertahap

| Phase | FE | BE |
|---|---|---|
| A | Auth pages → real API | Auth endpoints + demo seed |
| B | DesktopProvider → fetch on load | CRUD all entities |
| C | Remove localStorage as source of truth | Pagination, filters |
| D | CSV export/import UI | Data management endpoints |
| E | Dark mode, i18n | User settings sync |

---

## 7. Roadmap Implementasi

### Phase 1 — Backend Foundation (`finvera-be`) ⬅️ MULAI DI SINI

- [ ] Init Go module + Gin + GORM + SQLite dev
- [ ] Migrations: users, accounts, categories, tags, transactions
- [ ] Auth: register, login, JWT refresh, demo user seed
- [ ] CRUD endpoints: accounts, categories, tags, transactions
- [ ] Docker Compose (postgres + api)
- [ ] Swagger/OpenAPI docs

### Phase 2 — FE Integration

- [ ] `lib/api/client.js` + auth flow
- [ ] DesktopProvider load/save via API
- [ ] Error toasts + loading states
- [ ] Environment config

### Phase 3 — Parity Core

- [ ] Templates & scheduled API + server cron
- [ ] Pagination + advanced transaction filters
- [ ] Statistics aggregation endpoints
- [ ] CSV export/import
- [ ] Exchange rates table + sync job

### Phase 4 — UX Parity

- [ ] Dark mode (CSS variables + user setting)
- [ ] Mobile route `/mobile/*` atau responsive redesign
- [ ] PWA manifest
- [ ] i18n (EN + ID minimum)
- [ ] Insights Explorer v2

### Phase 5 — Advanced

- [ ] Sub-accounts
- [ ] Image upload + gallery view
- [ ] Account reconciliation
- [ ] 2FA TOTP
- [ ] Multi-currency transactions
- [ ] Geolocation

### Phase 6 — Production

- [ ] Rate limiting, audit log
- [ ] CI/CD (GitHub Actions)
- [ ] PostgreSQL production config
- [ ] Backup strategy

---

## 8. Checklist Keselarasan dengan ezBookkeeping Demo

Saat testing side-by-side dengan demo (demo/ezbookkeeping):

| Area | Check |
|---|---|
| Login → Overview | Totals period cards tampil benar |
| Add expense/income/transfer | Balance akun update |
| Edit & delete tx | Balance revert benar |
| Calendar view | Tx muncul di tanggal benar |
| Categories 2-level | Parent/child filter benar |
| Templates | Apply → prefill form |
| Scheduled | Jalan tanpa browser terbuka (butuh BE cron) |
| Statistics | Pie chart periode match |
| Export CSV | Download file valid |
| Settings | Theme/dark/language persist setelah reload |
| Multi-device | Login di browser B → data sama |

---

## 9. Strengths Finvera (Pertahankan)

1. Design language konsisten & premium
2. Balance visibility toggle
3. Transaction calendar view
4. Delete confirmation modals dengan animasi
5. Grouped transactions by date
6. Debounced search
7. Preset categories + versioning
8. Storage abstraction siap migrasi
9. Apache ECharts — powerful untuk expand statistics
10. Code structure rapi (pages/components/lib/hooks)

---

*Finvera Analysis v2.0 — 13 Juni 2026*
*Changelog v2.0: Koreksi status fitur FE, tambah matrix ezBookkeeping lengkap, UI/UX flow map, schema & API backend extended, roadmap phased, folder `finvera-be`*
