"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { requireWorkspace } from "@/lib/workspace";
import type { ActionState } from "@/actions/auth";

const workspaceSchema = z.object({
  name: z.string().trim().min(1, "Client name is required"),
  email: z.string().email("Client needs an email so finished invoices have somewhere to go"),
  phone: z.string().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
});

export async function createWorkspaceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = workspaceSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: emptyToUndef(formData.get("phone")),
    addressLine: emptyToUndef(formData.get("addressLine")),
    city: emptyToUndef(formData.get("city")),
    region: emptyToUndef(formData.get("region")),
    postalCode: emptyToUndef(formData.get("postalCode")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const workspace = await db.workspace.create({
    data: {
      ...parsed.data,
      createdById: user.id,
      members: {
        create: { userId: user.id, role: "owner" },
      },
    },
  });
  redirect(`/app/w/${workspace.id}`);
}

export async function updateWorkspaceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  await requireWorkspace(workspaceId);
  const parsed = workspaceSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: emptyToUndef(formData.get("phone")),
    addressLine: emptyToUndef(formData.get("addressLine")),
    city: emptyToUndef(formData.get("city")),
    region: emptyToUndef(formData.get("region")),
    postalCode: emptyToUndef(formData.get("postalCode")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  await db.workspace.update({ where: { id: workspaceId }, data: parsed.data });
  return { ok: true, message: "Client details saved." };
}

function emptyToUndef(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : undefined;
}
