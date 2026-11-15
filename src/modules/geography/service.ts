import { slugify } from "@/modules/shared/text";
import { geographyRepository as repo } from "./repository";
import type { CityInput, CountryInput } from "./schemas";

export const geographyService = {
  listDestinations: repo.publishedCountries,
  findCountry: repo.publishedCountryBySlug,
  findCity: repo.publishedCity,
  listMappableCities: repo.publishedCitiesWithCountry,

  /* ---- admin use cases ---- */
  adminCountries: repo.countries,
  adminCountry: repo.country,
  countryOptions: repo.countryOptions,
  saveCountry(id: string | null, input: CountryInput) {
    const data = { ...input, slug: slugify(input.slug ?? input.name) };
    return id ? repo.updateCountry(id, data) : repo.createCountry(data);
  },
  deleteCountry: repo.deleteCountry,

  adminCities: repo.cities,
  adminCity: repo.city,
  cityOptions: async () =>
    (await repo.cityOptions()).map((c) => ({ value: c.id, label: `${c.name} — ${c.country.name}` })),
  saveCity(id: string | null, input: CityInput) {
    const data = { ...input, slug: slugify(input.slug ?? input.name) };
    return id ? repo.updateCity(id, data) : repo.createCity(data);
  },
  deleteCity: repo.deleteCity,
  counts: repo.counts,
};
