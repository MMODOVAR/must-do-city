import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { bookingsService } from "@/modules/bookings/service";
import { StatusBadge } from "@/modules/bookings/ui/StatusBadge";
import { experiencesService } from "@/modules/experiences/service";
import { geographyService } from "@/modules/geography/service";
import { hostsService } from "@/modules/hosts/service";
import { reviewsService } from "@/modules/reviews/service";
import { formatDate, formatPrice } from "@/modules/shared/money";

export default async function Dashboard() {
  const [geo, exp, hosts, reviews, byStatus, recentBookings, recent] = await Promise.all([
    geographyService.counts(),
    experiencesService.counts(),
    hostsService.count(),
    reviewsService.count(),
    bookingsService.countsByStatus(),
    bookingsService.recent(5),
    experiencesService.recent(5),
  ]);

  const stats = [
    { label: "Pending bookings", value: byStatus.PENDING ?? 0, href: "/admin/bookings?status=PENDING", accent: true },
    { label: "Experiences", value: exp.experiences, href: "/admin/experiences" },
    { label: "Hosts", value: hosts, href: "/admin/hosts" },
    { label: "Reviews", value: reviews, href: "/admin/reviews" },
    { label: "Countries", value: geo.countries, href: "/admin/countries" },
    { label: "Cities", value: geo.cities, href: "/admin/cities" },
    { label: "Map hotspots", value: geo.hotspots, href: "/admin/cities" },
    { label: "Confirmed bookings", value: byStatus.CONFIRMED ?? 0, href: "/admin/bookings?status=CONFIRMED" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Destinations, local hosts, experiences and bookings" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`card p-5 hover:border-clay ${s.accent && s.value ? "border-amber-300 bg-amber-50" : ""}`}>
            <p className="text-sm text-stone-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/experiences/new" className="btn-primary">+ New experience</Link>
        <Link href="/admin/hosts/new" className="btn-ghost">+ New host</Link>
        <Link href="/admin/cities/new" className="btn-ghost">+ New city</Link>
        <Link href="/admin/countries/new" className="btn-ghost">+ New country</Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Latest booking requests</h2>
          <div className="card divide-y divide-stone-100">
            {recentBookings.length === 0 && <p className="p-5 text-sm text-stone-500">No bookings yet.</p>}
            {recentBookings.map((b) => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-3 p-4 text-sm hover:bg-stone-50">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{b.guestName} · {b.experience.title}</span>
                  <span className="text-xs text-stone-500">{formatDate(b.date)} · {b.guests} guests · {formatPrice(b.totalPrice, b.currency)}</span>
                </span>
                <StatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">Recently updated experiences</h2>
          <div className="card divide-y divide-stone-100">
            {recent.length === 0 && <p className="p-5 text-sm text-stone-500">Nothing yet.</p>}
            {recent.map((e) => (
              <Link key={e.id} href={`/admin/experiences/${e.id}`} className="flex justify-between p-4 text-sm hover:bg-stone-50">
                <span className="font-medium">{e.title}</span>
                <span className="text-stone-500">{e.city.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
