import { DomainError } from "@/modules/shared/forms";
import { slugify, splitList } from "@/modules/shared/text";
import type { ExperienceFilters } from "./domain";
import { experiencesRepository as repo } from "./repository";
import type { ExperienceInput } from "./schemas";

export const PAGE_SIZE = 12;

export const experiencesService = {
  async search(filters: ExperienceFilters) {
    const { items, total } = await repo.search(filters, PAGE_SIZE);
    return { items, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
  },
  featured: (take = 6) => repo.list({ featured: true }, take),
  inCity: (citySlug: string, countrySlug: string, take?: number) => repo.list({ city: citySlug, country: countrySlug }, take),
  byHost: (hostId: string, take?: number) => repo.list({ hostId }, take),
  findPublished: repo.publishedBySlug,
  findBookable: repo.bookable,
  statsByCity: repo.statsByCity,

  /** All languages offered across published experiences, for the filter. */
  async languages() {
    return [...new Set((await repo.languages()).flatMap(splitList))].sort();
  },

  /* ---- admin use cases ---- */
  adminList: repo.adminList,
  adminGet: repo.byId,
  recent: repo.recent,
  counts: repo.counts,
  options: async () => (await repo.options()).map((e) => ({ value: e.id, label: `${e.title} (${e.city.name})` })),

  async save(id: string | null, input: ExperienceInput) {
    const { steps, photos, ...fields } = input;
    if (fields.featured && !fields.published) throw new DomainError("A featured experience must also be published.");
    const data = { ...fields, slug: slugify(fields.slug ?? fields.title) };
    const stepRows = steps.map((s, i) => ({
      order: i + 1,
      title: s.title,
      description: s.description || null,
      location: s.location || null,
      duration: s.duration || null,
      latitude: s.latitude,
      longitude: s.longitude,
      admission: s.admission,
    }));
    const photoRows = photos.map((p, i) => ({ order: i + 1, url: p.url, caption: p.caption || null }));
    const nested = { steps: { create: stepRows }, photos: { create: photoRows } };
    if (id) await repo.update(id, { ...data, ...nested });
    else await repo.create({ ...data, ...nested });
  },
  delete: repo.delete,
  setRating: repo.setRating,
};
