"use client";

import type { Host } from "@prisma/client";
import type { FormAction } from "@/modules/shared/forms";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { Checkbox, Field, FormError, Select, SubmitButton } from "@/modules/shared/admin/ui";

export function HostForm({ action, host, cities }: { action: FormAction; host?: Host; cities: { value: string; label: string }[] }) {
  const { state, onSubmit, pending } = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <FormError error={state?.error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required defaultValue={host?.name} placeholder="Rania Haddad" />
        <Select label="Home city" name="cityId" required placeholder="Choose a city…" defaultValue={host?.cityId} options={cities} />
      </div>
      <Field label="Slug" name="slug" defaultValue={host?.slug} hint="Used in the URL. Leave empty to generate from the name." />
      <Field label="Tagline" name="tagline" maxLength={140} defaultValue={host?.tagline ?? ""} placeholder="Chef, market lover & storyteller" />
      <Field label="Bio" name="bio" textarea rows={5} defaultValue={host?.bio ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Languages" name="languages" defaultValue={host?.languages ?? ""} placeholder="English, French, Arabic" hint="Comma separated." />
        <Field label="Typical response time (hours)" name="responseTimeHours" type="number" min="0" max="168" defaultValue={host?.responseTimeHours ?? ""} />
      </div>
      <Field label="Photo URL" name="avatarUrl" type="url" defaultValue={host?.avatarUrl ?? ""} placeholder="https://…" hint="Leave empty to show initials." />
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Published" name="published" defaultChecked={host?.published ?? true} />
        <Checkbox label="Verified host (ID checked)" name="verified" defaultChecked={host?.verified ?? false} />
      </div>
      <SubmitButton pending={pending}>{host ? "Save changes" : "Create host"}</SubmitButton>
    </form>
  );
}
