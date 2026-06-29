export const OWNER_EMAIL =
  process.env.BARBERFLOW_OWNER_EMAIL ?? "owner@barberflow.com";

export const OWNER_PASSWORD =
  process.env.BARBERFLOW_OWNER_PASSWORD ?? "123456";

export const SESSION_COOKIE_NAME =
  process.env.BARBERFLOW_SESSION_COOKIE ?? "barberflow_session";

export const SESSION_VALUE = "owner-session-v1";

export const DEFAULT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const APPOINTMENT_STATUSES = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELED", label: "Cancelado" },
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]["value"];

export const STATUS_LABELS = Object.fromEntries(
  APPOINTMENT_STATUSES.map((status) => [status.value, status.label]),
) as Record<AppointmentStatus, string>;
