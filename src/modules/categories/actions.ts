"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/identity/auth";
import { type FormState, formObject, toFormError } from "@/modules/shared/forms";
import { revalidateSite } from "@/modules/shared/revalidate";
import { categoryInput } from "./schemas";
import { categoriesService } from "./service";

export async function saveCategory(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await categoriesService.save(id, categoryInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await categoriesService.delete(id);
  revalidateSite();
  redirect("/admin/categories");
}
