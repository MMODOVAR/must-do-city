import Link from "next/link";
import { prisma } from "@/lib/db";
import { saveCity } from "@/app/admin/actions";
import { CityForm } from "@/components/admin/CityForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function NewCityPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const { country } = await searchParams;
  const countries = await prisma.country.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <>
      <PageHeader title="New city" back={{ href: "/admin/cities", label: "Cities" }} />
      {countries.length === 0 ? (
        <p className="card p-6 text-sm">
          Create a country first. <Link href="/admin/countries/new" className="font-medium text-clay">New country →</Link>
        </p>
      ) : (
        <CityForm action={saveCity.bind(null, null)} countries={countries} defaultCountryId={country} />
      )}
    </>
  );
}
