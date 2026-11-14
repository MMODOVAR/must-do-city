import Link from "next/link";
import { SORTS, type ExperienceFilters as Filters } from "../domain";

type Opt = { value: string; label: string };

/** Plain GET form: works without JavaScript and keeps filters in the URL. */
export function ExperienceFilters({
  filters,
  countries,
  cities,
  categories,
  languages,
}: {
  filters: Filters;
  countries: Opt[];
  cities: Opt[];
  categories: Opt[];
  languages: string[];
}) {
  return (
    <form className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-7" role="search">
      <input name="q" defaultValue={filters.q} placeholder="Search experiences…" className="input lg:col-span-2" aria-label="Search" />
      <select name="country" defaultValue={filters.country ?? ""} className="input" aria-label="Country">
        <option value="">All countries</option>
        {countries.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select name="city" defaultValue={filters.city ?? ""} className="input" aria-label="City">
        <option value="">All cities</option>
        {cities.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select name="category" defaultValue={filters.category ?? ""} className="input" aria-label="Category">
        <option value="">All categories</option>
        {categories.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select name="language" defaultValue={filters.language ?? ""} className="input" aria-label="Language">
        <option value="">Any language</option>
        {languages.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
      <select name="sort" defaultValue={filters.sort} className="input" aria-label="Sort by">
        {Object.entries(SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-7">
        <input name="maxPrice" type="number" min="0" defaultValue={filters.maxPrice ?? ""} placeholder="Max price" className="input max-w-40" aria-label="Maximum price" />
        <button className="btn-primary">Search</button>
        <Link href="/experiences" className="btn-ghost">Reset</Link>
      </div>
    </form>
  );
}
