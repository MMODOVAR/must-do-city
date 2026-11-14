"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/identity/auth";
import { type FormState, formObject, toFormError } from "@/modules/shared/forms";
import { revalidateSite } from "@/modules/shared/revalidate";
import { experienceInput } from "./schemas";
import { experiencesService } from "./service";

export async function saveExperience(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await experiencesService.save(id, experienceInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await experiencesService.delete(id);
  revalidateSite();
  redirect("/admin/experiences");
}
