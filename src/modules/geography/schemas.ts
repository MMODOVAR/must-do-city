import { z } from "zod";
import { zBool, zNumber, zRequired, zText } from "@/modules/shared/forms";

const coordinates = {
  latitude: zNumber("Latitude", { min: -90, max: 90 }),
  longitude: zNumber("Longitude", { min: -180, max: 180 }),
};

export const countryInput = z.object({
  name: zRequired("Country name", 120),
  slug: zText(120),
  isoCode: zText(3).transform((v) => v?.toUpperCase() ?? null),
  description: zText(),
  imageUrl: zText(1000),
  published: zBool(),
  ...coordinates,
});
export type CountryInput = z.infer<typeof countryInput>;

export const cityInput = z.object({
  name: zRequired("City name", 120),
  countryId: zRequired("Country"),
  slug: zText(120),
  tagline: zText(140),
  description: zText(),
  imageUrl: zText(1000),
  isHotspot: zBool(),
  published: zBool(),
  ...coordinates,
});
export type CityInput = z.infer<typeof cityInput>;
