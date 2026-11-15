import Link from "next/link";
import { routes } from "@/modules/shared/routes";

type Chip = { slug: string; name: string; icon: string | null };

/** Category filter chips; `extra` keeps other filters (e.g. city) in the link. */
export function CategoryChips({ categories, active, extra = {} }: { categories: Chip[]; active?: string; extra?: Record<string, string | undefined> }) {
  const cls = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${on ? "border-ink bg-ink text-white" : "border-stone-300 bg-white hover:border-ink"}`;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link href={routes.experiences(extra)} className={cls(!active)}>All</Link>
      {categories.map((c) => (
        <Link key={c.slug} href={routes.experiences({ ...extra, category: c.slug })} className={cls(active === c.slug)}>
          {c.icon} {c.name}
        </Link>
      ))}
    </div>
  );
}
