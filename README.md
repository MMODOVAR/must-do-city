# Must Do City

A travel-experience website with an administrator back office. Admins configure **countries → cities → journeys** (experiences), and each journey is an ordered list of **steps** (stops). Visitors browse destinations and follow journeys step by step.

Built with **Next.js 15 (App Router)**, **Prisma 6** (Rust-free client), **SQLite** for local development, and **Tailwind CSS 4**.

## Features

**Public website**
- Home page with featured journeys and all destinations
- Country page → its cities
- City page → its journeys, with categories
- Journey page → summary, duration, price and a step-by-step timeline
- Only *published* content is shown; unpublished items return 404

**Admin back office** (`/admin`)
- Secure login (bcrypt-hashed passwords, signed HTTP-only session cookie, middleware-protected routes)
- Dashboard with counts and recent changes
- Create / edit / delete **countries** (name, slug, ISO code, description, image, published)
- Create / edit / delete **cities** within a country
- Create / edit / delete **journeys** within a city: category, duration, price & currency, image, featured flag, published flag
- Inline **steps editor**: add, remove and reorder the stops of a journey
- Slugs auto-generated from names; duplicate slugs are reported clearly
- Deleting a country/city cascades to its cities/journeys (with confirmation)

## Getting started

Requires Node.js 20+.

```bash
git clone https://github.com/MMODOVAR/must-do-city.git
cd must-do-city
npm install
cp .env.example .env          # then set AUTH_SECRET (openssl rand -base64 48) and admin credentials
npm run setup                 # creates the SQLite DB and seeds the admin + sample data
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin — log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
  (defaults: `admin@mustdocity.local` / `ChangeMe123!` — **change these**)

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run setup` | Apply migrations and seed |
| `npm run db:migrate` | Create a new migration after editing `prisma/schema.prisma` |
| `npm run db:seed` | Create the admin user (and sample data if the DB is empty) |
| `npm run db:studio` | Browse the database in Prisma Studio |

## Data model

```
Country 1─* City 1─* Journey 1─* JourneyStep
Admin (back-office users)
```

See [`prisma/schema.prisma`](prisma/schema.prisma).

## Project structure

```
src/
  app/
    (site)/                     public website
      page.tsx                  home
      [country]/                country → [city] → [journey]
    admin/
      login/                    sign-in page
      (panel)/                  protected back office (dashboard, countries, cities, journeys)
      actions.ts                server actions: auth + CRUD
  components/                   public UI + admin forms
  lib/                          db client, session/auth, helpers
  middleware.ts                 protects /admin/*
prisma/
  schema.prisma, migrations/, seed.ts
```

## Going to production

- Set a strong `AUTH_SECRET` and change the admin password.
- SQLite is fine for a single server. For serverless hosting (e.g. Vercel), use Postgres:
  1. Change `provider = "postgresql"` in `prisma/schema.prisma`
  2. `npm i @prisma/adapter-pg` and swap `PrismaBetterSQLite3` for `PrismaPg` in `src/lib/db.ts`
  3. Recreate migrations with `npx prisma migrate dev --name init`

## Ideas / roadmap

- Image uploads (instead of image URLs)
- Multiple admin users & roles
- Multi-language content
- Bookings / favourites for visitors
- Map view of journey steps
