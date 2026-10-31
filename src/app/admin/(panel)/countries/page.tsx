import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill } from "@/components/admin/PageHeader";

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cities: true } } },
  });

  return (
    <>
      <PageHeader title="Countries" subtitle={`${countries.length} total`} action={{ href: "/admin/countries/new", label: "+ New country" }} />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-stone-500">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Cities</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {countries.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="p-4 font-medium">
                  <Link href={`/admin/countries/${c.id}`} className="hover:text-clay">{c.name}</Link>
                  <div className="text-xs text-stone-400">/{c.slug}</div>
                </td>
                <td className="p-4">{c.isoCode}</td>
                <td className="p-4">{c._count.cities}</td>
                <td className="p-4"><StatusPill published={c.published} /></td>
                <td className="p-4 text-right">
                  <Link href={`/admin/cities/new?country=${c.id}`} className="mr-4 text-stone-500 hover:text-ink">+ City</Link>
                  <Link href={`/admin/countries/${c.id}`} className="font-medium text-clay">Edit</Link>
                </td>
              </tr>
            ))}
            {countries.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-stone-500">No countries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
