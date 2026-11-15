"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Save", pending, className = "btn-primary" }: { children?: React.ReactNode; pending?: boolean; className?: string }) {
  const status = useFormStatus();
  pending = pending ?? status.pending;
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>;
}

type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Field({ label, name, hint, textarea, rows = 4, ...rest }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {textarea ? (
        <textarea id={name} name={name} rows={rows} className="input" {...rest} />
      ) : (
        <input id={name} name={name} className="input" {...rest} />
      )}
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <select id={name} name={name} required={required} className="input" defaultValue={defaultValue ?? ""}>
        {placeholder !== undefined && <option value="" disabled={required}>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
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

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="card space-y-5 p-6">
      <legend className="sr-only">{title}</legend>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-stone-500">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

/** Button that asks for confirmation before submitting its server action. */
export function ConfirmButton({
  action,
  label = "Delete",
  warning,
  className = "btn-danger",
}: {
  action: () => Promise<void>;
  label?: string;
  warning: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(warning)) e.preventDefault();
      }}
    >
      <button type="submit" className={className}>{label}</button>
    </form>
  );
}

/** Kept for readability at call sites. */
export const DeleteButton = ConfirmButton;
