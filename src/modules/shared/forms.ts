import { Prisma } from "@prisma/client";
import { z } from "zod";

/** Result returned by every form server action (admin and public). */
export type FormState =
  | { error?: string; success?: string; data?: Record<string, string> }
  | undefined;

export type FormAction = (state: FormState, fd: FormData) => Promise<FormState>;

/** Thrown by services for business-rule violations; shown to the user as-is. */
export class DomainError extends Error {}

/** Turn any thrown error into a message the user can act on. */
export function toFormError(e: unknown): FormState {
  if (e instanceof DomainError) return { error: e.message };
  if (e instanceof z.ZodError) {
    return { error: e.issues.map((i) => i.message).join(" · ") };
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return { error: "That slug (or reference) is already in use. Choose a different one." };
  }
  console.error(e);
  return { error: "Something went wrong. Please try again." };
}

/** FormData -> plain object, ready for a zod schema. */
export function formObject(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

/* ---- zod field helpers: HTML forms send strings, empty means "not set" ---- */

const blank = (v: unknown) => {
  if (v === undefined || v === null) return null;
  if (typeof v === "string") return v.trim() === "" ? null : v.trim();
  return v;
};

/** Optional text: "" -> null. */
export const zText = (max = 5000) =>
  z.preprocess(blank, z.string().max(max, `Text is too long (max ${max} characters).`).nullable());

/** Required text with a friendly message. */
export const zRequired = (label: string, max = 300) =>
  z.preprocess(
    blank,
    z.string({ error: `${label} is required.` }).min(1, `${label} is required.`).max(max, `${label} is too long.`),
  );

/** Optional number: "" -> null. */
export const zNumber = (label: string, opts: { min?: number; max?: number } = {}) =>
  z.preprocess(
    (v) => {
      const b = blank(v);
      return b === null ? null : Number(b);
    },
    z
      .number({ error: `${label} must be a number.` })
      .min(opts.min ?? -Infinity, `${label} must be at least ${opts.min}.`)
      .max(opts.max ?? Infinity, `${label} must be at most ${opts.max}.`)
      .nullable(),
  );

export const zInt = (label: string, opts: { min?: number; max?: number } = {}) =>
  zNumber(label, opts).refine((n) => n === null || Number.isInteger(n), `${label} must be a whole number.`);

/** Checkbox: present ("on") -> true, absent -> false. */
export const zBool = () => z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

/** Optional id from a <select>: "" -> null. */
export const zId = () => z.preprocess(blank, z.string().nullable());
