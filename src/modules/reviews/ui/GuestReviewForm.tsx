"use client";

import { useState } from "react";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { FormError, FormSuccess, SubmitButton } from "@/modules/shared/admin/ui";
import { submitReview } from "../actions";
import { RatingInput } from "./RatingInput";

/** Collapsible "Write a review" form for guests with a completed booking. */
export function GuestReviewForm({ experienceId }: { experienceId: string }) {
  const [open, setOpen] = useState(false);
  const { state, onSubmit, pending } = useFormAction(submitReview);

  if (state?.success) return <FormSuccess message={state.success} />;
  if (!open) return <button className="btn-ghost" onClick={() => setOpen(true)}>✍️ Write a review</button>;

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <h3 className="font-semibold">Review your experience</h3>
        <p className="text-sm text-stone-500">Only verified guests can review — use the reference from your booking.</p>
      </div>
      <FormError error={state?.error} />
      <input type="hidden" name="experienceId" value={experienceId} />
      <RatingInput />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="reference" required placeholder="Booking reference (MDC-…)" className="input" aria-label="Booking reference" />
        <input name="email" type="email" required placeholder="Email used for the booking" className="input" aria-label="Email" />
        <input name="authorName" placeholder="Name to display (optional)" className="input" aria-label="Display name" />
        <input name="authorCountry" placeholder="Where are you from? (optional)" className="input" aria-label="Country" />
      </div>
      <input name="title" placeholder="Title (optional)" className="input" aria-label="Title" />
      <textarea name="comment" required rows={4} placeholder="What made it special?" className="input" aria-label="Review" />
      <SubmitButton pending={pending}>Publish review</SubmitButton>
    </form>
  );
}
