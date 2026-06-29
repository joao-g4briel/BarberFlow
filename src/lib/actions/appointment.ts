"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import {
  APPOINTMENT_STATUSES,
  type AppointmentStatus,
} from "@/lib/constants";
import { parseDateInput } from "@/lib/date";

const VALID_STATUS_VALUES = APPOINTMENT_STATUSES.map((status) => status.value);

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readTextList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function redirectWith(path: string, key: string, value: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}${key}=${value}`);
}

function safeDashboardPath(value: string) {
  return value.startsWith("/dashboard") ? value : "/dashboard/agendamentos";
}

function withAppointmentSelection(path: string, barberId: string, dateInput: string) {
  if (!barberId || !dateInput) {
    return path;
  }

  const params = new URLSearchParams({
    barberId,
    date: dateInput,
  });

  return `${path}${path.includes("?") ? "&" : "?"}${params.toString()}`;
}

function normalizeStatus(value: string, fallback: AppointmentStatus) {
  return VALID_STATUS_VALUES.includes(value as AppointmentStatus)
    ? (value as AppointmentStatus)
    : fallback;
}

function getSelectedServiceIds(formData: FormData) {
  const serviceIds = readTextList(formData, "serviceIds");
  const legacyServiceId = readText(formData, "serviceId");
  const ids = serviceIds.length ? serviceIds : [legacyServiceId].filter(Boolean);

  return [...new Set(ids)];
}

async function isSlotTaken(
  tenantId: string,
  barberId: string,
  date: Date,
  time: string,
) {
  const existing = await db.appointment.findFirst({
    where: {
      tenantId,
      barberId,
      date,
      time,
      status: { not: "CANCELED" },
    },
  });

  return Boolean(existing);
}

export async function createManualAppointmentAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const dateInput = readText(formData, "date");
  const date = parseDateInput(dateInput);
  const time = readText(formData, "time");
  const clientName = readText(formData, "clientName");
  const clientPhone = readText(formData, "clientPhone");
  const barberId = readText(formData, "barberId");
  const serviceIds = getSelectedServiceIds(formData);
  const status = normalizeStatus(readText(formData, "status"), "CONFIRMED");
  const manualPath = withAppointmentSelection(
    "/dashboard/agendamentos/novo",
    barberId,
    dateInput,
  );

  if (
    !date ||
    !time ||
    !clientName ||
    !clientPhone ||
    !barberId ||
    !serviceIds.length
  ) {
    redirectWith(manualPath, "error", "required");
  }

  const [barber, services] = await Promise.all([
    db.barber.findFirst({ where: { id: barberId, tenantId: tenant.id } }),
    db.service.findMany({
      where: {
        id: { in: serviceIds },
        tenantId: tenant.id,
      },
    }),
  ]);

  if (!barber || services.length !== serviceIds.length) {
    redirectWith(manualPath, "error", "invalid");
  }

  if (await isSlotTaken(tenant.id, barberId, date, time)) {
    redirectWith(manualPath, "error", "taken");
  }

  const servicesById = new Map(services.map((service) => [service.id, service]));
  const selectedServices = serviceIds.map((id) => servicesById.get(id)!);
  const primaryService = selectedServices[0];

  await db.appointment.create({
    data: {
      date,
      time,
      clientName,
      clientPhone,
      barberId,
      serviceId: primaryService.id,
      tenantId: tenant.id,
      status,
      appointmentServices: {
        create: selectedServices.map((service) => ({
          serviceId: service.id,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/agendamentos");
  revalidatePath(`/agendar/${tenant.slug}`);
  redirectWith("/dashboard/agendamentos", "success", "created");
}

export async function createPublicAppointmentAction(
  slug: string,
  formData: FormData,
) {
  const tenant = await db.tenant.findUnique({ where: { slug } });

  if (!tenant) {
    notFound();
  }

  const dateInput = readText(formData, "date");
  const date = parseDateInput(dateInput);
  const time = readText(formData, "time");
  const clientName = readText(formData, "clientName");
  const clientPhone = readText(formData, "clientPhone");
  const barberId = readText(formData, "barberId");
  const serviceIds = getSelectedServiceIds(formData);
  const publicPath = `/agendar/${tenant.slug}`;
  const selectedPublicPath = withAppointmentSelection(
    publicPath,
    barberId,
    dateInput,
  );

  if (
    !date ||
    !time ||
    !clientName ||
    !clientPhone ||
    !barberId ||
    !serviceIds.length
  ) {
    redirectWith(selectedPublicPath, "error", "required");
  }

  const [barber, services] = await Promise.all([
    db.barber.findFirst({ where: { id: barberId, tenantId: tenant.id } }),
    db.service.findMany({
      where: {
        id: { in: serviceIds },
        tenantId: tenant.id,
      },
    }),
  ]);

  if (!barber || services.length !== serviceIds.length) {
    redirectWith(selectedPublicPath, "error", "invalid");
  }

  if (await isSlotTaken(tenant.id, barberId, date, time)) {
    redirectWith(selectedPublicPath, "error", "taken");
  }

  const servicesById = new Map(services.map((service) => [service.id, service]));
  const selectedServices = serviceIds.map((id) => servicesById.get(id)!);
  const primaryService = selectedServices[0];

  await db.appointment.create({
    data: {
      date,
      time,
      clientName,
      clientPhone,
      barberId,
      serviceId: primaryService.id,
      tenantId: tenant.id,
      status: "PENDING",
      appointmentServices: {
        create: selectedServices.map((service) => ({
          serviceId: service.id,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/agendamentos");
  revalidatePath(publicPath);
  redirectWith(selectedPublicPath, "success", "1");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const tenant = await getCurrentTenant();
  const appointmentId = readText(formData, "appointmentId");
  const status = normalizeStatus(readText(formData, "status"), "PENDING");
  const redirectTo = safeDashboardPath(readText(formData, "redirectTo"));

  if (!appointmentId) {
    redirect(redirectTo);
  }

  await db.appointment.updateMany({
    where: {
      id: appointmentId,
      tenantId: tenant.id,
    },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/agendamentos");
  revalidatePath(`/agendar/${tenant.slug}`);
  redirect(redirectTo);
}
