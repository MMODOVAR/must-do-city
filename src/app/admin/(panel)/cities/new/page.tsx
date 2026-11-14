import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { saveCity } from "@/modules/geography/actions";
import { geographyService } from "@/modules/geography/service";
import { CityForm } from "@/modules/geography/ui/CityForm";

export default async function NewCityPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const { country } = await searchParams;
  const countries = await geographyService.countryOptions();
  return (
    <>
      <PageHeader title="New city" back={{ href: "/admin/cities", label: "Cities" }} />
      {countries.length === 0 ? (
        <p className="card p-6 text-sm">Create a country first. <Link href="/admin/countries/new" className="font-medium text-clay">New country →</Link></p>
      ) : (
        <CityForm action={saveCity.bind(null, null)} countries={countries} defaultCountryId={country} />
      )}
    </>
  );
}
