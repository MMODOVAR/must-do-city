import type { Prisma } from "@prisma/client";
import { prisma } from "@/modules/shared/db";
import type { ExperienceFilters } from "./domain";
import type { ExperienceInput } from "./schemas";

/** Only published experiences in published cities/countries are public. */
const visible: Prisma.ExperienceWhereInput = {
  published: true,
  city: { published: true, country: { published: true } },
};

/** Everything an experience card needs. */
export const cardInclude = {
  city: { include: { country: true } },
  category: true,
  host: { select: { name: true, slug: true, avatarUrl: true, verified: true } },
} satisfies Prisma.ExperienceInclude;

export type ExperienceCardRow = Prisma.ExperienceGetPayload<{ include: typeof cardInclude }>;

function whereFor(f: Partial<ExperienceFilters>): Prisma.ExperienceWhereInput {
  const and: Prisma.ExperienceWhereInput[] = [visible];
  if (f.q) and.push({ OR: [{ title: { contains: f.q } }, { summary: { contains: f.q } }, { city: { name: { contains: f.q } } }] });
  if (f.country) and.push({ city: { country: { slug: f.country } } });
  if (f.city) and.push({ city: { slug: f.city } });
  if (f.category) and.push({ category: { slug: f.category } });
  if (f.language) and.push({ languages: { contains: f.language } });
  if (f.maxPrice) and.push({ price: { lte: f.maxPrice } });
  return { AND: and };
}

const orderBy: Record<ExperienceFilters["sort"], Prisma.ExperienceOrderByWithRelationInput[]> = {
  recommended: [{ featured: "desc" }, { reviewCount: "desc" }, { ratingAverage: "desc" }],
  rating: [{ ratingAverage: "desc" }, { reviewCount: "desc" }],
  "price-asc": [{ price: "asc" }],
  "price-desc": [{ price: "desc" }],
  newest: [{ createdAt: "desc" }],
};

export const experiencesRepository = {
  search: async (f: ExperienceFilters, pageSize: number) => {
    const where = whereFor(f);
    const [items, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        include: cardInclude,
        orderBy: orderBy[f.sort],
        skip: (f.page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.experience.count({ where }),
    ]);
    return { items, total };
  },

  list: (f: Partial<ExperienceFilters> & { featured?: boolean; hostId?: string }, take?: number) =>
    prisma.experience.findMany({
      where: { AND: [whereFor(f), f.featured ? { featured: true } : {}, f.hostId ? { hostId: f.hostId } : {}] },
      include: cardInclude,
      orderBy: orderBy[f.sort ?? "recommended"],
      take,
    }),

  publishedBySlug: (slug: string) =>
    prisma.experience.findFirst({
      where: { ...visible, slug },
      include: {
        ...cardInclude,
        host: true,
        steps: { orderBy: { order: "asc" } },
        photos: { orderBy: { order: "asc" } },
      },
    }),

  /** For booking: the bookable facts of a published experience. */
  bookable: (id: string) =>
    prisma.experience.findFirst({
      where: { ...visible, id },
      select: { id: true, title: true, slug: true, price: true, currency: true, pricingType: true, maxGroupSize: true },
    }),

  /** Per-city experience stats, used to rank map hotspots. */
  statsByCity: async () => {
    const rows = await prisma.experience.groupBy({
      by: ["cityId"],
      where: visible,
      _count: { _all: true },
      _sum: { reviewCount: true },
    });
    // review-weighted average per city
    const rated = await prisma.experience.findMany({ where: { ...visible, reviewCount: { gt: 0 } }, select: { cityId: true, ratingAverage: true, reviewCount: true } });
    return new Map(
      rows.map((r) => {
        const mine = rated.filter((x) => x.cityId === r.cityId);
        const reviews = mine.reduce((n, x) => n + x.reviewCount, 0);
        const avg = reviews ? mine.reduce((n, x) => n + x.ratingAverage * x.reviewCount, 0) / reviews : 0;
        return [r.cityId, { experienceCount: r._count._all, reviewCount: r._sum.reviewCount ?? 0, ratingAverage: avg }];
      }),
    );
  },

  languages: async () => {
    const rows = await prisma.experience.findMany({ where: visible, select: { languages: true } });
    return rows.map((r) => r.languages);
  },

  /* ---- admin ---- */
  adminList: (q?: string) =>
    prisma.experience.findMany({
      where: q ? { OR: [{ title: { contains: q } }, { city: { name: { contains: q } } }, { host: { name: { contains: q } } }] } : undefined,
      orderBy: { updatedAt: "desc" },
      include: { city: { include: { country: true } }, host: true, category: true, _count: { select: { steps: true, bookings: true } } },
    }),
  byId: (id: string) =>
    prisma.experience.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: "asc" } }, photos: { orderBy: { order: "asc" } }, city: { include: { country: true } } },
    }),
  options: () =>
    prisma.experience.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, city: { select: { name: true } } } }),
  recent: (take: number) => prisma.experience.findMany({ orderBy: { updatedAt: "desc" }, take, include: { city: true } }),
  counts: async () => {
    const [experiences, steps] = await Promise.all([prisma.experience.count(), prisma.experienceStep.count()]);
    return { experiences, steps };
  },

  create: (data: Prisma.ExperienceUncheckedCreateInput) => prisma.experience.create({ data }),
  /** Replace all steps and photos in the same transaction as the update. */
  update: (id: string, data: Prisma.ExperienceUncheckedUpdateInput) =>
    prisma.$transaction([
      prisma.experienceStep.deleteMany({ where: { experienceId: id } }),
      prisma.experiencePhoto.deleteMany({ where: { experienceId: id } }),
      prisma.experience.update({ where: { id }, data }),
    ]),
  delete: (id: string) => prisma.experience.delete({ where: { id } }),
  setRating: (id: string, ratingAverage: number, reviewCount: number) =>
    prisma.experience.update({ where: { id }, data: { ratingAverage, reviewCount } }),
};

export type { ExperienceInput };
