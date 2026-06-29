import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { createManualAppointmentAction } from "@/lib/actions/appointment";
import { getAvailableTimes } from "@/lib/availability";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { formatDateInput, parseDateInput } from "@/lib/date";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeedbackMessage } from "@/components/feedback-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type NewAppointmentPageProps = {
  searchParams?: Promise<{
    barberId?: string;
    date?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function NewAppointmentPage({
  searchParams,
}: NewAppointmentPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;
  const [barbers, services] = await Promise.all([
    db.barber.findMany({
      where: { tenantId: tenant.id },
      orderBy: { nome: "asc" },
    }),
    db.service.findMany({
      where: { tenantId: tenant.id },
      orderBy: { nome: "asc" },
    }),
  ]);

  const canCreate = barbers.length > 0 && services.length > 0;
  const selectedBarber =
    barbers.find((barber) => barber.id === params?.barberId) ?? barbers[0];
  const todayInput = formatDateInput();
  const requestedDateInput = params?.date ?? todayInput;
  const selectedDateInput = parseDateInput(requestedDateInput)
    ? requestedDateInput
    : todayInput;
  const selectedDate = parseDateInput(selectedDateInput) ?? new Date();
  const availableTimes =
    canCreate && selectedBarber
      ? await getAvailableTimes({
          tenantId: tenant.id,
          barberId: selectedBarber.id,
          date: selectedDate,
        })
      : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Agenda</p>
        <h1 className="text-3xl font-semibold tracking-normal">
          Novo agendamento
        </h1>
      </div>

      <FeedbackMessage success={params?.success} error={params?.error} />

      {!canCreate ? (
        <Card>
          <CardHeader>
            <CardTitle>Cadastre a base primeiro</CardTitle>
            <CardDescription>
              Para criar agendamentos, voce precisa de pelo menos um barbeiro e
              um servico.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/barbeiros"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cadastrar barbeiro
            </Link>
            <Link
              href="/dashboard/servicos"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cadastrar servico
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Barbeiro e data</CardTitle>
              <CardDescription>
                Os horarios aparecem livres apenas para o barbeiro selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]"
                method="get"
              >
                <div className="space-y-2">
                  <Label htmlFor="filterBarberId">Barbeiro</Label>
                  <Select
                    id="filterBarberId"
                    name="barberId"
                    defaultValue={selectedBarber.id}
                    required
                  >
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.nome}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filterDate">Data</Label>
                  <Input
                    id="filterDate"
                    name="date"
                    type="date"
                    defaultValue={selectedDateInput}
                    required
                  />
                </div>
                <Button variant="secondary" className="self-end">
                  Ver horarios
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do agendamento</CardTitle>
              <CardDescription>
                Este agendamento entra direto na agenda da barbearia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableTimes.length ? (
                <form action={createManualAppointmentAction} className="space-y-4">
                  <input type="hidden" name="barberId" value={selectedBarber.id} />
                  <input type="hidden" name="date" value={selectedDateInput} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Barbeiro</Label>
                      <Input value={selectedBarber.nome} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input value={selectedDateInput} readOnly />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Cliente</Label>
                      <Input id="clientName" name="clientName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Telefone</Label>
                      <Input id="clientPhone" name="clientPhone" required />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Servicos</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map((service, index) => (
                        <label
                          key={service.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border bg-background p-3 text-sm"
                        >
                          <input
                            type="checkbox"
                            name="serviceIds"
                            value={service.id}
                            defaultChecked={index === 0}
                            className="h-4 w-4 accent-primary"
                          />
                          <span>
                            {service.nome} - {service.durationMinutes} min
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="time">Horario</Label>
                      <Select id="time" name="time" defaultValue={availableTimes[0]}>
                        {availableTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" name="status" defaultValue="CONFIRMED">
                      {APPOINTMENT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button>
                    <CalendarPlus className="h-4 w-4" />
                    Salvar agendamento
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nao ha horarios disponiveis para {selectedBarber.nome} nesta
                  data.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
