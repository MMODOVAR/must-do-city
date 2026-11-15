"use client";

import { startTransition, useActionState } from "react";
import type { FormAction } from "../forms";

/**
 * Like useActionState, but submits via onSubmit so React does not reset the
 * form afterwards — a validation error keeps everything the user typed.
 */
export function useFormAction(action: FormAction) {
  const [state, dispatch, pending] = useActionState(action, undefined);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Include the clicked submit button (name/value), like a native submit.
    const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    startTransition(() => dispatch(fd));
  };
  return { state, onSubmit, pending };
}
