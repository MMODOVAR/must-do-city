"use client";

import type { City } from "@prisma/client";
import type { FormAction } from "@/modules/shared/forms";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { CoordinatesFields } from "@/modules/shared/admin/CoordinatesFields";
import { Checkbox, Field, FormError, Select, SubmitButton } from "@/modules/shared/admin/ui";

export function CityForm({
  action,
  city,
  countries,
  defaultCountryId,
}: {
  action: FormAction;
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
        <Select label="Country" name="countryId" required placeholder="Choose a country…"
          defaultValue={city?.countryId ?? defaultCountryId} options={countries.map((c) => ({ value: c.id, label: c.name }))} />
      </div>
      <Field label="Slug" name="slug" defaultValue={city?.slug} hint="Used in the URL. Leave empty to generate from the name." />
      <Field label="Tagline" name="tagline" maxLength={140} defaultValue={city?.tagline ?? ""} placeholder="Mezze, sea views and rooftop nights" hint="Short hook shown on the map popup." />
      <Field label="Description" name="description" textarea defaultValue={city?.description ?? ""} />
      <Field label="Image URL" name="imageUrl" type="url" defaultValue={city?.imageUrl ?? ""} placeholder="https://…" />
      <CoordinatesFields latitude={city?.latitude} longitude={city?.longitude} />
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Published (visible on the website)" name="published" defaultChecked={city?.published ?? true} />
        <Checkbox label="Top hotspot (highlighted on the map)" name="isHotspot" defaultChecked={city?.isHotspot ?? false} />
      </div>
      <SubmitButton pending={pending}>{city ? "Save changes" : "Create city"}</SubmitButton>
    </form>
  );
}
