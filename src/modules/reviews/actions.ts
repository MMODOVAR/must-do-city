"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/identity/auth";
import { type FormState, formObject, toFormError } from "@/modules/shared/forms";
import { revalidateSite } from "@/modules/shared/revalidate";
import { adminReviewInput, guestReviewInput } from "./schemas";
import { reviewsService } from "./service";

/** Public: verified guest review. */
export async function submitReview(_: FormState, fd: FormData): Promise<FormState> {
  try {
    await reviewsService.submitGuestReview(guestReviewInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  return { success: "Thank you! Your review is now live." };
}

export async function createReview(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await reviewsService.adminCreate(adminReviewInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  redirect("/admin/reviews");
}

export async function setReviewPublished(id: string, published: boolean) {
  await requireAdmin();
  await reviewsService.setPublished(id, published);
  revalidateSite();
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await reviewsService.delete(id);
  revalidateSite();
}
