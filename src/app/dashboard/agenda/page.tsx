import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { updateAppointmentStatusAction } from "@/lib/actions/appointment";
import { getCurrentTenant } from "@/lib/tenant";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import {
  formatAppointmentServices,
  getAppointmentTotalDuration,
} from "@/lib/appointment-services";
import { formatDateInput, formatDatePtBr, parseDateInput } from "@/lib/date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";

type AgendaPageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;
  const selectedDateInput = params?.date ?? formatDateInput();
  const selectedDate = parseDateInput(selectedDateInput) ?? parseDateInput(formatDateInput())!;
  const redirectTo = `/dashboard/agenda?date=${selectedDateInput}`;

  const appointments = await db.appointment.findMany({
    where: { tenantId: tenant.id, date: selectedDate },
    include: {
      barber: true,
      service: true,
      appointmentServices: { include: { service: true } },
    },
    orderBy: { time: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Operação diária</p>
        <h1 className="text-3xl font-semibold tracking-normal">Agenda do dia</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar data</CardTitle>
          <CardDescription>Visualize os horários de uma data específica.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]" method="get">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={selectedDateInput}
              />
            </div>
            <Button className="self-end">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{formatDatePtBr(selectedDate)}</CardTitle>
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
                        {appointment.time} - {appointment.clientName}
                      </p>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatAppointmentServices(appointment)} com{" "}
                      {appointment.barber.nome} -{" "}
                      {getAppointmentTotalDuration(appointment)} min
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Telefone: {appointment.clientPhone}
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
              Nenhum agendamento para esta data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
