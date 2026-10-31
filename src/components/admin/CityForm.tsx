"use client";

import { useFormAction } from "./useFormAction";
import type { City } from "@prisma/client";
import type { FormState } from "@/app/admin/actions";
import { Checkbox, Field, FormError, SubmitButton } from "./ui";

type Action = (state: FormState, fd: FormData) => Promise<FormState>;

export function CityForm({
  action,
  city,
  countries,
  defaultCountryId,
}: {
  action: Action;
  city?: City;
  countries: { id: string; name: string }[];
  defaultCountryId?: string;
}) {
  const { state, onSubmit, pending } = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <FormError error={state?.error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required defaultValue={city?.name} placeholder="Beirut" />
        <div>
          <label htmlFor="countryId" className="label">Country</label>
          <select id="countryId" name="countryId" required className="input" defaultValue={city?.countryId ?? defaultCountryId ?? ""}>
            <option value="" disabled>Choose a country…</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Field label="Slug" name="slug" defaultValue={city?.slug} hint="Used in the URL. Leave empty to generate from the name." />
      <Field label="Description" name="description" textarea defaultValue={city?.description ?? ""} />
      <Field label="Image URL" name="imageUrl" type="url" defaultValue={city?.imageUrl ?? ""} placeholder="https://…" />
      <Checkbox label="Published (visible on the website)" name="published" defaultChecked={city?.published ?? true} />
      <SubmitButton pending={pending}>{city ? "Save changes" : "Create city"}</SubmitButton>
    </form>
  );
}
