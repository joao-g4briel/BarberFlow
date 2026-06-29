"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function redirectWith(path: string, key: string, value: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}${key}=${value}`);
}

function revalidateCatalogPaths(slug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/agendamentos");
  revalidatePath("/dashboard/agendamentos/novo");
  revalidatePath("/dashboard/barbeiros");
  revalidatePath("/dashboard/servicos");
  revalidatePath(`/agendar/${slug}`);
}

export async function createBarberAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const nome = readText(formData, "nome");

  if (!nome) {
    redirectWith("/dashboard/barbeiros", "error", "required");
  }

  await db.barber.create({
    data: {
      nome,
      tenantId: tenant.id,
    },
  });

  revalidateCatalogPaths(tenant.slug);
  redirectWith("/dashboard/barbeiros", "success", "1");
}

export async function updateBarberAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const barberId = readText(formData, "barberId");
  const nome = readText(formData, "nome");

  if (!barberId || !nome) {
    redirectWith("/dashboard/barbeiros", "error", "required");
  }

  const result = await db.barber.updateMany({
    where: {
      id: barberId,
      tenantId: tenant.id,
    },
    data: { nome },
  });

  if (!result.count) {
    redirectWith("/dashboard/barbeiros", "error", "invalid");
  }

  revalidateCatalogPaths(tenant.slug);
  redirectWith("/dashboard/barbeiros", "success", "updated");
}

export async function deleteBarberAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const barberId = readText(formData, "barberId");

  if (!barberId) {
    redirectWith("/dashboard/barbeiros", "error", "required");
  }

  const result = await db.barber.deleteMany({
    where: {
      id: barberId,
      tenantId: tenant.id,
    },
  });

  if (!result.count) {
    redirectWith("/dashboard/barbeiros", "error", "invalid");
  }

  revalidateCatalogPaths(tenant.slug);
  redirectWith("/dashboard/barbeiros", "success", "deleted");
}

export async function createServiceAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const nome = readText(formData, "nome");
  const durationMinutes = Number(readText(formData, "durationMinutes"));

  if (!nome || !Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    redirectWith("/dashboard/servicos", "error", "required");
  }

  await db.service.create({
    data: {
      nome,
      durationMinutes,
      tenantId: tenant.id,
    },
  });

  revalidateCatalogPaths(tenant.slug);
  redirectWith("/dashboard/servicos", "success", "1");
}

export async function updateServiceAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const serviceId = readText(formData, "serviceId");
  const nome = readText(formData, "nome");
  const durationMinutes = Number(readText(formData, "durationMinutes"));

  if (
    !serviceId ||
    !nome ||
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0
  ) {
    redirectWith("/dashboard/servicos", "error", "required");
  }

  const result = await db.service.updateMany({
    where: {
      id: serviceId,
      tenantId: tenant.id,
    },
    data: {
      nome,
      durationMinutes,
    },
  });

  if (!result.count) {
    redirectWith("/dashboard/servicos", "error", "invalid");
  }

  revalidateCatalogPaths(tenant.slug);
  redirectWith("/dashboard/servicos", "success", "updated");
}

export async function deleteServiceAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const serviceId = readText(formData, "serviceId");

  if (!serviceId) {
    redirectWith("/dashboard/servicos", "error", "required");
  }

  const result = await db.service.deleteMany({
    where: {
      id: serviceId,
      tenantId: tenant.id,
    },
  });

  if (!result.count) {
    redirectWith("/dashboard/servicos", "error", "invalid");
  }

  revalidateCatalogPaths(tenant.slug);
  redirectWith("/dashboard/servicos", "success", "deleted");
}
