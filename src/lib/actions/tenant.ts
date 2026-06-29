"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant, getUniqueTenantSlug } from "@/lib/tenant";
import { slugify } from "@/lib/utils";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safePath(value: string, fallback: string) {
  return value.startsWith("/") ? value : fallback;
}

function withParam(path: string, key: string, value: string) {
  return `${path}${path.includes("?") ? "&" : "?"}${key}=${value}`;
}

export async function updateTenantAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const nome = readText(formData, "nome");
  const rawSlug = readText(formData, "slug");
  const successPath = safePath(
    readText(formData, "successPath"),
    "/dashboard/configuracoes",
  );
  const failurePath = safePath(
    readText(formData, "failurePath"),
    "/dashboard/configuracoes",
  );

  if (!nome || !rawSlug) {
    redirect(withParam(failurePath, "error", "required"));
  }

  const normalizedSlug = slugify(rawSlug);

  if (!normalizedSlug) {
    redirect(withParam(failurePath, "error", "slug"));
  }

  const slug = await getUniqueTenantSlug(normalizedSlug, tenant.id);

  await db.tenant.update({
    where: { id: tenant.id },
    data: { nome, slug },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/agendar/${tenant.slug}`);
  revalidatePath(`/agendar/${slug}`);

  redirect(withParam(successPath, "success", "1"));
}
