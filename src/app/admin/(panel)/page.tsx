import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function Dashboard() {
  const [countries, cities, journeys, steps, recent] = await Promise.all([
    prisma.country.count(),
    prisma.city.count(),
    prisma.journey.count(),
    prisma.journeyStep.count(),
    prisma.journey.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { city: true } }),
  ]);

  const stats = [
    { label: "Countries", value: countries, href: "/admin/countries" },
    { label: "Cities", value: cities, href: "/admin/cities" },
    { label: "Journeys", value: journeys, href: "/admin/journeys" },
    { label: "Journey steps", value: steps, href: "/admin/journeys" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Manage destinations and experiences" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:border-clay">
            <p className="text-sm text-stone-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/countries/new" className="btn-ghost">+ New country</Link>
        <Link href="/admin/cities/new" className="btn-ghost">+ New city</Link>
        <Link href="/admin/journeys/new" className="btn-primary">+ New journey</Link>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Recently updated journeys</h2>
      <div className="card divide-y divide-stone-100">
        {recent.length === 0 && <p className="p-5 text-sm text-stone-500">Nothing yet.</p>}
        {recent.map((j) => (
          <Link key={j.id} href={`/admin/journeys/${j.id}`} className="flex justify-between p-4 text-sm hover:bg-stone-50">
            <span className="font-medium">{j.title}</span>
            <span className="text-stone-500">{j.city.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
