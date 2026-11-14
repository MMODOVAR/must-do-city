import type { Metadata } from "next";
import Link from "next/link";
import { geographyService } from "@/modules/geography/service";
import { DestinationCard } from "@/modules/geography/ui/DestinationCard";
import { routes } from "@/modules/shared/routes";
import { plural } from "@/modules/shared/text";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const countries = await geographyService.listDestinations();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Destinations</h1>
      <p className="mt-3 text-lg text-stone-600">Every country and city where our locals host.</p>
      <div className="mt-10 space-y-14">
        {countries.map((country) => (
          <section key={country.id}>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-3xl font-semibold">{country.name}</h2>
              <Link href={routes.country(country.slug)} className="text-sm font-semibold text-clay">About {country.name} →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {country.cities.map((city) => (
                <DestinationCard key={city.id} href={routes.city(country.slug, city.slug)} name={city.name} imageUrl={city.imageUrl}
                  subtitle={city.tagline ?? plural(city._count.experiences, "experience")} />
              ))}
            </div>
          </section>
        ))}
        {countries.length === 0 && <p className="text-stone-500">No destinations yet.</p>}
      </div>
    </div>
  );
}
