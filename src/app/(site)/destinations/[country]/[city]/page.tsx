import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { geographyService } from "@/modules/geography/service";
import { experiencesService } from "@/modules/experiences/service";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { categoriesService } from "@/modules/categories/service";
import { CategoryChips } from "@/modules/categories/ui/CategoryChips";
import { hostsService } from "@/modules/hosts/service";
import { HostCard } from "@/modules/hosts/ui/HostCard";
import { Cover } from "@/modules/shared/ui/Cover";
import { Breadcrumbs } from "@/modules/shared/ui/Breadcrumbs";
import { routes } from "@/modules/shared/routes";

type Params = { params: Promise<{ country: string; city: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await params;
  const city = await geographyService.findCity(p.country, p.city);
  return { title: city ? `${city.name}, ${city.country.name}` : "Not found", description: city?.tagline ?? city?.description ?? undefined };
}

export default async function CityPage({ params }: Params) {
  const p = await params;
  const city = await geographyService.findCity(p.country, p.city);
  if (!city) notFound();

  const [experiences, hosts, allCategories] = await Promise.all([
    experiencesService.inCity(city.slug, city.country.slug),
    hostsService.listPublished({ cityId: city.id }),
    categoriesService.listActive(),
  ]);
  const used = new Set(experiences.map((e) => e.categoryId));
  const categories = allCategories.filter((c) => used.has(c.id));
  const filter = { country: city.country.slug, city: city.slug };

  return (
    <>
      <div className="relative">
        <Cover src={city.imageUrl} alt={city.name} showLabel={false} className="h-64 w-full sm:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 text-white">
          <Breadcrumbs light items={[{ href: "/", label: "Home" }, { href: routes.country(city.country.slug), label: city.country.name }, { label: city.name }]} />
          <h1 className="font-display text-5xl font-bold">{city.name}</h1>
          {city.tagline && <p className="mt-2 text-lg text-white/85">{city.tagline}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {city.description && <p className="max-w-2xl text-lg text-stone-600">{city.description}</p>}

        <div className="mb-6 mt-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold">Things to do in {city.name}</h2>
          <Link href={routes.experiences(filter)} className="text-sm font-semibold text-clay">Search &amp; filter →</Link>
        </div>
        {categories.length > 0 && <div className="mb-6"><CategoryChips categories={categories} extra={filter} /></div>}
        <ExperienceGrid items={experiences} showPlace={false} empty={`No experiences in ${city.name} yet.`} />

        {hosts.length > 0 && (
          <>
            <h2 className="mb-6 mt-16 font-display text-3xl font-semibold">Your local hosts in {city.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hosts.map((h) => <HostCard key={h.id} host={h} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
