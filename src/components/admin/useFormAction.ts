"use client";

import { startTransition, useActionState } from "react";
import type { FormState } from "@/app/admin/actions";

type Action = (state: FormState, fd: FormData) => Promise<FormState>;

/**
 * Like useActionState, but submits via onSubmit so React does not reset the
 * form afterwards — a validation error keeps everything the admin typed.
 */
export function useFormAction(action: Action) {
  const [state, dispatch, pending] = useActionState(action, undefined);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return { state, onSubmit, pending };
}
