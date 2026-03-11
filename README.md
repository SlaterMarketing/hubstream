# HubStream

Lightweight webinar management for Google Meet and HubSpot. Create events, embed signup forms, and sync everything to your CRM.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Prisma (Neon recommended)
- **Auth**: NextAuth.js v5 with Google OAuth
- **i18n**: next-intl (7 locales: en, es, fr, de, pt, ja, zh)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Rich text**: Tiptap
- **File storage**: Cloudflare R2 (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (e.g. [Neon](https://neon.tech))
- Google OAuth credentials

### Setup

1. Clone and install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

3. Set up the database:

```bash
npm run db:push
# or for migrations: npm run db:migrate
```

4. Run the development server:

```bash
npm run dev
```

### Environment Variables

See `.env.example` for the full list. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Run `openssl rand -base64 32` to generate
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- Enable Google Calendar API and add `https://www.googleapis.com/auth/calendar.events` scope

### Build

```bash
npm run build --webpack
```

Note: Use `--webpack` flag for build as next-intl has better compatibility with Webpack than Turbopack.

## Project Structure

- `src/app/[locale]/` - Locale-prefixed routes (landing, login, onboarding, dashboard)
- `src/app/api/` - API routes (auth, onboarding)
- `src/components/` - React components
- `src/lib/` - Utilities (db, auth, plans, r2)
- `src/messages/` - i18n JSON files
- `prisma/` - Database schema

## Roadmap

- [x] Phase 1: Project foundation
- [ ] Phase 2: Event CRUD, Google Meet integration, public event pages
- [ ] Phase 3: Registration flow, embeddable forms
- [ ] Phase 4: HubSpot integration
- [ ] Phase 5: Stripe billing
- [ ] Phase 6: Email system (Resend)
- [ ] Phase 7: Full i18n
- [ ] Phase 8: Polish & launch prep
- [ ] Phase 9: First-party analytics
