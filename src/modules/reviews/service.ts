import { DomainError } from "@/modules/shared/forms";
import { bookingsService } from "@/modules/bookings/service";
import { experiencesService } from "@/modules/experiences/service";
import { aggregate, distribution, REVIEWS_PAGE, type ReviewQuery } from "./domain";
import { reviewsRepository as repo } from "./repository";
import type { AdminReviewInput, GuestReviewInput } from "./schemas";

/** Keep the experience's denormalised rating in sync with its published reviews. */
async function refreshRating(experienceId: string) {
  const { average, count } = aggregate(await repo.publishedRatings(experienceId));
  await experiencesService.setRating(experienceId, average, count);
}

export const reviewsService = {
  /** Overall rating summary plus one page of reviews, filtered and sorted. */
  async forExperience(experienceId: string, query: ReviewQuery = { sort: "recent", take: REVIEWS_PAGE }) {
    const orderBy = {
      recent: [{ createdAt: "desc" as const }],
      highest: [{ rating: "desc" as const }, { createdAt: "desc" as const }],
      lowest: [{ rating: "asc" as const }, { createdAt: "desc" as const }],
    }[query.sort];
    const [page, ratings] = await Promise.all([
      repo.publishedFor(experienceId, { rating: query.rating, orderBy, take: query.take }),
      repo.publishedRatings(experienceId),
    ]);
    return { ...page, query, distribution: distribution(ratings), ...aggregate(ratings) };
  },
  latest: (take = 6) => repo.latestPublished(take),

  /** Verified review: the guest proves they took part with their booking reference + email. */
  async submitGuestReview(input: GuestReviewInput) {
    const booking = await bookingsService.findReviewable(input.reference, input.email, input.experienceId);
    await repo.create({
      experienceId: input.experienceId,
      bookingId: booking.id,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      authorName: input.authorName ?? booking.guestName,
      authorCountry: input.authorCountry,
      published: true,
    });
    await refreshRating(input.experienceId);
  },

  /* ---- admin use cases ---- */
  list: (filter: "all" | "published" | "hidden" = "all") =>
    repo.list(filter === "all" ? {} : { published: filter === "published" }),
  count: repo.count,
  async adminCreate(input: AdminReviewInput) {
    await repo.create(input);
    await refreshRating(input.experienceId);
  },
  async setPublished(id: string, published: boolean) {
    const review = await repo.setPublished(id, published);
    await refreshRating(review.experienceId);
  },
  async delete(id: string) {
    const review = await repo.byId(id);
    if (!review) throw new DomainError("Review not found.");
    await repo.delete(id);
    await refreshRating(review.experienceId);
  },
};
