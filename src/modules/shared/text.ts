/** Helpers for list-like values stored as text (portable across SQLite / Postgres). */

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "English, French" -> ["English", "French"] */
export function splitList(value: string | null | undefined): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

/** Normalise a comma separated list: trims, removes duplicates and blanks. */
export function normaliseList(value: string | null | undefined): string | null {
  const items = [...new Set(splitList(value))];
  return items.length ? items.join(", ") : null;
}

/** One item per line -> array. */
export function splitLines(value: string | null | undefined): string[] {
  return (value ?? "").split(/\r?\n/).map((s) => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
