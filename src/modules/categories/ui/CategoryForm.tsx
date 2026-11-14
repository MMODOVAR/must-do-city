"use client";

import type { Category } from "@prisma/client";
import type { FormAction } from "@/modules/shared/forms";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { Field, FormError, SubmitButton } from "@/modules/shared/admin/ui";

export function CategoryForm({ action, category }: { action: FormAction; category?: Category | null }) {
  const { state, onSubmit, pending } = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <FormError error={state?.error} />
      <div className="grid gap-5 sm:grid-cols-[1fr_120px_120px]">
        <Field label="Name" name="name" required defaultValue={category?.name} placeholder="Food & Drinks" />
        <Field label="Icon (emoji)" name="icon" maxLength={8} defaultValue={category?.icon ?? ""} placeholder="🍜" />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
      </div>
      <Field label="Slug" name="slug" defaultValue={category?.slug} hint="Used in the URL. Leave empty to generate from the name." />
      <Field label="Description" name="description" textarea rows={2} defaultValue={category?.description ?? ""} />
      <SubmitButton pending={pending}>{category ? "Save changes" : "Create category"}</SubmitButton>
    </form>
  );
}
