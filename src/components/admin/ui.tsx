"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Save", pending }: { children?: React.ReactNode; pending?: boolean }) {
  const status = useFormStatus();
  pending = pending ?? status.pending;
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
}

export function Field({
  label,
  name,
  hint,
  textarea,
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {textarea ? (
        <textarea id={name} name={name} rows={4} className="input" {...rest} />
      ) : (
        <input id={name} name={name} className="input" {...rest} />
      )}
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-clay" />
      {label}
    </label>
  );
}

/** Delete button that asks for confirmation before submitting its server action. */
export function DeleteButton({ action, label = "Delete", warning }: { action: () => Promise<void>; label?: string; warning: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(warning)) e.preventDefault();
      }}
    >
      <button type="submit" className="btn-danger">{label}</button>
    </form>
  );
}
