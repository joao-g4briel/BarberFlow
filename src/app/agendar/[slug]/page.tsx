import { notFound } from "next/navigation";
import { CalendarCheck, Scissors } from "lucide-react";
import { createPublicAppointmentAction } from "@/lib/actions/appointment";
import { getAvailableTimes } from "@/lib/availability";
import { db } from "@/lib/db";
import { formatDateInput, parseDateInput } from "@/lib/date";
import { Button } from "@/components/ui/button";
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

type PublicSchedulingPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    barberId?: string;
    date?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function PublicSchedulingPage({
  params,
  searchParams,
}: PublicSchedulingPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const tenant = await db.tenant.findUnique({
    where: { slug },
    include: {
      barbers: { orderBy: { nome: "asc" } },
      services: { orderBy: { nome: "asc" } },
    },
  });

  if (!tenant) {
    notFound();
  }

  const canSchedule = tenant.barbers.length > 0 && tenant.services.length > 0;
  const selectedBarber =
    tenant.barbers.find((barber) => barber.id === query?.barberId) ??
    tenant.barbers[0];
  const todayInput = formatDateInput();
  const requestedDateInput = query?.date ?? todayInput;
  const selectedDateInput = parseDateInput(requestedDateInput)
    ? requestedDateInput
    : todayInput;
  const selectedDate = parseDateInput(selectedDateInput) ?? new Date();
  const availableTimes =
    canSchedule && selectedBarber
      ? await getAvailableTimes({
          tenantId: tenant.id,
          barberId: selectedBarber.id,
          date: selectedDate,
        })
      : [];
  const action = createPublicAppointmentAction.bind(null, tenant.slug);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border bg-card">
            <Scissors className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Agendamento online</p>
            <h1 className="text-3xl font-semibold tracking-normal">{tenant.nome}</h1>
          </div>
        </div>

        <FeedbackMessage success={query?.success} error={query?.error} />

        <Card>
          <CardHeader>
            <CardTitle>Barbeiros disponiveis</CardTitle>
            <CardDescription>
              Escolha um barbeiro e uma data para ver apenas os horarios livres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tenant.barbers.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {tenant.barbers.map((barber) => (
                  <div key={barber.id} className="rounded-md border bg-background p-3">
                    {barber.nome}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Esta barbearia ainda nao cadastrou barbeiros.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escolher barbeiro e data</CardTitle>
            <CardDescription>
              Um horario ocupado some somente para o barbeiro escolhido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canSchedule ? (
              <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]" method="get">
                <div className="space-y-2">
                  <Label htmlFor="filterBarberId">Barbeiro</Label>
                  <Select
                    id="filterBarberId"
                    name="barberId"
                    defaultValue={selectedBarber.id}
                    required
                  >
                    {tenant.barbers.map((barber) => (
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
            ) : (
              <p className="text-sm text-muted-foreground">
                A agenda publica sera liberada quando houver barbeiro e servico
                cadastrados.
              </p>
            )}
          </CardContent>
        </Card>

        {canSchedule ? (
          <Card>
            <CardHeader>
              <CardTitle>Solicitar horario</CardTitle>
              <CardDescription>
                Horarios livres para {selectedBarber.nome} em {selectedDateInput}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableTimes.length ? (
                <form action={action} className="space-y-5">
                  <input type="hidden" name="barberId" value={selectedBarber.id} />
                  <input type="hidden" name="date" value={selectedDateInput} />

                  <div className="space-y-3">
                    <Label>Servicos</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {tenant.services.map((service, index) => (
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

                  <div className="space-y-3">
                    <Label>Horarios disponiveis</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {availableTimes.map((time) => (
                        <label
                          key={time}
                          className="flex cursor-pointer items-center gap-2 rounded-md border bg-background p-3 text-sm"
                        >
                          <input
                            type="radio"
                            name="time"
                            value={time}
                            defaultChecked={time === availableTimes[0]}
                            className="h-4 w-4 accent-primary"
                            required
                          />
                          {time}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Seu nome</Label>
                      <Input id="clientName" name="clientName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Telefone</Label>
                      <Input id="clientPhone" name="clientPhone" required />
                    </div>
                  </div>

                  <Button className="w-full sm:w-auto">
                    <CalendarCheck className="h-4 w-4" />
                    Confirmar agendamento
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
        ) : null}
      </div>
    </main>
  );
}
