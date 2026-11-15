import { STATUS_LABELS, isBookingStatus } from "../domain";

const COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  DECLINED: "bg-stone-100 text-stone-600",
  CANCELLED: "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[status] ?? "bg-stone-100"}`}>
      {isBookingStatus(status) ? STATUS_LABELS[status] : status}
    </span>
  );
}
