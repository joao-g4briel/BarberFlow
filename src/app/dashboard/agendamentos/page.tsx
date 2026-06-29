import Link from "next/link";
import { Filter, PlusCircle } from "lucide-react";
import { updateAppointmentStatusAction } from "@/lib/actions/appointment";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import {
  formatAppointmentServices,
  getAppointmentTotalDuration,
} from "@/lib/appointment-services";
import { formatDatePtBr } from "@/lib/date";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeedbackMessage } from "@/components/feedback-message";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

type AppointmentsPageProps = {
  searchParams?: Promise<{
    status?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;
  const allowedStatuses = APPOINTMENT_STATUSES.map((status) => status.value);
  const statusFilter = allowedStatuses.includes(params?.status as never)
    ? params?.status
    : "ALL";
  const redirectTo =
    statusFilter === "ALL"
      ? "/dashboard/agendamentos"
      : `/dashboard/agendamentos?status=${statusFilter}`;

  const appointments = await db.appointment.findMany({
    where:
      statusFilter === "ALL"
        ? { tenantId: tenant.id }
        : { tenantId: tenant.id, status: statusFilter },
    include: {
      barber: true,
      service: true,
      appointmentServices: { include: { service: true } },
    },
    orderBy: [{ date: "desc" }, { time: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Histórico</p>
          <h1 className="text-3xl font-semibold tracking-normal">Agendamentos</h1>
        </div>
        <Link href="/dashboard/agendamentos/novo" className={cn(buttonVariants())}>
          <PlusCircle className="h-4 w-4" />
          Criar manualmente
        </Link>
      </div>

      <FeedbackMessage success={params?.success} error={params?.error} />

      <Card>
        <CardHeader>
          <CardTitle>Filtro</CardTitle>
          <CardDescription>Filtre por status quando precisar revisar a agenda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]" method="get">
            <Select name="status" defaultValue={statusFilter}>
              <option value="ALL">Todos</option>
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
            <Button>
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
          <CardDescription>{appointments.length} agendamento(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length ? (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="grid gap-3 rounded-md border bg-background p-4 lg:grid-cols-[1fr_220px]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {formatDatePtBr(appointment.date)} às {appointment.time}
                      </p>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {appointment.clientName} - {appointment.clientPhone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatAppointmentServices(appointment)} com{" "}
                      {appointment.barber.nome} -{" "}
                      {getAppointmentTotalDuration(appointment)} min
                    </p>
                  </div>
                  <form action={updateAppointmentStatusAction} className="flex gap-2">
                    <input type="hidden" name="appointmentId" value={appointment.id} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <Select name="status" defaultValue={appointment.status}>
                      {APPOINTMENT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Select>
                    <Button variant="secondary" size="sm">
                      Salvar
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum agendamento encontrado para o filtro atual.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
