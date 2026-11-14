import { geographyService } from "@/modules/geography/service";
import { hasCoordinates, hotspotScore } from "@/modules/geography/domain";
import { experiencesService } from "@/modules/experiences/service";
import { routes } from "@/modules/shared/routes";
import { TOP_HOTSPOTS, type MapCity, type MapCountry, type MapData } from "./domain";

export const exploreService = {
  /** Cities with coordinates, ranked into hotspots, grouped by country. */
  async mapData(): Promise<MapData> {
    const [cities, stats] = await Promise.all([geographyService.listMappableCities(), experiencesService.statsByCity()]);
    const empty = { experienceCount: 0, reviewCount: 0, ratingAverage: 0 };

    const mapped: MapCity[] = cities.filter(hasCoordinates).map((c) => {
      const s = stats.get(c.id) ?? empty;
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        tagline: c.tagline,
        imageUrl: c.imageUrl,
        lat: c.latitude,
        lng: c.longitude,
        countryId: c.countryId,
        countryName: c.country.name,
        countrySlug: c.country.slug,
        ...s,
        isHotspot: c.isHotspot,
        score: hotspotScore(s, c.isHotspot),
        rank: null,
        href: routes.city(c.country.slug, c.slug),
        experiencesHref: routes.experiences({ country: c.country.slug, city: c.slug }),
      };
    });

    const top = [...mapped].filter((c) => c.experienceCount > 0 || c.isHotspot).sort((a, b) => b.score - a.score).slice(0, TOP_HOTSPOTS);
    top.forEach((c, i) => (c.rank = i + 1));

    const byCountry = new Map<string, MapCountry>();
    for (const c of cities) {
      const entry = byCountry.get(c.countryId) ?? {
        id: c.countryId,
        name: c.country.name,
        slug: c.country.slug,
        href: routes.country(c.country.slug),
        cityIds: [],
        center: c.country.latitude !== null && c.country.longitude !== null ? [c.country.latitude, c.country.longitude] : null,
      };
      if (hasCoordinates(c)) entry.cityIds.push(c.id);
      byCountry.set(c.countryId, entry);
    }

    return {
      cities: mapped,
      countries: [...byCountry.values()].sort((a, b) => a.name.localeCompare(b.name)),
      topHotspots: top.map((c) => c.id),
    };
  },
};
