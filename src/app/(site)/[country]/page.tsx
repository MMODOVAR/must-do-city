import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Cover } from "@/components/Cover";

type Params = { params: Promise<{ country: string }> };

async function load(slug: string) {
  return prisma.country.findFirst({
    where: { slug, published: true },
    include: {
      cities: {
        where: { published: true },
        orderBy: { name: "asc" },
        include: { _count: { select: { journeys: { where: { published: true } } } } },
      },
    },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const country = await load((await params).country);
  return { title: country?.name ?? "Not found", description: country?.description ?? undefined };
}

export default async function CountryPage({ params }: Params) {
  const country = await load((await params).country);
  if (!country) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-4 text-sm text-stone-500">
        <Link href="/" className="hover:text-ink">Home</Link> / {country.name}
      </nav>
      <h1 className="font-display text-5xl font-bold">{country.name}</h1>
      {country.description && <p className="mt-4 max-w-2xl text-lg text-stone-600">{country.description}</p>}

      <h2 className="mb-6 mt-12 font-display text-2xl font-semibold">Cities</h2>
      {country.cities.length === 0 ? (
        <p className="text-stone-500">No cities yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {country.cities.map((city) => (
            <Link
              key={city.id}
              href={`/${country.slug}/${city.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Cover src={city.imageUrl} alt={city.name} className="h-44 w-full" />
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold group-hover:text-clay">{city.name}</h3>
                {city.description && <p className="mt-1 line-clamp-2 text-sm text-stone-600">{city.description}</p>}
                <p className="mt-3 text-sm font-medium text-sea">
                  {city._count.journeys} {city._count.journeys === 1 ? "journey" : "journeys"} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
