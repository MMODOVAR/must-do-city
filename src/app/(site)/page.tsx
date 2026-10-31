import Link from "next/link";
import { prisma } from "@/lib/db";
import { Cover } from "@/components/Cover";
import { JourneyCard } from "@/components/JourneyCard";

export default async function HomePage() {
  const [countries, featured] = await Promise.all([
    prisma.country.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      include: { _count: { select: { cities: { where: { published: true } } } } },
    }),
    prisma.journey.findMany({
      where: { featured: true, published: true, city: { published: true, country: { published: true } } },
      include: { city: { include: { country: true } } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:pt-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-clay">Experiences worth the trip</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">
          The things you <em className="text-clay">must do</em> in every city.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-stone-600">
          Hand-picked journeys — food walks, sunsets, hidden corners — step by step.
        </p>
      </section>

      {featured.length > 0 && (
        <section id="featured" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
          <h2 className="mb-6 font-display text-3xl font-semibold">Featured journeys</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((j) => (
              <JourneyCard
                key={j.id}
                {...j}
                href={`/${j.city.country.slug}/${j.city.slug}/${j.slug}`}
                place={`${j.city.name}, ${j.city.country.name}`}
              />
            ))}
          </div>
        </section>
      )}

      <section id="destinations" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24">
        <h2 className="mb-6 font-display text-3xl font-semibold">Destinations</h2>
        {countries.length === 0 ? (
          <p className="text-stone-500">No destinations yet. Add one from the admin panel.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((c) => (
              <Link key={c.id} href={`/${c.slug}`} className="group relative overflow-hidden rounded-2xl shadow-sm">
                <Cover src={c.imageUrl} alt={c.name} showLabel={false} className="h-56 w-full transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-5 text-white">
                  <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                  <p className="text-sm text-white/80">
                    {c._count.cities} {c._count.cities === 1 ? "city" : "cities"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
