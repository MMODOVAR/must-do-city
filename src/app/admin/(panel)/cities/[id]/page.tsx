import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteCity, saveCity } from "@/app/admin/actions";
import { CityForm } from "@/components/admin/CityForm";
import { PageHeader, StatusPill } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/ui";

export default async function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [city, countries] = await Promise.all([
    prisma.city.findUnique({
      where: { id },
      include: { country: true, journeys: { orderBy: { title: "asc" }, include: { _count: { select: { steps: true } } } } },
    }),
    prisma.country.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!city) notFound();

  return (
    <>
      <PageHeader
        title={city.name}
        subtitle={`${city.country.name} · /${city.country.slug}/${city.slug}`}
        back={{ href: "/admin/cities", label: "Cities" }}
      />
      <CityForm action={saveCity.bind(null, city.id)} city={city} countries={countries} />

      <div className="mb-3 mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Journeys in {city.name}</h2>
        <Link href={`/admin/journeys/new?city=${city.id}`} className="btn-ghost">+ Add journey</Link>
      </div>
      <div className="card divide-y divide-stone-100">
        {city.journeys.length === 0 && <p className="p-5 text-sm text-stone-500">No journeys yet.</p>}
        {city.journeys.map((j) => (
          <Link key={j.id} href={`/admin/journeys/${j.id}`} className="flex items-center justify-between p-4 text-sm hover:bg-stone-50">
            <span className="font-medium">{j.title}</span>
            <span className="flex items-center gap-3 text-stone-500">
              {j._count.steps} steps <StatusPill published={j.published} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 border-t border-stone-200 pt-6">
        <DeleteButton
          action={deleteCity.bind(null, city.id)}
          label="Delete city"
          warning={`Delete ${city.name}? This also deletes all its journeys.`}
        />
      </div>
    </>
  );
}
