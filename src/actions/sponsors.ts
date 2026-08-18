"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import type { ActionState } from "@/actions/auth";

const sponsorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().optional(),
  tagline: z.string().trim().optional(),
  about: z.string().trim().optional(),
  url: z.string().trim().min(1, "Website is required"),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  featured: z.boolean(),
});

function readSponsor(formData: FormData) {
  return sponsorSchema.safeParse({
    name: formData.get("name"),
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    tagline: empty(formData.get("tagline")),
    about: empty(formData.get("about")),
    url: formData.get("url"),
    email: empty(formData.get("email")),
    phone: empty(formData.get("phone")),
    city: empty(formData.get("city")),
    logoUrl: empty(formData.get("logoUrl")),
    featured: formData.get("featured") === "on",
  });
}

function empty(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : undefined;
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "sponsor";
  let slug = root;
  let n = 2;
  while (true) {
    const existing = await db.sponsor.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${n}`;
    n += 1;
  }
}

export async function createSponsorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readSponsor(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const last = await db.sponsor.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const slug = await uniqueSlug(parsed.data.slug || parsed.data.name);
  await db.sponsor.create({
    data: {
      ...parsed.data,
      slug,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
  revalidatePath(`/sponsors/${slug}`);
  redirect("/admin/sponsors");
}

export async function updateSponsorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = readSponsor(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  const slug = await uniqueSlug(parsed.data.slug || parsed.data.name, id);
  await db.sponsor.update({
    where: { id },
    data: { ...parsed.data, slug },
  });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
  revalidatePath(`/sponsors/${slug}`);
  return { ok: true, message: "Sponsor saved." };
}

export async function toggleSponsorFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const featured = formData.get("featured") === "true";
  await db.sponsor.update({ where: { id }, data: { featured } });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsorAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.sponsor.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
}
