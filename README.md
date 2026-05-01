# DoctorKhuji

A **doctors portal** built with Next.js: patients book appointments, doctors manage their practice, and admins oversee users and approvals. Dark UI with an emerald accent (`#24AE7C`).

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn-style components |
| Auth | [NextAuth.js v5](https://authjs.dev) (credentials + JWT) |
| Database | [PostgreSQL](https://www.postgresql.org/) (e.g. [Supabase](https://supabase.com/)) |
| ORM | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` + `pg` |
| Validation | Zod + React Hook Form |

## Features

- **Landing** — marketing sections, CTAs to register/login
- **Auth** — email/password register (patient or doctor), login, role in JWT/session (`PATIENT` | `DOCTOR` | `ADMIN`)
- **Middleware** — protects `/dashboard/*`; role-based redirects for `/dashboard/admin`, `/doctor`, `/patient`
- **Patient** — profile settings, browse approved doctors, book/cancel appointments, records & vitals placeholders
- **Doctor** — profile (specialty, fee, availability), appointments (confirm/complete/cancel), patient list
- **Admin** — users (role + delete), doctor approvals, all appointments, settings overview

## Prerequisites

- Node.js 20+ (recommended)
- npm (or pnpm/yarn)
- A PostgreSQL database (local or Supabase)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url> doctor-khuji
cd doctor-khuji
npm install
```

### 2. Environment variables

Create **`.env`** (used by Prisma CLI) and **`.env.local`** (used by Next.js). At minimum:

```env
# Required for NextAuth
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# PostgreSQL (Supabase: use Session pooler URI from dashboard)
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<pooler-host>:5432/postgres"

# Optional — if you use Supabase client in the app
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<your-anon-or-publishable-key>"
```

- **`AUTH_SECRET`**: `openssl rand -base64 32`
- **`DATABASE_URL`**: In Supabase, use **Connect → Connection string → Session pooler** (port `5432`) so Prisma works from your machine and from serverless hosts. URL-encode special characters in the password (e.g. `@` → `%40`).

### 3. Database & Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

The client is generated into `lib/generated/prisma/`. After any `schema.prisma` change, run `npx prisma generate` again (or rely on `migrate dev`).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:seed` | Run `prisma/seed.ts` via tsx |

## Seeded accounts (development)

After `npx prisma db seed`:

| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@portal.com` | `Admin@1234` |
| Doctors | `cameron@portal.com`, `cruz@portal.com`, `green@portal.com`, `lee@portal.com` | `Doctor@1234` |

Change these in production and avoid committing real secrets.

## Project structure (high level)

```
app/
  actions/          # Server actions (auth, patient, doctor, admin)
  api/auth/         # NextAuth route handlers
  dashboard/        # Role layouts + pages
  login/, register/ # Auth pages
components/
  admin/, doctor/, patient/, dashboard/, forms/, ui/
lib/
  db.ts             # PrismaClient + pg adapter (singleton)
prisma/
  schema.prisma
  seed.ts
auth.ts             # Full auth config (Node — DB + bcrypt)
auth.config.ts      # Edge-safe fragment for middleware
middleware.ts       # Route protection (imports auth.config only)
types/next-auth.d.ts
```

## Deployment notes

- **Vercel + Supabase** is a common combo: set the same env vars in the Vercel project; set `NEXTAUTH_URL` to your production URL.
- Run migrations against production DB from CI or your machine:  
  `npx prisma migrate deploy`
- Prisma 7 uses a **driver adapter** (`@prisma/adapter-pg`); `next.config.ts` should keep `serverExternalPackages` for `pg` / `@prisma/adapter-pg` / `@prisma/client` so the build succeeds.
- **Middleware** must not import `auth.ts` (which loads bcrypt/Prisma on Edge). This repo uses `auth.config.ts` in middleware only.

## License

Private / your choice — add a `LICENSE` file if you open-source the project.
