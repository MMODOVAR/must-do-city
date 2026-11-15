"use client";

import { useFormAction } from "@/modules/shared/admin/useFormAction";
import { FormError, FormSuccess } from "@/modules/shared/admin/ui";
import type { FormAction } from "@/modules/shared/forms";
import { STATUS_LABELS, type BookingStatus } from "../domain";

const STYLE: Partial<Record<BookingStatus, string>> = { CONFIRMED: "btn-primary", COMPLETED: "btn-primary", DECLINED: "btn-danger", CANCELLED: "btn-danger" };

/** Admin control: only offers the transitions the domain allows. */
export function StatusActions({ action, next, adminNote }: { action: FormAction; next: BookingStatus[]; adminNote: string | null }) {
  const { state, onSubmit, pending } = useFormAction(action);
  if (next.length === 0) return <p className="text-sm text-stone-500">This booking is closed — no further changes.</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <FormError error={state?.error} />
      <FormSuccess message={state?.success} />
      <label className="label" htmlFor="adminNote">Internal note</label>
      <textarea id="adminNote" name="adminNote" rows={2} className="input" defaultValue={adminNote ?? ""} />
      <div className="flex flex-wrap gap-2">
        {next.map((s) => (
          <button key={s} name="status" value={s} disabled={pending} className={STYLE[s] ?? "btn-ghost"}>
            Mark {STATUS_LABELS[s].toLowerCase()}
          </button>
        ))}
      </div>
    </form>
  );
}
