import { z } from "zod";
import { zBool, zInt, zRequired, zText } from "@/modules/shared/forms";
import { normaliseList } from "@/modules/shared/text";

export const hostInput = z.object({
  name: zRequired("Host name", 120),
  slug: zText(120),
  cityId: zRequired("City"),
  tagline: zText(140),
  bio: zText(),
  avatarUrl: zText(1000),
  languages: zText(300).transform(normaliseList),
  responseTimeHours: zInt("Response time", { min: 0, max: 168 }),
  verified: zBool(),
  published: zBool(),
});
export type HostInput = z.infer<typeof hostInput>;
