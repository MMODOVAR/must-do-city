import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteCountry, saveCountry } from "@/app/admin/actions";
import { CountryForm } from "@/components/admin/CountryForm";
import { PageHeader, StatusPill } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/ui";

export default async function EditCountryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const country = await prisma.country.findUnique({
    where: { id },
    include: { cities: { orderBy: { name: "asc" }, include: { _count: { select: { journeys: true } } } } },
  });
  if (!country) notFound();

  return (
    <>
      <PageHeader title={country.name} subtitle={`/${country.slug}`} back={{ href: "/admin/countries", label: "Countries" }} />
      <CountryForm action={saveCountry.bind(null, country.id)} country={country} />

      <div className="mb-3 mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cities in {country.name}</h2>
        <Link href={`/admin/cities/new?country=${country.id}`} className="btn-ghost">+ Add city</Link>
      </div>
      <div className="card divide-y divide-stone-100">
        {country.cities.length === 0 && <p className="p-5 text-sm text-stone-500">No cities yet.</p>}
        {country.cities.map((c) => (
          <Link key={c.id} href={`/admin/cities/${c.id}`} className="flex items-center justify-between p-4 text-sm hover:bg-stone-50">
            <span className="font-medium">{c.name}</span>
            <span className="flex items-center gap-3 text-stone-500">
              {c._count.journeys} journeys <StatusPill published={c.published} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 border-t border-stone-200 pt-6">
        <DeleteButton
          action={deleteCountry.bind(null, country.id)}
          label="Delete country"
          warning={`Delete ${country.name}? This also deletes all its cities and journeys.`}
        />
      </div>
    </>
  );
}
