"use client";

import { useState } from "react";
import type { Experience, ExperienceStep } from "@prisma/client";
import type { FormAction } from "@/modules/shared/forms";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { CoordinatesFields } from "@/modules/shared/admin/CoordinatesFields";
import { Checkbox, Field, FormError, Section, Select, SubmitButton } from "@/modules/shared/admin/ui";
import { PRICING_TYPES } from "../domain";

type Opt = { value: string; label: string };
type Step = { key: number; title: string; description: string; location: string; duration: string };

let nextKey = 1;
const toStep = (s?: Partial<ExperienceStep>): Step => ({
  key: nextKey++,
  title: s?.title ?? "",
  description: s?.description ?? "",
  location: s?.location ?? "",
  duration: s?.duration ?? "",
});

export function ExperienceForm({
  action,
  experience,
  cities,
  hosts,
  categories,
  defaultCityId,
}: {
  action: FormAction;
  experience?: Experience & { steps: ExperienceStep[] };
  cities: Opt[];
  hosts: Opt[];
  categories: Opt[];
  defaultCityId?: string;
}) {
  const { state, onSubmit, pending } = useFormAction(action);
  const [steps, setSteps] = useState<Step[]>(() => (experience?.steps ?? []).map(toStep));
  const e = experience;

  const update = (key: number, patch: Partial<Step>) => setSteps((s) => s.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const move = (i: number, dir: -1 | 1) =>
    setSteps((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormError error={state?.error} />

      <Section title="Basics">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" name="title" required defaultValue={e?.title} placeholder="Beirut Food Walk with a Local" />
          <Field label="Slug" name="slug" defaultValue={e?.slug} hint="Unique URL name. Leave empty to generate from the title." />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Select label="City" name="cityId" required placeholder="Choose a city…" defaultValue={e?.cityId ?? defaultCityId} options={cities} />
          <Select label="Host" name="hostId" placeholder="No host yet" defaultValue={e?.hostId} options={hosts} />
          <Select label="Category" name="categoryId" placeholder="Uncategorised" defaultValue={e?.categoryId} options={categories} />
        </div>
        <Field label="Summary" name="summary" maxLength={300} defaultValue={e?.summary ?? ""} placeholder="One line that sells the experience" />
        <Field label="Description" name="description" textarea rows={6} defaultValue={e?.description ?? ""} />
        <Field label="Image URL" name="imageUrl" type="url" defaultValue={e?.imageUrl ?? ""} placeholder="https://…" />
      </Section>

      <Section title="Price & group" description="How the experience is sold.">
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Price" name="price" type="number" step="0.01" min="0" defaultValue={e?.price ?? ""} hint="0 = Free" />
          <Field label="Currency" name="currency" maxLength={3} defaultValue={e?.currency ?? "USD"} />
          <Select label="Charged" name="pricingType" required defaultValue={e?.pricingType ?? "PER_PERSON"}
            options={Object.entries(PRICING_TYPES).map(([value, label]) => ({ value, label }))} />
          <Field label="Duration (hours)" name="durationHours" type="number" step="0.5" min="0" defaultValue={e?.durationHours ?? ""} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Max group size" name="maxGroupSize" type="number" min="1" defaultValue={e?.maxGroupSize ?? ""} />
          <Field label="Languages" name="languages" defaultValue={e?.languages ?? ""} placeholder="English, French" hint="Comma separated." />
        </div>
        <Checkbox label="Private experience (only your group)" name="isPrivate" defaultChecked={e?.isPrivate ?? true} />
      </Section>

      <Section title="What to expect" description="One item per line.">
        <Field label="Highlights" name="highlights" textarea rows={4} defaultValue={e?.highlights ?? ""} placeholder={"Taste 8 local dishes\nMeet the bakers of Mar Mikhael"} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Included" name="included" textarea rows={4} defaultValue={e?.included ?? ""} placeholder={"All food tastings\nWater"} />
          <Field label="Not included" name="notIncluded" textarea rows={4} defaultValue={e?.notIncluded ?? ""} placeholder={"Alcoholic drinks\nHotel pick-up"} />
        </div>
        <Field label="Meeting point" name="meetingPoint" defaultValue={e?.meetingPoint ?? ""} placeholder="In front of St. Nicholas Stairs, Gemmayzeh" />
        <CoordinatesFields latitude={e?.latitude} longitude={e?.longitude} hint="Meeting-point location. Leave empty to use the city's." />
        <Field label="Cancellation policy" name="cancellationPolicy" textarea rows={2} defaultValue={e?.cancellationPolicy ?? ""} placeholder="Free cancellation up to 24 hours before the start." />
      </Section>

      <Section title="Itinerary" description="The stops of the experience, in order.">
        {steps.length === 0 && <p className="text-sm text-stone-500">No steps yet.</p>}
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.key} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-xs font-bold text-white">{i + 1}</span>
                <div className="flex gap-1">
                  <button type="button" className="btn-ghost px-2 py-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button type="button" className="btn-ghost px-2 py-1" onClick={() => move(i, 1)} disabled={i === steps.length - 1} aria-label="Move down">↓</button>
                  <button type="button" className="btn-danger px-2 py-1" onClick={() => setSteps((x) => x.filter((y) => y.key !== s.key))} aria-label="Remove step">✕</button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input className="input sm:col-span-3" placeholder="Step title *" value={s.title} onChange={(ev) => update(s.key, { title: ev.target.value })} />
                <input className="input sm:col-span-2" placeholder="Location" value={s.location} onChange={(ev) => update(s.key, { location: ev.target.value })} />
                <input className="input" placeholder="Duration (e.g. 45 min)" value={s.duration} onChange={(ev) => update(s.key, { duration: ev.target.value })} />
                <textarea className="input sm:col-span-3" rows={2} placeholder="Description" value={s.description} onChange={(ev) => update(s.key, { description: ev.target.value })} />
              </div>
            </li>
          ))}
        </ol>
        <button type="button" className="btn-ghost" onClick={() => setSteps((s) => [...s, toStep()])}>+ Add step</button>
        <input type="hidden" name="steps" value={JSON.stringify(steps.map((s) => ({ title: s.title, description: s.description, location: s.location, duration: s.duration })))} />
      </Section>

      <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Published" name="published" defaultChecked={e?.published ?? true} />
          <Checkbox label="Featured on the home page" name="featured" defaultChecked={e?.featured ?? false} />
        </div>
        <SubmitButton pending={pending}>{e ? "Save changes" : "Create experience"}</SubmitButton>
      </div>
    </form>
  );
}
