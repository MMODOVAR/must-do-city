/** Bookings domain: the lifecycle of a booking request and its invariants. */
import { DomainError } from "@/modules/shared/forms";

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED", "COMPLETED"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

/** Allowed status changes. DECLINED, CANCELLED and COMPLETED are final. */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "DECLINED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  DECLINED: [],
  CANCELLED: [],
  COMPLETED: [],
};

export const isBookingStatus = (s: string): s is BookingStatus => (BOOKING_STATUSES as readonly string[]).includes(s);

export function nextStatuses(from: string): BookingStatus[] {
  return isBookingStatus(from) ? TRANSITIONS[from] : [];
}

export function assertTransition(from: string, to: BookingStatus) {
  if (!nextStatuses(from).includes(to)) {
    throw new DomainError(`A ${from.toLowerCase()} booking cannot be marked ${to.toLowerCase()}.`);
  }
}

/** Only guests who actually took part may leave a review. */
export const canBeReviewed = (status: string) => status === "COMPLETED";

const DAY = 24 * 60 * 60 * 1000;

/** Booking requests must be for a date from tomorrow up to one year ahead, within group limits. */
export function assertBookable(input: { date: Date; guests: number }, rules: { maxGroupSize: number | null }, now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const day = input.date.getTime();
  if (day < today + DAY) throw new DomainError("Please choose a date from tomorrow onwards.");
  if (day > today + 366 * DAY) throw new DomainError("Bookings open up to one year ahead.");
  if (rules.maxGroupSize && input.guests > rules.maxGroupSize) {
    throw new DomainError(`This experience takes at most ${rules.maxGroupSize} guests.`);
  }
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I

/** Human-friendly booking reference, e.g. "MDC-7K2QX9". */
export function generateReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `MDC-${[...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}
