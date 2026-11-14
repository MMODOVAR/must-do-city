import { DomainError } from "@/modules/shared/forms";
import { experiencesService } from "@/modules/experiences/service";
import { totalPrice } from "@/modules/experiences/domain";
import { assertBookable, assertTransition, canBeReviewed, generateReference, type BookingStatus } from "./domain";
import { bookingsRepository as repo } from "./repository";
import type { BookingRequestInput } from "./schemas";

export const bookingsService = {
  /** A guest asks to book an experience. Starts as PENDING until the team confirms it. */
  async request(input: BookingRequestInput) {
    const experience = await experiencesService.findBookable(input.experienceId);
    if (!experience) throw new DomainError("This experience is not available for booking.");
    assertBookable(input, experience);

    let reference = generateReference();
    while (await repo.referenceExists(reference)) reference = generateReference();

    const { website, ...guest } = input; // honeypot already validated empty
    void website;
    return repo.create({
      ...guest,
      reference,
      status: "PENDING",
      currency: experience.currency,
      totalPrice: totalPrice(experience.price, experience.pricingType, input.guests),
    });
  },

  /** Returns the booking if this guest may review it, otherwise explains why not. */
  async findReviewable(reference: string, email: string, experienceId: string) {
    const booking = await repo.byReference(reference.trim().toUpperCase());
    if (!booking || booking.guestEmail !== email.trim().toLowerCase() || booking.experienceId !== experienceId) {
      throw new DomainError("We couldn't find a booking for this experience with that reference and email.");
    }
    if (!canBeReviewed(booking.status)) throw new DomainError("You can leave a review once your experience is completed.");
    if (booking.review) throw new DomainError("You have already reviewed this booking. Thank you!");
    return booking;
  },

  /* ---- admin use cases ---- */
  list: repo.list,
  get: repo.byId,
  recent: repo.recent,
  countsByStatus: repo.countsByStatus,
  async changeStatus(id: string, to: BookingStatus, adminNote: string | null) {
    const booking = await repo.byId(id);
    if (!booking) throw new DomainError("Booking not found.");
    assertTransition(booking.status, to);
    return repo.updateStatus(id, to, adminNote);
  },
};
