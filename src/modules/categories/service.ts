import { slugify } from "@/modules/shared/text";
import { categoriesRepository as repo } from "./repository";
import type { CategoryInput } from "./schemas";

export const categoriesService = {
  /** Categories that currently have at least one published experience. */
  async listActive() {
    return (await repo.withPublishedCounts()).filter((c) => c._count.experiences > 0);
  },
  listAll: repo.all,
  get: repo.byId,
  options: async () => (await repo.all()).map((c) => ({ value: c.id, label: `${c.icon ?? ""} ${c.name}`.trim() })),
  save(id: string | null, input: CategoryInput) {
    const data = { ...input, slug: slugify(input.slug ?? input.name) };
    return id ? repo.update(id, data) : repo.create(data);
  },
  delete: repo.delete,
};
