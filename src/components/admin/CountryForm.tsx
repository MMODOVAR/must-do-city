"use client";

import { useFormAction } from "./useFormAction";
import type { Country } from "@prisma/client";
import type { FormState } from "@/app/admin/actions";
import { Checkbox, Field, FormError, SubmitButton } from "./ui";

type Action = (state: FormState, fd: FormData) => Promise<FormState>;

export function CountryForm({ action, country }: { action: Action; country?: Country }) {
  const { state, onSubmit, pending } = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <FormError error={state?.error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required defaultValue={country?.name} placeholder="Lebanon" />
        <Field label="ISO code" name="isoCode" maxLength={3} defaultValue={country?.isoCode ?? ""} placeholder="LB" />
      </div>
      <Field label="Slug" name="slug" defaultValue={country?.slug} hint="Used in the URL. Leave empty to generate from the name." />
      <Field label="Description" name="description" textarea defaultValue={country?.description ?? ""} />
      <Field label="Image URL" name="imageUrl" type="url" defaultValue={country?.imageUrl ?? ""} placeholder="https://…" />
      <Checkbox label="Published (visible on the website)" name="published" defaultChecked={country?.published ?? true} />
      <SubmitButton pending={pending}>{country ? "Save changes" : "Create country"}</SubmitButton>
    </form>
  );
}
