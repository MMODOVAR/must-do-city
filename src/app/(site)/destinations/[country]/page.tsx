import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { geographyService } from "@/modules/geography/service";
import { DestinationCard } from "@/modules/geography/ui/DestinationCard";
import { experiencesService } from "@/modules/experiences/service";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { Breadcrumbs } from "@/modules/shared/ui/Breadcrumbs";
import { routes } from "@/modules/shared/routes";
import { plural } from "@/modules/shared/text";
import Link from "next/link";

type Params = { params: Promise<{ country: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const country = await geographyService.findCountry((await params).country);
  return { title: country?.name ?? "Not found", description: country?.description ?? undefined };
}

export default async function CountryPage({ params }: Params) {
  const { country: slug } = await params;
  const country = await geographyService.findCountry(slug);
  if (!country) notFound();
  const { items: experiences } = await experiencesService.search({ country: slug, sort: "recommended", page: 1 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: routes.destinations(), label: "Destinations" }, { label: country.name }]} />
      <h1 className="font-display text-5xl font-bold">{country.name}</h1>
      {country.description && <p className="mt-4 max-w-2xl text-lg text-stone-600">{country.description}</p>}

      <h2 className="mb-6 mt-12 font-display text-2xl font-semibold">Cities</h2>
      {country.cities.length === 0 ? (
        <p className="text-stone-500">No cities yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {country.cities.map((city) => (
            <DestinationCard key={city.id} href={routes.city(country.slug, city.slug)} name={city.name} imageUrl={city.imageUrl}
              subtitle={`${plural(city._count.experiences, "experience")}${city.tagline ? ` · ${city.tagline}` : ""}`} />
          ))}
        </div>
      )}

      <div className="mb-6 mt-14 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold">Top experiences in {country.name}</h2>
        <Link href={routes.experiences({ country: country.slug })} className="text-sm font-semibold text-clay">See all →</Link>
      </div>
      <ExperienceGrid items={experiences.slice(0, 6)} />
    </div>
  );
}
