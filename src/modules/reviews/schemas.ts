import { z } from "zod";
import { zBool, zInt, zRequired, zText } from "@/modules/shared/forms";
import { MAX_RATING, MIN_RATING } from "./domain";

const rating = zInt("Rating", { min: MIN_RATING, max: MAX_RATING })
  .refine((n) => n !== null, "Please choose a rating.")
  .transform((n) => n!);

const content = {
  experienceId: zRequired("Experience"),
  rating,
  title: zText(120),
  comment: zRequired("Your review", 3000).refine((c) => c.length >= 10, "Please write at least a sentence (10+ characters)."),
  authorCountry: zText(80),
};

/** Public: a guest reviews their completed booking. */
export const guestReviewInput = z.object({
  ...content,
  reference: zRequired("Booking reference", 20),
  email: zRequired("Email", 200),
  authorName: zText(120),
});
export type GuestReviewInput = z.infer<typeof guestReviewInput>;

/** Admin: add a review collected elsewhere (e.g. imported). */
export const adminReviewInput = z.object({
  ...content,
  authorName: zRequired("Author name", 120),
  published: zBool(),
});
export type AdminReviewInput = z.infer<typeof adminReviewInput>;
