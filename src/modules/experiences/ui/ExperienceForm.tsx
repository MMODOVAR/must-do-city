"use client";

import { useState } from "react";
import type { Experience, ExperiencePhoto, ExperienceStep } from "@prisma/client";
import type { FormAction } from "@/modules/shared/forms";
import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { CoordinatesFields } from "@/modules/shared/admin/CoordinatesFields";
import { Checkbox, Field, FormError, Section, Select, SubmitButton } from "@/modules/shared/admin/ui";
import { ADMISSION, PRICING_TYPES } from "../domain";

type Opt = { value: string; label: string };
type Step = { key: number; title: string; description: string; location: string; duration: string; latitude: string; longitude: string; admission: string };
type Photo = { key: number; url: string; caption: string };

let nextKey = 1;
const toStep = (s?: Partial<ExperienceStep>): Step => ({
  key: nextKey++,
  title: s?.title ?? "",
  description: s?.description ?? "",
  location: s?.location ?? "",
  duration: s?.duration ?? "",
  latitude: s?.latitude?.toString() ?? "",
  longitude: s?.longitude?.toString() ?? "",
  admission: s?.admission ?? "",
});
const toPhoto = (p?: Partial<ExperiencePhoto>): Photo => ({ key: nextKey++, url: p?.url ?? "", caption: p?.caption ?? "" });

/** Move item i by dir within a list (for the ↑ ↓ buttons). */
function moved<T>(list: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export function ExperienceForm({
  action,
  experience,
  cities,
  hosts,
  categories,
  defaultCityId,
}: {
  action: FormAction;
  experience?: Experience & { steps: ExperienceStep[]; photos: ExperiencePhoto[] };
  cities: Opt[];
  hosts: Opt[];
  categories: Opt[];
  defaultCityId?: string;
}) {
  const { state, onSubmit, pending } = useFormAction(action);
  const [steps, setSteps] = useState<Step[]>(() => (experience?.steps ?? []).map(toStep));
  const [photos, setPhotos] = useState<Photo[]>(() => (experience?.photos ?? []).map(toPhoto));
  const e = experience;

  const update = (key: number, patch: Partial<Step>) => setSteps((s) => s.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const move = (i: number, dir: -1 | 1) => setSteps((s) => moved(s, i, dir));
  const updatePhoto = (key: number, patch: Partial<Photo>) => setPhotos((p) => p.map((x) => (x.key === key ? { ...x, ...patch } : x)));

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
      </Section>

      <Section title="Photos" description="The cover image appears on cards and first in the gallery. Add more photos for the gallery, in order.">
        <Field label="Cover image URL" name="imageUrl" type="url" defaultValue={e?.imageUrl ?? ""} placeholder="https://…" />
        {photos.length === 0 && <p className="text-sm text-stone-500">No gallery photos yet.</p>}
        <ol className="space-y-3">
          {photos.map((p, i) => (
            <li key={p.key} className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.url ? <img src={p.url} alt="" className="h-14 w-20 rounded object-cover" /> : <span className="flex h-14 w-20 items-center justify-center rounded bg-stone-200 text-xs text-stone-500">preview</span>}
              <input className="input min-w-48 flex-[2]" placeholder="Photo URL (https://…) *" value={p.url} onChange={(ev) => updatePhoto(p.key, { url: ev.target.value })} />
              <input className="input min-w-40 flex-1" placeholder="Caption" value={p.caption} onChange={(ev) => updatePhoto(p.key, { caption: ev.target.value })} />
              <div className="flex gap-1">
                <button type="button" className="btn-ghost px-2 py-1" onClick={() => setPhotos((x) => moved(x, i, -1))} disabled={i === 0} aria-label="Move photo up">↑</button>
                <button type="button" className="btn-ghost px-2 py-1" onClick={() => setPhotos((x) => moved(x, i, 1))} disabled={i === photos.length - 1} aria-label="Move photo down">↓</button>
                <button type="button" className="btn-danger px-2 py-1" onClick={() => setPhotos((x) => x.filter((y) => y.key !== p.key))} aria-label="Remove photo">✕</button>
              </div>
            </li>
          ))}
        </ol>
        <button type="button" className="btn-ghost" onClick={() => setPhotos((p) => [...p, toPhoto()])}>+ Add photo</button>
        <input type="hidden" name="photos" value={JSON.stringify(photos.filter((p) => p.url.trim()).map((p) => ({ url: p.url, caption: p.caption })))} />
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
      </Section>

      <Section title="Meeting point & logistics" description="Shown in the Meeting and pickup section; the meeting point is the Start pin on the itinerary map.">
        <Field label="Meeting point" name="meetingPoint" defaultValue={e?.meetingPoint ?? ""} placeholder="In front of St. Nicholas Stairs, Gemmayzeh" />
        <CoordinatesFields latitude={e?.latitude} longitude={e?.longitude} hint="Meeting-point location. Leave empty to use the city's." />
        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <Field label="Start time" name="startTime" defaultValue={e?.startTime ?? ""} placeholder="10:00" />
          <Field label="End point" name="endPoint" defaultValue={e?.endPoint ?? ""} placeholder="Leave empty if it ends back at the meeting point" />
        </div>
        <Field label="Additional info" name="additionalInfo" textarea rows={4} defaultValue={e?.additionalInfo ?? ""}
          placeholder={"Confirmation within 24 hours\nNot wheelchair accessible\nComfortable shoes recommended"} hint="One item per line." />
        <Field label="Cancellation policy" name="cancellationPolicy" textarea rows={2} defaultValue={e?.cancellationPolicy ?? ""} placeholder="Free cancellation up to 24 hours before the start." />
      </Section>

      <Section title="Itinerary" description="The stops, in order. Add coordinates to show each stop as a numbered pin on the itinerary map.">
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
                <input className="input" type="number" step="any" placeholder="Latitude" aria-label="Stop latitude" value={s.latitude} onChange={(ev) => update(s.key, { latitude: ev.target.value })} />
                <input className="input" type="number" step="any" placeholder="Longitude" aria-label="Stop longitude" value={s.longitude} onChange={(ev) => update(s.key, { longitude: ev.target.value })} />
                <select className="input" aria-label="Admission" value={s.admission} onChange={(ev) => update(s.key, { admission: ev.target.value })}>
                  <option value="">Admission: not specified</option>
                  {Object.entries(ADMISSION).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </li>
          ))}
        </ol>
        <button type="button" className="btn-ghost" onClick={() => setSteps((s) => [...s, toStep()])}>+ Add step</button>
        <input type="hidden" name="steps" value={JSON.stringify(steps.map((s) => ({ title: s.title, description: s.description, location: s.location, duration: s.duration, latitude: s.latitude, longitude: s.longitude, admission: s.admission || null })))} />
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
