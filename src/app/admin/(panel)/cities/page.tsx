import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill } from "@/components/admin/PageHeader";

export default async function CitiesPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const { country } = await searchParams;
  const [cities, countries] = await Promise.all([
    prisma.city.findMany({
      where: country ? { countryId: country } : undefined,
      orderBy: [{ country: { name: "asc" } }, { name: "asc" }],
      include: { country: true, _count: { select: { journeys: true } } },
    }),
    prisma.country.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <>
      <PageHeader title="Cities" subtitle={`${cities.length} shown`} action={{ href: "/admin/cities/new", label: "+ New city" }} />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/cities" className={`rounded-full px-3 py-1 ${!country ? "bg-ink text-white" : "bg-white"}`}>All</Link>
        {countries.map((c) => (
          <Link key={c.id} href={`/admin/cities?country=${c.id}`} className={`rounded-full px-3 py-1 ${country === c.id ? "bg-ink text-white" : "bg-white"}`}>
            {c.name}
          </Link>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-stone-500">
            <tr>
              <th className="p-4 font-medium">City</th>
              <th className="p-4 font-medium">Country</th>
              <th className="p-4 font-medium">Journeys</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {cities.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="p-4 font-medium">
                  <Link href={`/admin/cities/${c.id}`} className="hover:text-clay">{c.name}</Link>
                  <div className="text-xs text-stone-400">/{c.country.slug}/{c.slug}</div>
                </td>
                <td className="p-4">{c.country.name}</td>
                <td className="p-4">{c._count.journeys}</td>
                <td className="p-4"><StatusPill published={c.published} /></td>
                <td className="p-4 text-right">
                  <Link href={`/admin/journeys/new?city=${c.id}`} className="mr-4 text-stone-500 hover:text-ink">+ Journey</Link>
                  <Link href={`/admin/cities/${c.id}`} className="font-medium text-clay">Edit</Link>
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-stone-500">No cities yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
