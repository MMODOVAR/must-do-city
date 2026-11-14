import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { formatDate, formatPrice } from "@/modules/shared/money";
import { BOOKING_STATUSES, STATUS_LABELS, isBookingStatus } from "@/modules/bookings/domain";
import { bookingsService } from "@/modules/bookings/service";
import { StatusBadge } from "@/modules/bookings/ui/StatusBadge";

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const active = status && isBookingStatus(status) ? status : undefined;
  const [bookings, counts] = await Promise.all([bookingsService.list(active), bookingsService.countsByStatus()]);
  const pill = (on: boolean) => `rounded-full px-3 py-1 ${on ? "bg-ink text-white" : "bg-white"}`;

  return (
    <>
      <PageHeader title="Bookings" subtitle="Requests sent from experience pages" />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/bookings" className={pill(!active)}>All</Link>
        {BOOKING_STATUSES.map((s) => (
          <Link key={s} href={`/admin/bookings?status=${s}`} className={pill(active === s)}>{STATUS_LABELS[s]} ({counts[s] ?? 0})</Link>
        ))}
      </div>
      <DataTable head={["Reference", "Guest", "Experience", "Date", "Guests", "Total", "Status"]} empty="No bookings." isEmpty={bookings.length === 0}>
        {bookings.map((b) => (
          <tr key={b.id} className="hover:bg-stone-50">
            <td className="p-4 font-mono text-xs"><Link href={`/admin/bookings/${b.id}`} className="font-semibold text-clay">{b.reference}</Link></td>
            <td className="p-4">{b.guestName}<div className="text-xs text-stone-500">{b.guestEmail}</div></td>
            <td className="p-4">{b.experience.title}<div className="text-xs text-stone-500">{b.experience.city.name}</div></td>
            <td className="p-4 whitespace-nowrap">{formatDate(b.date)}</td>
            <td className="p-4">{b.guests}</td>
            <td className="p-4">{formatPrice(b.totalPrice, b.currency) ?? "—"}</td>
            <td className="p-4"><StatusBadge status={b.status} /></td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
