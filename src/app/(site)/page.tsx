import Link from "next/link";
import { exploreService } from "@/modules/explore/service";
import { ExploreMap } from "@/modules/explore/ui/ExploreMap";
import { experiencesService } from "@/modules/experiences/service";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { categoriesService } from "@/modules/categories/service";
import { hostsService } from "@/modules/hosts/service";
import { HostCard } from "@/modules/hosts/ui/HostCard";
import { reviewsService } from "@/modules/reviews/service";
import { geographyService } from "@/modules/geography/service";
import { DestinationCard } from "@/modules/geography/ui/DestinationCard";
import { Stars } from "@/modules/shared/ui/Stars";
import { routes } from "@/modules/shared/routes";
import { plural } from "@/modules/shared/text";

const STEPS = [
  { icon: "🗺️", title: "Pick a city", text: "Use the map to find a hotspot, or browse by country and category." },
  { icon: "🤝", title: "Choose your local", text: "Every experience is run by a local host — read their story and reviews." },
  { icon: "✨", title: "Make it yours", text: "Private by default. Tell your host what you love and they tailor the day." },
];

export default async function HomePage() {
  const [map, featured, categories, hosts, reviews, destinations] = await Promise.all([
    exploreService.mapData(),
    experiencesService.featured(6),
    categoriesService.listActive(),
    hostsService.listPublished({ take: 6 }),
    reviewsService.latest(3),
    geographyService.listDestinations(),
  ]);
  const hotspots = map.topHotspots.map((id) => map.cities.find((c) => c.id === id)!).slice(0, 4);

  return (
    <>
      <section aria-label="Explore the map">
        <ExploreMap data={map} />
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <h2 className="mb-5 font-display text-3xl font-semibold">What are you into?</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.id} href={routes.experiences({ category: c.slug })}
                className="card flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-0.5 hover:border-clay">
                <span className="text-3xl">{c.icon ?? "✦"}</span>
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="text-xs text-stone-500">{plural(c._count.experiences, "experience")}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hotspots.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">Trending hotspots</h2>
            <Link href={routes.destinations()} className="text-sm font-semibold text-clay">All destinations →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotspots.map((c) => (
              <DestinationCard key={c.id} href={c.href} name={c.name} imageUrl={c.imageUrl} tall
                subtitle={`#${c.rank} · ${c.countryName} · ${plural(c.experienceCount, "experience")}`} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">Featured experiences</h2>
            <Link href={routes.experiences()} className="text-sm font-semibold text-clay">See all →</Link>
          </div>
          <ExperienceGrid items={featured} />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="rounded-3xl bg-ink px-6 py-12 text-white sm:px-12">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title}>
                <span className="text-3xl">{s.icon}</span>
                <p className="mt-3 text-lg font-semibold"><span className="text-orange-300">{i + 1}.</span> {s.title}</p>
                <p className="mt-1 text-white/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {hosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">Meet the locals</h2>
            <Link href={routes.hosts()} className="text-sm font-semibold text-clay">All hosts →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hosts.map((h) => <HostCard key={h.id} host={h} />)}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-20">
          <h2 className="mb-6 font-display text-3xl font-semibold">What travellers say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.id} className="card flex flex-col p-6">
                <Stars value={r.rating} />
                <blockquote className="mt-3 flex-1 text-stone-700">“{r.comment}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{r.authorName}</span>
                  {r.authorCountry && <span className="text-stone-500"> · {r.authorCountry}</span>}
                  <Link href={routes.experience(r.experience.slug)} className="block text-xs text-clay hover:underline">
                    {r.experience.title} · {r.experience.city.name}
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-6 font-display text-3xl font-semibold">Destinations</h2>
        {destinations.length === 0 ? (
          <p className="text-stone-500">No destinations yet. Add one from the admin panel.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((c) => (
              <DestinationCard key={c.id} href={routes.country(c.slug)} name={c.name} imageUrl={c.imageUrl}
                subtitle={plural(c.cities.length, "city", "cities")} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
