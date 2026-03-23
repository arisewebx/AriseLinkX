# Project Analysis: AriseLinkX

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 + Vite 6.0.1 |
| Routing | React Router DOM 7.6.1 |
| Styling | TailwindCSS + Shadcn UI (Radix UI) |
| Backend | Supabase (Auth + PostgreSQL + Storage) |
| Charts | Recharts |
| QR Codes | react-qrcode-logo |
| Validation | Yup |
| Icons | Lucide React |
| Deployment | Netlify |

---

## Project Structure

```
src/
├── pages/
│   ├── landing.jsx           # Public home page
│   ├── auth.jsx              # Login/Signup (tabbed)
│   ├── dashboard.jsx         # User dashboard
│   ├── link.jsx              # Per-link analytics
│   ├── settings.jsx          # Account settings
│   ├── redirect-link.jsx     # Short URL redirect handler
│   └── admin/
│       └── admin-dashboard.jsx
├── components/
│   ├── header.jsx, create-link.jsx, link-card.jsx
│   ├── device-stats.jsx, location-stats.jsx
│   ├── require-auth.jsx, login.jsx, signup.jsx
│   ├── resetPassword.jsx, ForgotPasswordModal.jsx
│   ├── ui/                   # Shadcn components
│   └── admin/                # 12+ admin-specific components
├── db/
│   ├── supabase.js           # Client init
│   ├── apiAuth.js            # Auth operations
│   ├── apiUrls.js            # URL CRUD
│   ├── apiClicks.js          # Click tracking
│   └── apiAdmin.js           # Admin ops (service role)
├── hooks/use-fetch.jsx       # Async data fetching hook
├── context.jsx               # Global auth/user context
└── App.jsx                   # Route definitions
```

---

## Routes

| Path | Component | Access |
|---|---|---|
| `/` | Landing | Public |
| `/auth` | Login/Signup | Public |
| `/dashboard` | Dashboard | Auth required |
| `/link/:id` | Link details | Auth required |
| `/settings` | Settings | Auth required |
| `/:id` | Short URL redirect | Public |
| `/admin` | Admin panel | Admin only |

---

## Features

### User Features
- URL shortening with 6-char codes + custom aliases
- QR code generation with company branding + download
- Dashboard with search, stats (total links, clicks, averages)
- Bulk actions (download all QRs, copy all links, bulk share)
- Share via WhatsApp, Twitter, Facebook, Email

### Analytics
- Click tracking: device type, browser, IP, city/country/region
- Multi-provider geolocation with fallback chain (ipinfo.io → ipapi.co → ipgeolocation.io)
- 30-min in-memory cache to reduce geo API calls
- VPN/proxy detection via timezone vs. country cross-referencing

### Admin Features
- User management: ban/unban, promote/demote admin, delete
- Platform-wide analytics and user activity monitoring
- Bulk operations with confirmation modals
- Security center with location accuracy analysis

---

## Database Schema (inferred)

- **`urls`** — id, user_id, title, short_url, custom_url, original_url, qr, created_at
- **`clicks`** — id, url_id, city, country, device, ip_address, user_agent, location_source, created_at
- **Storage buckets** — `qrs`, `profilepic`

---

## Notable Design Decisions

1. **Geolocation fallback chain** — 3 HTTPS providers with retry logic to handle CORS/availability issues
2. **Service role key** — Used in `apiAdmin.js` for privileged ops (user deletion, metadata writes)
3. **Admin detection** — Hardcoded owner email + metadata role check
4. **Ban enforcement** — `BanCheckWrapper` component blocks banned users at the component level
5. **QR branding** — Custom canvas rendering adds logo/title/URL watermark to QR codes

---

## Areas with TODOs / Commented Code

- Password reset flow (commented in `apiAuth.js`)
- Data export (commented in `settings.jsx`)
- Google Analytics (commented in `index.html`)
