import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { formatDate, formatPrice } from "@/modules/shared/money";
import { changeBookingStatus } from "@/modules/bookings/actions";
import { nextStatuses } from "@/modules/bookings/domain";
import { bookingsService } from "@/modules/bookings/service";
import { StatusActions } from "@/modules/bookings/ui/StatusActions";
import { StatusBadge } from "@/modules/bookings/ui/StatusBadge";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const b = await bookingsService.get((await params).id);
  if (!b) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Experience", <Link key="e" href={`/admin/experiences/${b.experience.id}`} className="text-clay hover:underline">{b.experience.title}</Link>],
    ["City", b.experience.city.name],
    ["Host", b.experience.host?.name ?? "—"],
    ["Date", formatDate(b.date, { dateStyle: "full" })],
    ["Guests", b.guests],
    ["Total", formatPrice(b.totalPrice, b.currency) ?? "—"],
    ["Guest", b.guestName],
    ["Email", <a key="m" href={`mailto:${b.guestEmail}`} className="text-clay hover:underline">{b.guestEmail}</a>],
    ["Phone", b.guestPhone ?? "—"],
    ["Requested", formatDate(b.createdAt, { dateStyle: "medium", timeStyle: "short" })],
    ["Review", b.review ? `★ ${b.review.rating} — "${b.review.comment.slice(0, 80)}"` : "—"],
  ];

  return (
    <>
      <PageHeader title={`Booking ${b.reference}`} back={{ href: "/admin/bookings", label: "Bookings" }} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-sm">
            {rows.map(([k, v]) => (<Fragment key={k}><dt className="text-stone-500">{k}</dt><dd className="font-medium">{v}</dd></Fragment>))}
          </dl>
          {b.message && <div className="mt-6 rounded-lg bg-stone-50 p-4 text-sm"><p className="mb-1 text-stone-500">Message from the guest</p>{b.message}</div>}
        </div>
        <div className="card h-fit space-y-4 p-6">
          <p className="flex items-center justify-between text-sm">Status <StatusBadge status={b.status} /></p>
          <StatusActions action={changeBookingStatus.bind(null, b.id)} next={nextStatuses(b.status)} adminNote={b.adminNote} />
          <p className="text-xs text-stone-500">Mark the booking <strong>completed</strong> after the experience so the guest can leave a verified review.</p>
        </div>
      </div>
    </>
  );
}
