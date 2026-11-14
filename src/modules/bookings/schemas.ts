import { z } from "zod";
import { zInt, zRequired, zText } from "@/modules/shared/forms";
import { BOOKING_STATUSES } from "./domain";

export const bookingRequestInput = z.object({
  experienceId: zRequired("Experience"),
  date: zRequired("Date", 10)
    .refine((d) => /^\d{4}-\d{2}-\d{2}$/.test(d), "Please choose a valid date.")
    .transform((d) => new Date(`${d}T00:00:00Z`)),
  guests: zInt("Guests", { min: 1, max: 100 }).refine((n) => n !== null, "Number of guests is required.").transform((n) => n!),
  guestName: zRequired("Your name", 120),
  guestEmail: zRequired("Email", 200).pipe(z.email("Please enter a valid email address.")).transform((e) => e.toLowerCase()),
  guestPhone: zText(40),
  message: zText(2000),
  // Honeypot: real people never fill this hidden field.
  website: zText(200).refine((v) => !v, "Spam detected."),
});
export type BookingRequestInput = z.infer<typeof bookingRequestInput>;

export const statusChangeInput = z.object({
  status: z.enum(BOOKING_STATUSES),
  adminNote: zText(2000),
});
