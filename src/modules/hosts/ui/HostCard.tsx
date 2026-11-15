import Link from "next/link";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Rating } from "@/modules/shared/ui/Stars";
import { routes } from "@/modules/shared/routes";

export type HostCardData = {
  slug: string;
  name: string;
  tagline: string | null;
  avatarUrl: string | null;
  verified: boolean;
  city: { name: string };
  ratingAverage: number;
  reviewCount: number;
  experienceCount: number;
};

export function HostCard({ host }: { host: HostCardData }) {
  return (
    <Link href={routes.host(host.slug)} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <Avatar name={host.name} src={host.avatarUrl} size={64} />
      <div className="min-w-0">
        <p className="flex items-center gap-1 font-semibold group-hover:text-clay">
          {host.name}
          {host.verified && <span title="Verified host" className="text-sea">✔</span>}
        </p>
        {host.tagline && <p className="truncate text-sm text-stone-600">{host.tagline}</p>}
        <p className="mt-1 flex items-center gap-2 text-xs text-stone-500">
          {host.city.name} · <Rating average={host.ratingAverage} count={host.reviewCount} />
        </p>
      </div>
    </Link>
  );
}
