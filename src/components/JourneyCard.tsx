import Link from "next/link";
import { Cover } from "./Cover";
import { formatPrice } from "@/lib/utils";

type Props = {
  href: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  category: string | null;
  durationHours: number | null;
  price: number | null;
  currency: string;
  place?: string;
};

export function JourneyCard(j: Props) {
  const price = formatPrice(j.price, j.currency);
  return (
    <Link
      href={j.href}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <Cover src={j.imageUrl} alt={j.title} className="h-44 w-full" />
      <div className="space-y-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {j.category && <span className="rounded-full bg-orange-50 px-2 py-0.5 font-medium text-clay">{j.category}</span>}
          {j.place && <span className="text-stone-500">{j.place}</span>}
        </div>
        <h3 className="font-display text-xl font-semibold group-hover:text-clay">{j.title}</h3>
        {j.summary && <p className="line-clamp-2 text-sm text-stone-600">{j.summary}</p>}
        <div className="flex gap-4 pt-1 text-sm text-stone-500">
          {j.durationHours != null && <span>{j.durationHours} h</span>}
          {price && <span className="font-medium text-stone-700">{price}</span>}
        </div>
      </div>
    </Link>
  );
}
