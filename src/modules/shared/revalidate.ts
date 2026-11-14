import { revalidatePath } from "next/cache";

/** Content changes can show up on many public pages (map, lists, detail), so refresh them all. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
