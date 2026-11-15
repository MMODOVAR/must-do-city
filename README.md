# Must Do City

A marketplace for **private experiences hosted by locals** (in the spirit of withlocals.com).
Visitors explore an interactive map of hotspots, pick a country and city, browse experiences by category,
read verified reviews, and send booking requests. Admins manage everything from a back office.

Built with **Next.js 15 (App Router)**, **Prisma 6**, **SQLite** for local development, **Tailwind CSS 4** and **Leaflet** maps.
The code is organised by business domain — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Features

**Public website**
- Landing page with an **interactive map** of top hotspots: choose a country → city and the map flies there; ranked hotspot chips; popups with ratings
- Categories, trending hotspots, featured experiences, local hosts, recent reviews
- Destinations: country → city pages with experiences, category filters and the city's hosts
- **Experience search**: text, country, city, category, language, max price, sort, pagination
- Experience page laid out like a Viator tour page: **photo gallery** with full-screen viewer, badges (Top rated, Free cancellation…),
  quick facts, overview & highlights, what's included, **meeting point / start time / end point**, **"What to expect" itinerary
  with numbered stops on a side map** (route line, hover to highlight), additional info, cancellation policy, host,
  and **reviews** with a clickable rating breakdown, star filter, sorting and "show more"
- **Booking requests** with live price total (per person / per group) and a booking reference
- **Verified reviews**: guests review with their booking reference once the experience is completed
- Host profiles with languages, response time, rating and their experiences

**Admin back office** (`/admin`)
- Secure login (bcrypt-hashed passwords, signed HTTP-only session cookie, middleware-protected routes)
- Dashboard with pending bookings and recent activity
- **Bookings** inbox: confirm / decline / cancel / complete (only valid transitions are offered), internal notes
- CRUD for **experiences** (photo manager, itinerary editor with stop coordinates and admission), **hosts**, **categories**, **cities** (coordinates + hotspot flag) and **countries**
- **Reviews** moderation: hide/publish, delete, add reviews collected elsewhere

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
| `npm run db:seed` | Create the admin user and sample destinations, hosts, experiences and reviews (safe to re-run) |
| `npm run db:studio` | Browse the database in Prisma Studio |

## Data model & architecture

```
Country 1─* City 1─* Host 1─* Experience 1─* ExperienceStep
                        Category 1─* Experience 1─* Booking 1─0..1 Review
```

See [`prisma/schema.prisma`](prisma/schema.prisma) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Upgrading an existing database:** `npm run setup` applies the new migration, which converts your existing journeys into
experiences (keeping their steps and categories), then the seed fills in sample hosts, map coordinates and reviews
without overwriting anything you edited.

## Project structure

```
src/
  app/                  routes only — (site)/ public pages, admin/(panel)/ back office
  modules/              one folder per business domain:
    geography/ hosts/ categories/ experiences/ reviews/ bookings/ explore/ identity/ shared/
    each with domain.ts · schemas.ts · repository.ts · service.ts · actions.ts · ui/
  middleware.ts         protects /admin/*
prisma/
  schema.prisma, migrations/, seed.ts, seed/data.ts
docs/ARCHITECTURE.md    how the modules fit together
```

## Going to production

- Set a strong `AUTH_SECRET` and change the admin password.
- SQLite is fine for a single server. For serverless hosting (e.g. Vercel), use Postgres:
  1. Change `provider = "postgresql"` in `prisma/schema.prisma`
  2. Recreate migrations with `npx prisma migrate dev --name init`
- Map tiles default to OpenStreetMap (no API key; falls back to Esri if OSM tiles fail). OSM's public tiles are for light use only, so for real traffic set `NEXT_PUBLIC_MAP_TILE_URL` to your own provider (see `.env.example`).
- Booking requests are stored and managed in the admin. Sending emails and taking payments are not wired up yet.

## Ideas / roadmap

- Email notifications for booking requests and status changes
- Online payments (e.g. Stripe) and host availability calendars
- Host accounts so locals manage their own experiences
- Image uploads (instead of image URLs)
- Visitor accounts with wishlists
- Multi-language content
