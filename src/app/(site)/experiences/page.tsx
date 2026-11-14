import type { Metadata } from "next";
import Link from "next/link";
import { parseFilters } from "@/modules/experiences/domain";
import { experiencesService } from "@/modules/experiences/service";
import { ExperienceFilters } from "@/modules/experiences/ui/ExperienceFilters";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { categoriesService } from "@/modules/categories/service";
import { CategoryChips } from "@/modules/categories/ui/CategoryChips";
import { geographyService } from "@/modules/geography/service";
import { routes } from "@/modules/shared/routes";
import { plural } from "@/modules/shared/text";

export const metadata: Metadata = { title: "Experiences", description: "Private tours and activities hosted by locals." };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ExperiencesPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams);
  const [result, countries, categories, languages] = await Promise.all([
    experiencesService.search(filters),
    geographyService.listDestinations(),
    categoriesService.listActive(),
    experiencesService.languages(),
  ]);
  const cities = countries
    .filter((c) => !filters.country || c.slug === filters.country)
    .flatMap((c) => c.cities.map((city) => ({ value: city.slug, label: filters.country ? city.name : `${city.name}, ${c.name}` })));

  const { page, ...rest } = filters;
  const pageHref = (p: number) => routes.experiences({ ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v === undefined ? undefined : String(v)])), page: String(p) });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Experiences</h1>
      <p className="mt-3 text-lg text-stone-600">Private tours and activities, hosted by locals.</p>

      <div className="mt-8 space-y-4">
        <CategoryChips categories={categories} active={filters.category} extra={{ country: filters.country, city: filters.city }} />
        <ExperienceFilters
          filters={filters}
          countries={countries.map((c) => ({ value: c.slug, label: c.name }))}
          cities={cities}
          categories={categories.map((c) => ({ value: c.slug, label: c.name }))}
          languages={languages}
        />
      </div>

      <p className="mb-4 mt-8 text-sm text-stone-500">{plural(result.total, "experience")} found</p>
      <ExperienceGrid items={result.items} empty="No experiences match your search. Try removing a filter." />

      {result.pages > 1 && (
        <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={pageHref(p)} aria-current={p === page ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm ${p === page ? "bg-ink text-white" : "border border-stone-300 bg-white"}`}>
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
