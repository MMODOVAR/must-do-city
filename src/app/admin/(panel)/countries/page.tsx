import Link from "next/link";
import { PageHeader, StatusPill } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { geographyService } from "@/modules/geography/service";

export default async function CountriesPage() {
  const countries = await geographyService.adminCountries();
  return (
    <>
      <PageHeader title="Countries" subtitle={`${countries.length} total`} action={{ href: "/admin/countries/new", label: "+ New country" }} />
      <DataTable head={["Name", "Code", "Cities", "On map", "Status", ""]} empty="No countries yet." isEmpty={countries.length === 0}>
        {countries.map((c) => (
          <tr key={c.id} className="hover:bg-stone-50">
            <td className="p-4 font-medium">
              <Link href={`/admin/countries/${c.id}`} className="hover:text-clay">{c.name}</Link>
              <div className="text-xs text-stone-400">/destinations/{c.slug}</div>
            </td>
            <td className="p-4">{c.isoCode}</td>
            <td className="p-4">{c._count.cities}</td>
            <td className="p-4">{c.latitude !== null ? "📍" : "—"}</td>
            <td className="p-4"><StatusPill published={c.published} /></td>
            <td className="p-4 text-right">
              <Link href={`/admin/cities/new?country=${c.id}`} className="mr-4 text-stone-500 hover:text-ink">+ City</Link>
              <Link href={`/admin/countries/${c.id}`} className="font-medium text-clay">Edit</Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
