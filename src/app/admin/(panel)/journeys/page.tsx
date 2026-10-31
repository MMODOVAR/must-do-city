import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill } from "@/components/admin/PageHeader";
import { formatPrice } from "@/lib/utils";

export default async function JourneysPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const journeys = await prisma.journey.findMany({
    where: q ? { OR: [{ title: { contains: q } }, { city: { name: { contains: q } } }] } : undefined,
    orderBy: { updatedAt: "desc" },
    include: { city: { include: { country: true } }, _count: { select: { steps: true } } },
  });

  return (
    <>
      <PageHeader title="Journeys" subtitle={`${journeys.length} shown`} action={{ href: "/admin/journeys/new", label: "+ New journey" }} />
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search by title or city…" className="input max-w-sm" />
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-stone-500">
            <tr>
              <th className="p-4 font-medium">Journey</th>
              <th className="p-4 font-medium">City</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Steps</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {journeys.map((j) => (
              <tr key={j.id} className="hover:bg-stone-50">
                <td className="p-4 font-medium">
                  <Link href={`/admin/journeys/${j.id}`} className="hover:text-clay">{j.title}</Link>
                  {j.featured && <span className="ml-2 text-xs text-amber-600">★ featured</span>}
                </td>
                <td className="p-4">{j.city.name}, {j.city.country.name}</td>
                <td className="p-4">{j.category}</td>
                <td className="p-4">{j._count.steps}</td>
                <td className="p-4">{formatPrice(j.price, j.currency)}</td>
                <td className="p-4"><StatusPill published={j.published} /></td>
              </tr>
            ))}
            {journeys.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-stone-500">No journeys found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
