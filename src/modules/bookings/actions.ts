"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/modules/identity/auth";
import { type FormState, formObject, toFormError } from "@/modules/shared/forms";
import { formatDate } from "@/modules/shared/money";
import { bookingRequestInput, statusChangeInput } from "./schemas";
import { bookingsService } from "./service";

/** Public: a guest sends a booking request from an experience page. */
export async function requestBooking(_: FormState, fd: FormData): Promise<FormState> {
  try {
    const booking = await bookingsService.request(bookingRequestInput.parse(formObject(fd)));
    revalidatePath("/admin", "layout");
    return {
      success: `Request sent for ${formatDate(booking.date)}. Your reference is ${booking.reference} — keep it to leave a review after your experience. We'll email ${booking.guestEmail} once your host confirms.`,
      data: { reference: booking.reference },
    };
  } catch (e) {
    return toFormError(e);
  }
}

/** Admin: confirm / decline / cancel / complete a booking. */
export async function changeBookingStatus(id: string, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const { status, adminNote } = statusChangeInput.parse(formObject(fd));
    await bookingsService.changeStatus(id, status, adminNote);
  } catch (e) {
    return toFormError(e);
  }
  revalidatePath("/admin", "layout");
  return { success: "Booking updated." };
}
