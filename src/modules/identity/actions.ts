"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/modules/shared/db";
import type { FormState } from "@/modules/shared/forms";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "./session";

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!admin || !ok) return { error: "Invalid email or password." };

  const token = await createSessionToken({ sub: admin.id, email: admin.email });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
