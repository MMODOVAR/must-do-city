"use client";

import { useState } from "react";
import { useFormAction } from "./useFormAction";
import type { Journey, JourneyStep } from "@prisma/client";
import type { FormState } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/utils";
import { Checkbox, Field, FormError, SubmitButton } from "./ui";

type Action = (state: FormState, fd: FormData) => Promise<FormState>;
type Step = { key: number; title: string; description: string; location: string; duration: string };

let nextKey = 1;
const toStep = (s?: Partial<JourneyStep>): Step => ({
  key: nextKey++,
  title: s?.title ?? "",
  description: s?.description ?? "",
  location: s?.location ?? "",
  duration: s?.duration ?? "",
});

export function JourneyForm({
  action,
  journey,
  cities,
  defaultCityId,
}: {
  action: Action;
  journey?: Journey & { steps: JourneyStep[] };
  cities: { id: string; name: string; country: { name: string } }[];
  defaultCityId?: string;
}) {
  const { state, onSubmit, pending } = useFormAction(action);
  const [steps, setSteps] = useState<Step[]>(() => (journey?.steps ?? []).map(toStep));

  const update = (key: number, patch: Partial<Step>) =>
    setSteps((s) => s.map((x) => (x.key === key ? { ...x, ...patch } : x)));
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
      <div className="card space-y-5 p-6">
        <FormError error={state?.error} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" name="title" required defaultValue={journey?.title} placeholder="Beirut Food Walk" />
          <div>
            <label htmlFor="cityId" className="label">City</label>
            <select id="cityId" name="cityId" required className="input" defaultValue={journey?.cityId ?? defaultCityId ?? ""}>
              <option value="" disabled>Choose a city…</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.country.name}</option>
              ))}
            </select>
          </div>
        </div>
        <Field label="Slug" name="slug" defaultValue={journey?.slug} hint="Used in the URL. Leave empty to generate from the title." />
        <Field label="Summary" name="summary" defaultValue={journey?.summary ?? ""} placeholder="One line that sells the experience" />
        <Field label="Description" name="description" textarea defaultValue={journey?.description ?? ""} />
        <div className="grid gap-5 sm:grid-cols-4">
          <div>
            <label htmlFor="category" className="label">Category</label>
            <input id="category" name="category" list="categories" className="input" defaultValue={journey?.category ?? ""} />
            <datalist id="categories">
              {CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <Field label="Duration (hours)" name="durationHours" type="number" step="0.5" min="0" defaultValue={journey?.durationHours ?? ""} />
          <Field label="Price" name="price" type="number" step="0.01" min="0" defaultValue={journey?.price ?? ""} hint="0 = Free" />
          <Field label="Currency" name="currency" maxLength={3} defaultValue={journey?.currency ?? "USD"} />
        </div>
        <Field label="Image URL" name="imageUrl" type="url" defaultValue={journey?.imageUrl ?? ""} placeholder="https://…" />
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Published" name="published" defaultChecked={journey?.published ?? true} />
          <Checkbox label="Featured on home page" name="featured" defaultChecked={journey?.featured ?? false} />
        </div>
      </div>

      {/* ---- Steps editor ---- */}
      <div className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Journey steps</h2>
            <p className="text-sm text-stone-500">The stops of the experience, in order.</p>
          </div>
          <button type="button" className="btn-ghost" onClick={() => setSteps((s) => [...s, toStep()])}>
            + Add step
          </button>
        </div>

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
                <input className="input sm:col-span-3" placeholder="Step title *" value={s.title} onChange={(e) => update(s.key, { title: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="Location" value={s.location} onChange={(e) => update(s.key, { location: e.target.value })} />
                <input className="input" placeholder="Duration (e.g. 45 min)" value={s.duration} onChange={(e) => update(s.key, { duration: e.target.value })} />
                <textarea className="input sm:col-span-3" rows={2} placeholder="Description" value={s.description} onChange={(e) => update(s.key, { description: e.target.value })} />
              </div>
            </li>
          ))}
        </ol>
        <input type="hidden" name="steps" value={JSON.stringify(steps.map((s) => ({ title: s.title, description: s.description, location: s.location, duration: s.duration })))} />
      </div>

      <SubmitButton pending={pending}>{journey ? "Save changes" : "Create journey"}</SubmitButton>
    </form>
  );
}
