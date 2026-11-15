import { z } from "zod";
import { zInt, zRequired, zText } from "@/modules/shared/forms";

export const categoryInput = z.object({
  name: zRequired("Category name", 80),
  slug: zText(80),
  icon: zText(8),
  description: zText(500),
  sortOrder: zInt("Sort order").transform((n) => n ?? 0),
});
export type CategoryInput = z.infer<typeof categoryInput>;
