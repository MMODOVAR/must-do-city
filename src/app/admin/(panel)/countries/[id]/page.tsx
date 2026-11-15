import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, StatusPill } from "@/modules/shared/admin/PageHeader";
import { ConfirmButton } from "@/modules/shared/admin/ui";
import { deleteCountry, saveCountry } from "@/modules/geography/actions";
import { geographyService } from "@/modules/geography/service";
import { CountryForm } from "@/modules/geography/ui/CountryForm";

export default async function EditCountryPage({ params }: { params: Promise<{ id: string }> }) {
  const country = await geographyService.adminCountry((await params).id);
  if (!country) notFound();

  return (
    <>
      <PageHeader title={country.name} subtitle={`/destinations/${country.slug}`} back={{ href: "/admin/countries", label: "Countries" }} />
      <CountryForm action={saveCountry.bind(null, country.id)} country={country} />

      <div className="mb-3 mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cities in {country.name}</h2>
        <Link href={`/admin/cities/new?country=${country.id}`} className="btn-ghost">+ Add city</Link>
      </div>
      <div className="card divide-y divide-stone-100">
        {country.cities.length === 0 && <p className="p-5 text-sm text-stone-500">No cities yet.</p>}
        {country.cities.map((c) => (
          <Link key={c.id} href={`/admin/cities/${c.id}`} className="flex items-center justify-between p-4 text-sm hover:bg-stone-50">
            <span className="font-medium">{c.name} {c.isHotspot && <span className="text-xs text-clay">🔥 hotspot</span>}</span>
            <StatusPill published={c.published} />
          </Link>
        ))}
      </div>

      <div className="mt-10 border-t border-stone-200 pt-6">
        <ConfirmButton action={deleteCountry.bind(null, country.id)} label="Delete country"
          warning={`Delete ${country.name}? This also deletes all its cities, hosts and experiences.`} />
      </div>
    </>
  );
}
