import { prisma } from "@/modules/shared/db";
import type { CityInput, CountryInput } from "./schemas";

const publishedExperiences = { experiences: { where: { published: true } } };

export const geographyRepository = {
  /* ---- public ---- */
  publishedCountries: () =>
    prisma.country.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      include: {
        cities: { where: { published: true }, orderBy: { name: "asc" }, include: { _count: { select: publishedExperiences } } },
      },
    }),

  publishedCountryBySlug: (slug: string) =>
    prisma.country.findFirst({
      where: { slug, published: true },
      include: {
        cities: { where: { published: true }, orderBy: { name: "asc" }, include: { _count: { select: publishedExperiences } } },
      },
    }),

  publishedCity: (countrySlug: string, citySlug: string) =>
    prisma.city.findFirst({
      where: { slug: citySlug, published: true, country: { slug: countrySlug, published: true } },
      include: { country: true },
    }),

  publishedCitiesWithCountry: () =>
    prisma.city.findMany({
      where: { published: true, country: { published: true } },
      orderBy: { name: "asc" },
      include: { country: true },
    }),

  /* ---- admin ---- */
  countries: () =>
    prisma.country.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { cities: true } } } }),
  countryOptions: () => prisma.country.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  country: (id: string) =>
    prisma.country.findUnique({ where: { id }, include: { cities: { orderBy: { name: "asc" } } } }),
  createCountry: (data: CountryInput & { slug: string }) => prisma.country.create({ data }),
  updateCountry: (id: string, data: CountryInput & { slug: string }) => prisma.country.update({ where: { id }, data }),
  deleteCountry: (id: string) => prisma.country.delete({ where: { id } }),

  cities: (countryId?: string) =>
    prisma.city.findMany({
      where: countryId ? { countryId } : undefined,
      orderBy: [{ country: { name: "asc" } }, { name: "asc" }],
      include: { country: true, _count: { select: { experiences: true, hosts: true } } },
    }),
  cityOptions: () =>
    prisma.city.findMany({
      orderBy: [{ country: { name: "asc" } }, { name: "asc" }],
      select: { id: true, name: true, country: { select: { name: true } } },
    }),
  city: (id: string) => prisma.city.findUnique({ where: { id }, include: { country: true } }),
  createCity: (data: CityInput & { slug: string }) => prisma.city.create({ data }),
  updateCity: (id: string, data: CityInput & { slug: string }) => prisma.city.update({ where: { id }, data }),
  deleteCity: (id: string) => prisma.city.delete({ where: { id } }),

  counts: async () => {
    const [countries, cities, hotspots] = await Promise.all([
      prisma.country.count(),
      prisma.city.count(),
      prisma.city.count({ where: { isHotspot: true } }),
    ]);
    return { countries, cities, hotspots };
  },
};
