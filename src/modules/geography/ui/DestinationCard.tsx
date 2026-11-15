import Link from "next/link";
import { Cover } from "@/modules/shared/ui/Cover";

export function DestinationCard({ href, name, imageUrl, subtitle, tall }: { href: string; name: string; imageUrl: string | null; subtitle: string; tall?: boolean }) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-2xl shadow-sm">
      <Cover src={imageUrl} alt={name} showLabel={false} className={`${tall ? "h-72" : "h-52"} w-full transition duration-500 group-hover:scale-105`} />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 text-white">
        <h3 className="font-display text-2xl font-semibold">{name}</h3>
        <p className="text-sm text-white/85">{subtitle}</p>
      </div>
    </Link>
  );
}
