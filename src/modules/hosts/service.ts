import { slugify } from "@/modules/shared/text";
import { hostsRepository as repo } from "./repository";
import type { HostInput } from "./schemas";

type RatedExperience = { ratingAverage: number; reviewCount: number };

/** A host's overall rating is the review-weighted average of their experiences. */
export function hostRating(experiences: RatedExperience[]) {
  const reviewCount = experiences.reduce((n, e) => n + e.reviewCount, 0);
  const sum = experiences.reduce((n, e) => n + e.ratingAverage * e.reviewCount, 0);
  return { reviewCount, ratingAverage: reviewCount ? sum / reviewCount : 0 };
}

export const hostsService = {
  async findPublished(slug: string) {
    const host = await repo.publishedBySlug(slug);
    return host && { ...host, ...hostRating(host.experiences) };
  },
  async listPublished(opts: { cityId?: string; take?: number } = {}) {
    const hosts = await repo.published(opts.cityId ? { cityId: opts.cityId } : {}, opts.take);
    return hosts.map(({ experiences, ...h }) => ({ ...h, experienceCount: experiences.length, ...hostRating(experiences) }));
  },

  /* ---- admin use cases ---- */
  adminList: repo.all,
  adminGet: repo.byId,
  options: async () => (await repo.options()).map((h) => ({ value: h.id, label: `${h.name} (${h.city.name})` })),
  save(id: string | null, input: HostInput) {
    const data = { ...input, slug: slugify(input.slug ?? input.name) };
    return id ? repo.update(id, data) : repo.create(data);
  },
  delete: repo.delete,
  count: repo.count,
};
