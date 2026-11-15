# Architecture

Must Do City is organised by **business domain** (bounded contexts), not by technical layer.
Everything about bookings lives in `src/modules/bookings`, everything about hosts in `src/modules/hosts`, and so on.
Pages in `src/app` are thin: they read URL params, call module **services**, and render module **UI**.

```
src/
  app/                    Next.js routes only (thin)
    (site)/               public website
    admin/(panel)/        back office (protected by middleware.ts)
  modules/
    shared/               kernel: db client, form helpers, routes, money/text utils, UI atoms, admin UI kit
    identity/             admin sessions + login/logout
    geography/            countries & cities (coordinates, hotspot flag)
    hosts/                local hosts and their profiles
    categories/           experience themes (Food & Drink, Nightlife…)
    experiences/          the catalog: experiences, itineraries, search & filters
    reviews/              verified guest reviews + rating aggregation
    bookings/             booking requests and their lifecycle
    explore/              read model for the landing-page map (composes geography + experiences)
```

## Inside a module

Each module uses the same files, so you always know where to look:

| File | Responsibility | May import |
| --- | --- | --- |
| `domain.ts` | Pure business rules and types (no I/O). E.g. booking status transitions, price totals, hotspot score. | `shared` |
| `schemas.ts` | Zod validation of incoming form data. | `shared`, own `domain` |
| `repository.ts` | All Prisma queries for the module. **The only place that touches the database.** | `shared/db` |
| `service.ts` | Use cases: orchestrates domain rules + repository (+ other modules' **services**). | own files, other services |
| `actions.ts` | Next.js server actions: auth check → parse schema → call service → revalidate/redirect. | own service/schemas, `identity` |
| `ui/` | React components for this domain (public and admin). | own `domain`, `shared/ui`, own actions |

Rules of thumb:

- **Modules talk to each other through services**, never through another module's repository.
  E.g. `bookings/service` asks `experiences/service.findBookable()`; `reviews/service` asks `bookings/service.findReviewable()`.
- **Business rules live in `domain.ts`** and throw `DomainError` with a user-facing message.
  `toFormError()` turns it (and Zod / unique-constraint errors) into form feedback.
- **URLs come from `shared/routes.ts`**, so no page hand-builds a path.

## Key domain rules

- **Bookings** start `PENDING`. Allowed transitions: `PENDING → CONFIRMED | DECLINED | CANCELLED`, `CONFIRMED → COMPLETED | CANCELLED`.
  Dates must be from tomorrow up to a year ahead; guests ≤ the experience's max group size. Each booking gets a reference like `MDC-7K2QX9`.
- **Pricing**: `PER_PERSON` totals scale with guests; `PER_GROUP` is a flat price.
- **Reviews** are *verified*: a guest needs their booking reference + email, and the booking must be `COMPLETED`. One review per booking.
  Each review change recalculates the experience's denormalised `ratingAverage` / `reviewCount`.
- **Hotspots** on the map are ranked by `hotspotScore()` (experience count, reviews × rating, plus a boost for cities flagged as hotspots by an admin).

## Data model

```
Country 1─* City 1─* Host
                 1─* Experience *─1 Host, *─1 Category
                        1─* ExperienceStep   (stops; optional lat/lng → itinerary map)
                        1─* ExperiencePhoto  (gallery)
                        1─* Booking 1─0..1 Review
                        1─* Review
Admin
```

List-like fields (languages, highlights, included…) are stored as comma/newline-separated text so the schema works on
SQLite and Postgres alike; `shared/text.ts` parses them.

## Maps

Both maps (landing-page hotspots, experience itinerary) use Leaflet with `shared/map/TileLayerWithFallback`:
OpenStreetMap tiles by default, Esri as an automatic fallback, or your own provider via `NEXT_PUBLIC_MAP_TILE_URL`.
Leaflet needs `window`, so map components are loaded with `next/dynamic` and `ssr: false`.

## Adding a feature

1. Add fields/models in `prisma/schema.prisma`, then `npm run db:migrate`.
2. Put rules in the module's `domain.ts`, queries in `repository.ts`, the use case in `service.ts`.
3. Expose it through `actions.ts` (writes) and use the service from the page (reads).
