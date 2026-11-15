import Link from "next/link";
import { PageHeader, StatusPill } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { geographyService } from "@/modules/geography/service";

export default async function CitiesPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const { country } = await searchParams;
  const [cities, countries] = await Promise.all([geographyService.adminCities(country), geographyService.countryOptions()]);
  const pill = (on: boolean) => `rounded-full px-3 py-1 ${on ? "bg-ink text-white" : "bg-white"}`;

  return (
    <>
      <PageHeader title="Cities" subtitle={`${cities.length} shown`} action={{ href: "/admin/cities/new", label: "+ New city" }} />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/cities" className={pill(!country)}>All</Link>
        {countries.map((c) => <Link key={c.id} href={`/admin/cities?country=${c.id}`} className={pill(country === c.id)}>{c.name}</Link>)}
      </div>
      <DataTable head={["City", "Country", "Experiences", "Hosts", "Map", "Status", ""]} empty="No cities yet." isEmpty={cities.length === 0}>
        {cities.map((c) => (
          <tr key={c.id} className="hover:bg-stone-50">
            <td className="p-4 font-medium">
              <Link href={`/admin/cities/${c.id}`} className="hover:text-clay">{c.name}</Link>
              <div className="text-xs text-stone-400">/{c.country.slug}/{c.slug}</div>
            </td>
            <td className="p-4">{c.country.name}</td>
            <td className="p-4">{c._count.experiences}</td>
            <td className="p-4">{c._count.hosts}</td>
            <td className="p-4 whitespace-nowrap">{c.latitude !== null ? "📍" : <span className="text-amber-600" title="Add coordinates to show it on the map">missing</span>} {c.isHotspot && "🔥"}</td>
            <td className="p-4"><StatusPill published={c.published} /></td>
            <td className="p-4 text-right whitespace-nowrap">
              <Link href={`/admin/experiences/new?city=${c.id}`} className="mr-4 text-stone-500 hover:text-ink">+ Experience</Link>
              <Link href={`/admin/cities/${c.id}`} className="font-medium text-clay">Edit</Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
