"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/identity/auth";
import { type FormState, formObject, toFormError } from "@/modules/shared/forms";
import { revalidateSite } from "@/modules/shared/revalidate";
import { cityInput, countryInput } from "./schemas";
import { geographyService } from "./service";

export async function saveCountry(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await geographyService.saveCountry(id, countryInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  redirect("/admin/countries");
}

export async function deleteCountry(id: string) {
  await requireAdmin();
  await geographyService.deleteCountry(id);
  revalidateSite();
  redirect("/admin/countries");
}

export async function saveCity(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await geographyService.saveCity(id, cityInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  redirect("/admin/cities");
}

export async function deleteCity(id: string) {
  await requireAdmin();
  await geographyService.deleteCity(id);
  revalidateSite();
  redirect("/admin/cities");
}
