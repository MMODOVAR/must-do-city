import Link from "next/link";
import { Cover } from "@/modules/shared/ui/Cover";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Rating } from "@/modules/shared/ui/Stars";
import { routes } from "@/modules/shared/routes";
import { durationLabel, priceLabel } from "../domain";
import type { ExperienceCardRow } from "../repository";

export function ExperienceCard({ e, showPlace = true }: { e: ExperienceCardRow; showPlace?: boolean }) {
  const price = priceLabel(e.price, e.currency, e.pricingType);
  const duration = durationLabel(e.durationHours);
  return (
    <Link
      href={routes.experience(e.slug)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative">
        <Cover src={e.imageUrl} alt={e.title} className="h-48 w-full" />
        {e.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">
            {e.category.icon} {e.category.name}
          </span>
        )}
        {e.isPrivate && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-white">Private</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
          {showPlace && <span>{e.city.name}, {e.city.country.name}</span>}
          <Rating average={e.ratingAverage} count={e.reviewCount} />
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-clay">{e.title}</h3>
        {e.summary && <p className="line-clamp-2 text-sm text-stone-600">{e.summary}</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          {e.host ? (
            <span className="flex items-center gap-2 text-xs text-stone-600">
              <Avatar name={e.host.name} src={e.host.avatarUrl} size={26} /> with {e.host.name.split(" ")[0]}
            </span>
          ) : <span />}
          <span className="text-right text-sm">
            {duration && <span className="mr-2 text-stone-500">{duration}</span>}
            {price && <span className="font-semibold">{price}</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ExperienceGrid({ items, showPlace, empty = "No experiences yet." }: { items: ExperienceCardRow[]; showPlace?: boolean; empty?: string }) {
  if (items.length === 0) return <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">{empty}</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => <ExperienceCard key={e.id} e={e} showPlace={showPlace} />)}
    </div>
  );
}
