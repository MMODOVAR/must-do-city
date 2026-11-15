import { z } from "zod";
import { zBool, zId, zInt, zNumber, zRequired, zText } from "@/modules/shared/forms";
import { normaliseList } from "@/modules/shared/text";
import { ADMISSION, PRICING_TYPES } from "./domain";

/** Optional coordinate from JSON: "" / null -> null, out of range or not a number -> null. */
const coordinate = (limit: number) =>
  z.preprocess((v) => (v === "" || v === null || v === undefined ? null : Number(v)), z.number().min(-limit).max(limit).nullable()).catch(null);

export const stepInput = z.object({
  title: z.string().trim().min(1, "Each step needs a title.").max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  duration: z.string().trim().max(50).optional().nullable(),
  latitude: coordinate(90),
  longitude: coordinate(180),
  admission: z.enum(Object.keys(ADMISSION) as [keyof typeof ADMISSION]).nullable().catch(null),
});

export const photoInput = z.object({
  url: z.string().trim().url("Each photo needs a valid URL (https://…)."),
  caption: z.string().trim().max(200).optional().nullable(),
});

/** JSON array sent from a hidden input by the admin editors. */
const jsonArray = <T extends z.ZodTypeAny>(item: T, max: number, label: string) =>
  z.preprocess(
    (v) => {
      try {
        return JSON.parse(typeof v === "string" && v ? v : "[]");
      } catch {
        return [];
      }
    },
    z.array(item).max(max, `At most ${max} ${label}.`),
  );

export const experienceInput = z.object({
  title: zRequired("Title", 160),
  slug: zText(160),
  cityId: zRequired("City"),
  hostId: zId(),
  categoryId: zId(),
  summary: zText(300),
  description: zText(10000),
  durationHours: zNumber("Duration", { min: 0, max: 240 }),
  price: zNumber("Price", { min: 0 }),
  currency: zText(3).transform((v) => (v ?? "USD").toUpperCase()),
  pricingType: z.enum(Object.keys(PRICING_TYPES) as [keyof typeof PRICING_TYPES], { error: "Choose how the price is charged." }),
  maxGroupSize: zInt("Max group size", { min: 1, max: 500 }),
  languages: zText(300).transform(normaliseList),
  highlights: zText(),
  included: zText(),
  notIncluded: zText(),
  meetingPoint: zText(300),
  cancellationPolicy: zText(1000),
  latitude: zNumber("Latitude", { min: -90, max: 90 }),
  longitude: zNumber("Longitude", { min: -180, max: 180 }),
  imageUrl: zText(1000),
  isPrivate: zBool(),
  featured: zBool(),
  published: zBool(),
  startTime: zText(20),
  endPoint: zText(300),
  additionalInfo: zText(),
  steps: jsonArray(stepInput, 50, "steps"),
  photos: jsonArray(photoInput, 30, "photos"),
});
export type ExperienceInput = z.infer<typeof experienceInput>;
