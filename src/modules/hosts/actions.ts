"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/identity/auth";
import { type FormState, formObject, toFormError } from "@/modules/shared/forms";
import { revalidateSite } from "@/modules/shared/revalidate";
import { hostInput } from "./schemas";
import { hostsService } from "./service";

export async function saveHost(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await hostsService.save(id, hostInput.parse(formObject(fd)));
  } catch (e) {
    return toFormError(e);
  }
  revalidateSite();
  redirect("/admin/hosts");
}

export async function deleteHost(id: string) {
  await requireAdmin();
  await hostsService.delete(id);
  revalidateSite();
  redirect("/admin/hosts");
}
