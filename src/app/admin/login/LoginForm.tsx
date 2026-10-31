"use client";

import { useFormAction } from "@/components/admin/useFormAction";
import { login } from "../actions";
import { Field, FormError, SubmitButton } from "@/components/admin/ui";

export function LoginForm({ next }: { next?: string }) {
  const { state, onSubmit, pending } = useFormAction(login);
  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <FormError error={state?.error} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" name="email" type="email" autoComplete="username" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <SubmitButton pending={pending}>Sign in</SubmitButton>
    </form>
  );
}
