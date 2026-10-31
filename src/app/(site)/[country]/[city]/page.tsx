import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Cover } from "@/components/Cover";
import { JourneyCard } from "@/components/JourneyCard";

type Params = { params: Promise<{ country: string; city: string }> };

async function load(countrySlug: string, citySlug: string) {
  return prisma.city.findFirst({
    where: { slug: citySlug, published: true, country: { slug: countrySlug, published: true } },
    include: {
      country: true,
      journeys: { where: { published: true }, orderBy: [{ featured: "desc" }, { title: "asc" }] },
    },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await params;
  const city = await load(p.country, p.city);
  return { title: city ? `${city.name}, ${city.country.name}` : "Not found", description: city?.description ?? undefined };
}

export default async function CityPage({ params }: Params) {
  const p = await params;
  const city = await load(p.country, p.city);
  if (!city) notFound();

  const categories = [...new Set(city.journeys.map((j) => j.category).filter(Boolean))];

  return (
    <>
      <div className="relative">
        <Cover src={city.imageUrl} alt={city.name} showLabel={false} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 text-white">
          <nav className="mb-2 text-sm text-white/80">
            <Link href="/" className="hover:text-white">Home</Link> /{" "}
            <Link href={`/${city.country.slug}`} className="hover:text-white">{city.country.name}</Link> / {city.name}
          </nav>
          <h1 className="font-display text-5xl font-bold">{city.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {city.description && <p className="max-w-2xl text-lg text-stone-600">{city.description}</p>}
        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c} className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm">{c}</span>
            ))}
          </div>
        )}

        <h2 className="mb-6 mt-10 font-display text-2xl font-semibold">Must-do journeys</h2>
        {city.journeys.length === 0 ? (
          <p className="text-stone-500">No journeys yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {city.journeys.map((j) => (
              <JourneyCard key={j.id} {...j} href={`/${city.country.slug}/${city.slug}/${j.slug}`} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
