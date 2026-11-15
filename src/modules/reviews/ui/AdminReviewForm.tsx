"use client";

import type { FormAction } from "@/modules/shared/forms";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { Checkbox, Field, FormError, Select, SubmitButton } from "@/modules/shared/admin/ui";
import { RatingInput } from "./RatingInput";

export function AdminReviewForm({ action, experiences, defaultExperienceId }: { action: FormAction; experiences: { value: string; label: string }[]; defaultExperienceId?: string }) {
  const { state, onSubmit, pending } = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <FormError error={state?.error} />
      <Select label="Experience" name="experienceId" required placeholder="Choose an experience…" defaultValue={defaultExperienceId} options={experiences} />
      <div>
        <span className="label">Rating</span>
        <RatingInput />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Author name" name="authorName" required />
        <Field label="Author country" name="authorCountry" />
      </div>
      <Field label="Title" name="title" />
      <Field label="Review" name="comment" textarea required />
      <Checkbox label="Published" name="published" defaultChecked />
      <SubmitButton pending={pending}>Add review</SubmitButton>
    </form>
  );
}
