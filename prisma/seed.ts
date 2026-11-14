/**
 * Seed: creates the admin user and sample content.
 * Idempotent — records are matched by slug, and existing records only get
 * their EMPTY fields filled, so admin edits are never overwritten.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { categories, countries, reviewPool, FREE_CANCEL } from "./seed/data";

const prisma = new PrismaClient();

/** Keep only the keys whose current value is null/undefined. */
function onlyMissing<T extends Record<string, unknown>>(current: Record<string, unknown>, wanted: T): Partial<T> {
  return Object.fromEntries(Object.entries(wanted).filter(([k]) => current[k] === null || current[k] === undefined)) as Partial<T>;
}

const DAY = 24 * 3600 * 1000;
let refCounter = 0;
const ref = () => `MDC-DEMO${String(++refCounter).padStart(2, "0")}`;

async function main() {
  // --- Admin account ---
  const email = (process.env.ADMIN_EMAIL ?? "admin@mustdocity.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`Admin ready: ${email}`);

  // --- Categories ---
  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: c.slug } });
    const row = existing
      ? await prisma.category.update({ where: { id: existing.id }, data: onlyMissing(existing, { icon: c.icon, description: c.description }) })
      : await prisma.category.create({ data: c });
    categoryIds.set(c.slug, row.id);
  }

  let poolIndex = 0;
  for (const country of countries) {
    const countryData = { name: country.name, isoCode: country.iso, description: country.description, latitude: country.lat, longitude: country.lng };
    const existingCountry = await prisma.country.findUnique({ where: { slug: country.slug } });
    const countryRow = existingCountry
      ? await prisma.country.update({ where: { id: existingCountry.id }, data: onlyMissing(existingCountry, countryData) })
      : await prisma.country.create({ data: { slug: country.slug, ...countryData } });

    for (const city of country.cities) {
      const cityData = { name: city.name, tagline: city.tagline, description: city.description, latitude: city.lat, longitude: city.lng };
      const existingCity = await prisma.city.findUnique({ where: { countryId_slug: { countryId: countryRow.id, slug: city.slug } } });
      const cityRow = existingCity
        ? await prisma.city.update({
            where: { id: existingCity.id },
            data: { ...onlyMissing(existingCity, cityData), ...(city.hotspot && existingCity.latitude === null ? { isHotspot: true } : {}) },
          })
        : await prisma.city.create({ data: { slug: city.slug, countryId: countryRow.id, isHotspot: !!city.hotspot, ...cityData } });

      const hostIds = new Map<string, string>();
      for (const h of city.hosts) {
        const row = await prisma.host.upsert({
          where: { slug: h.slug },
          update: {},
          create: {
            ...h,
            verified: !!h.verified,
            cityId: cityRow.id,
            memberSince: new Date(Date.now() - (400 + h.name.length * 37) * DAY),
          },
        });
        hostIds.set(h.slug, row.id);
      }

      for (const x of city.experiences) {
        const fields = {
          title: x.title,
          summary: x.summary,
          description: x.description ?? null,
          durationHours: x.durationHours,
          price: x.price,
          maxGroupSize: x.maxGroupSize ?? null,
          languages: x.languages,
          highlights: x.highlights.join("\n"),
          included: x.included.join("\n"),
          notIncluded: x.notIncluded?.join("\n") ?? null,
          meetingPoint: x.meetingPoint,
          cancellationPolicy: FREE_CANCEL,
          hostId: hostIds.get(x.host) ?? null,
          categoryId: categoryIds.get(x.category) ?? null,
        };
        const existing = await prisma.experience.findUnique({ where: { slug: x.slug }, include: { _count: { select: { steps: true, reviews: true } } } });
        const exp = existing
          ? await prisma.experience.update({ where: { id: existing.id }, data: onlyMissing(existing, fields) })
          : await prisma.experience.create({
              data: { slug: x.slug, cityId: cityRow.id, pricingType: x.pricingType ?? "PER_PERSON", featured: !!x.featured, ...fields },
            });

        if (!existing || existing._count.steps === 0) {
          await prisma.experienceStep.createMany({
            data: x.steps.map(([title, location, duration, description], i) => ({ experienceId: exp.id, order: i + 1, title, location, duration, description })),
          });
        }

        // Verified reviews: each one comes from a completed booking.
        if (!existing || existing._count.reviews === 0) {
          const howMany = 2 + (x.slug.length % 3);
          const ratings: number[] = [];
          for (let i = 0; i < howMany; i++) {
            const r = reviewPool[poolIndex++ % reviewPool.length];
            const date = new Date(Date.now() - (20 + i * 23) * DAY);
            const guests = 2;
            const booking = await prisma.booking.create({
              data: {
                reference: `${ref()}${exp.id.slice(-3).toUpperCase()}`,
                status: "COMPLETED",
                date,
                guests,
                totalPrice: x.pricingType === "PER_GROUP" ? x.price : x.price * guests,
                currency: exp.currency,
                guestName: r.name,
                guestEmail: `${r.name.toLowerCase()}@example.com`,
                experienceId: exp.id,
              },
            });
            await prisma.review.create({
              data: { experienceId: exp.id, bookingId: booking.id, rating: r.rating, title: r.title, comment: r.comment, authorName: r.name, authorCountry: r.country, createdAt: new Date(date.getTime() + DAY) },
            });
            ratings.push(r.rating);
          }
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          await prisma.experience.update({ where: { id: exp.id }, data: { ratingAverage: Math.round(avg * 100) / 100, reviewCount: ratings.length } });
        }
      }
    }
  }

  // --- A few open booking requests so the admin inbox isn't empty ---
  if ((await prisma.booking.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } })) === 0) {
    const picks = await prisma.experience.findMany({ where: { featured: true }, take: 3 });
    const guests = [
      { name: "Olivia Smith", email: "olivia@example.com", status: "PENDING", msg: "We're vegetarian — is that OK?" },
      { name: "Kenji Watanabe", email: "kenji@example.com", status: "PENDING", msg: null },
      { name: "Clara Müller", email: "clara@example.com", status: "CONFIRMED", msg: "Celebrating our anniversary!" },
    ];
    for (const [i, e] of picks.entries()) {
      const g = guests[i];
      await prisma.booking.create({
        data: {
          reference: `MDC-OPEN${i + 1}`,
          status: g.status,
          date: new Date(Date.now() + (7 + i * 5) * DAY),
          guests: 2,
          totalPrice: e.price === null ? null : e.pricingType === "PER_GROUP" ? e.price : e.price * 2,
          currency: e.currency,
          guestName: g.name,
          guestEmail: g.email,
          message: g.msg,
          experienceId: e.id,
        },
      });
    }
  }

  const counts = await Promise.all([prisma.country.count(), prisma.city.count(), prisma.host.count(), prisma.experience.count(), prisma.review.count()]);
  console.log(`Sample content ready: ${counts[0]} countries, ${counts[1]} cities, ${counts[2]} hosts, ${counts[3]} experiences, ${counts[4]} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
