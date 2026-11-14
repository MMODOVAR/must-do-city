import { prisma } from "@/modules/shared/db";
import { cardInclude } from "@/modules/experiences/repository";
import type { HostInput } from "./schemas";

const publishedExperience = { published: true };

export const hostsRepository = {
  publishedBySlug: (slug: string) =>
    prisma.host.findFirst({
      where: { slug, published: true },
      include: {
        city: { include: { country: true } },
        experiences: {
          where: publishedExperience,
          orderBy: [{ featured: "desc" }, { ratingAverage: "desc" }],
          include: cardInclude,
        },
      },
    }),

  published: (where: { cityId?: string } = {}, take?: number) =>
    prisma.host.findMany({
      where: { published: true, ...where, city: { published: true } },
      orderBy: [{ verified: "desc" }, { name: "asc" }],
      take,
      include: {
        city: { include: { country: true } },
        experiences: { where: publishedExperience, select: { ratingAverage: true, reviewCount: true } },
      },
    }),

  all: (q?: string) =>
    prisma.host.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { city: { name: { contains: q } } }] } : undefined,
      orderBy: { name: "asc" },
      include: { city: { include: { country: true } }, _count: { select: { experiences: true } } },
    }),
  options: () =>
    prisma.host.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, city: { select: { name: true } } } }),
  byId: (id: string) =>
    prisma.host.findUnique({ where: { id }, include: { city: true, experiences: { orderBy: { title: "asc" } } } }),
  create: (data: HostInput & { slug: string }) => prisma.host.create({ data }),
  update: (id: string, data: HostInput & { slug: string }) => prisma.host.update({ where: { id }, data }),
  delete: (id: string) => prisma.host.delete({ where: { id } }),
  count: () => prisma.host.count(),
};
