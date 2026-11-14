import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hostsService } from "@/modules/hosts/service";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Rating } from "@/modules/shared/ui/Stars";
import { Breadcrumbs } from "@/modules/shared/ui/Breadcrumbs";
import { formatDate } from "@/modules/shared/money";
import { routes } from "@/modules/shared/routes";
import { splitList } from "@/modules/shared/text";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const host = await hostsService.findPublished((await params).slug);
  return { title: host ? `${host.name}, local host in ${host.city.name}` : "Not found", description: host?.tagline ?? undefined };
}

export default async function HostPage({ params }: Params) {
  const host = await hostsService.findPublished((await params).slug);
  if (!host) notFound();
  const languages = splitList(host.languages);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: routes.hosts(), label: "Hosts" }, { label: host.name }]} />
      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        <aside className="card h-fit space-y-4 p-6 text-center">
          <div className="flex justify-center"><Avatar name={host.name} src={host.avatarUrl} size={120} /></div>
          <div>
            <h1 className="font-display text-3xl font-bold">{host.name}</h1>
            {host.tagline && <p className="text-stone-600">{host.tagline}</p>}
          </div>
          <div className="flex justify-center"><Rating average={host.ratingAverage} count={host.reviewCount} /></div>
          <ul className="space-y-1 border-t border-stone-200 pt-4 text-left text-sm text-stone-600">
            {host.verified && <li className="text-sea">✔ Verified host</li>}
            <li>📍 {host.city.name}, {host.city.country.name}</li>
            {languages.length > 0 && <li>🗣 Speaks {languages.join(", ")}</li>}
            {host.responseTimeHours != null && <li>⚡ Replies within {host.responseTimeHours} h</li>}
            <li>🗓 Host since {formatDate(host.memberSince, { month: "long", year: "numeric" })}</li>
          </ul>
        </aside>
        <div>
          {host.bio && (
            <section>
              <h2 className="mb-3 font-display text-2xl font-semibold">About {host.name.split(" ")[0]}</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-stone-700">{host.bio}</p>
            </section>
          )}
          <h2 className="mb-6 mt-12 font-display text-2xl font-semibold">Experiences by {host.name.split(" ")[0]}</h2>
          <ExperienceGrid items={host.experiences} />
        </div>
      </div>
    </div>
  );
}
