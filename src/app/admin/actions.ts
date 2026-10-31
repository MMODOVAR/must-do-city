"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/session";
import { bool, num, slugify, str } from "@/lib/utils";

export type FormState = { error?: string } | undefined;

function friendlyError(e: unknown): FormState {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return { error: "That slug is already in use. Choose a different name or slug." };
  }
  if (e instanceof z.ZodError) {
    return { error: e.issues.map((i) => `${i.path.join(".") || "field"}: ${i.message}`).join(" · ") };
  }
  if (e instanceof Error) return { error: e.message };
  return { error: "Something went wrong." };
}

/* ---------------------------------------------------------------- Auth */

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email")?.toLowerCase();
  const password = str(fd, "password");
  if (!email || !password) return { error: "Email and password are required." };

  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!admin || !ok) return { error: "Invalid email or password." };

  const token = await createSessionToken({ sub: admin.id, email: admin.email });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

  const next = str(fd, "next");
  redirect(next && next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ------------------------------------------------------------ Countries */

function countryData(fd: FormData) {
  const name = str(fd, "name");
  if (!name) throw new Error("Country name is required.");
  return {
    name,
    slug: slugify(str(fd, "slug") ?? name),
    isoCode: str(fd, "isoCode")?.toUpperCase() ?? null,
    description: str(fd, "description"),
    imageUrl: str(fd, "imageUrl"),
    published: bool(fd, "published"),
  };
}

export async function saveCountry(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const data = countryData(fd);
    if (id) await prisma.country.update({ where: { id }, data });
    else await prisma.country.create({ data });
  } catch (e) {
    return friendlyError(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/countries");
}

export async function deleteCountry(id: string) {
  await requireAdmin();
  await prisma.country.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/countries");
}

/* --------------------------------------------------------------- Cities */

function cityData(fd: FormData) {
  const name = str(fd, "name");
  const countryId = str(fd, "countryId");
  if (!name) throw new Error("City name is required.");
  if (!countryId) throw new Error("Please choose a country.");
  return {
    name,
    countryId,
    slug: slugify(str(fd, "slug") ?? name),
    description: str(fd, "description"),
    imageUrl: str(fd, "imageUrl"),
    published: bool(fd, "published"),
  };
}

export async function saveCity(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const data = cityData(fd);
    if (id) await prisma.city.update({ where: { id }, data });
    else await prisma.city.create({ data });
  } catch (e) {
    return friendlyError(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/cities");
}

export async function deleteCity(id: string) {
  await requireAdmin();
  await prisma.city.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/cities");
}

/* ------------------------------------------------------------- Journeys */

const stepSchema = z.object({
  title: z.string().trim().min(1, "each step needs a title"),
  description: z.string().trim().optional().nullable(),
  location: z.string().trim().optional().nullable(),
  duration: z.string().trim().optional().nullable(),
});

function journeyData(fd: FormData) {
  const title = str(fd, "title");
  const cityId = str(fd, "cityId");
  if (!title) throw new Error("Journey title is required.");
  if (!cityId) throw new Error("Please choose a city.");
  const steps = z.array(stepSchema).parse(JSON.parse(str(fd, "steps") ?? "[]"));
  return {
    data: {
      title,
      cityId,
      slug: slugify(str(fd, "slug") ?? title),
      summary: str(fd, "summary"),
      description: str(fd, "description"),
      category: str(fd, "category"),
      durationHours: num(fd, "durationHours"),
      price: num(fd, "price"),
      currency: (str(fd, "currency") ?? "USD").toUpperCase(),
      imageUrl: str(fd, "imageUrl"),
      featured: bool(fd, "featured"),
      published: bool(fd, "published"),
    },
    steps: steps.map((s, i) => ({
      order: i + 1,
      title: s.title,
      description: s.description || null,
      location: s.location || null,
      duration: s.duration || null,
    })),
  };
}

export async function saveJourney(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const { data, steps } = journeyData(fd);
    if (id) {
      await prisma.$transaction([
        prisma.journeyStep.deleteMany({ where: { journeyId: id } }),
        prisma.journey.update({ where: { id }, data: { ...data, steps: { create: steps } } }),
      ]);
    } else {
      await prisma.journey.create({ data: { ...data, steps: { create: steps } } });
    }
  } catch (e) {
    return friendlyError(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/journeys");
}

export async function deleteJourney(id: string) {
  await requireAdmin();
  await prisma.journey.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/journeys");
}
