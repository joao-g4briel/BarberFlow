import Link from "next/link";
import { CalendarDays, ExternalLink, PlusCircle, Users, Wrench } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import {
  formatAppointmentServices,
  getAppointmentTotalDuration,
} from "@/lib/appointment-services";
import { formatDateInput, formatDatePtBr, parseDateInput } from "@/lib/date";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const tenant = await getCurrentTenant();
  const today = parseDateInput(formatDateInput()) ?? new Date();

  const [barbersCount, servicesCount, appointmentsToday] = await Promise.all([
    db.barber.count({ where: { tenantId: tenant.id } }),
    db.service.count({ where: { tenantId: tenant.id } }),
    db.appointment.findMany({
      where: { tenantId: tenant.id, date: today },
      include: {
        barber: true,
        service: true,
        appointmentServices: { include: { service: true } },
      },
      orderBy: { time: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Área do Owner</p>
          <h1 className="text-3xl font-semibold tracking-normal">{tenant.nome}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Link público: /agendar/{tenant.slug}
          </p>
        </div>
        <Link href="/dashboard/agendamentos/novo" className={cn(buttonVariants())}>
          <PlusCircle className="h-4 w-4" />
          Criar agendamento
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>{barbersCount}</CardTitle>
            <CardDescription>Barbeiros cadastrados</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Wrench className="h-5 w-5 text-primary" />
            <CardTitle>{servicesCount}</CardTitle>
            <CardDescription>Serviços cadastrados</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle>{appointmentsToday.length}</CardTitle>
            <CardDescription>Agendamentos em {formatDatePtBr(today)}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {tenant.nome === "Minha Barbearia" ? (
        <Card>
          <CardHeader>
            <CardTitle>Finalize o onboarding</CardTitle>
            <CardDescription>
              Troque o nome e o slug para publicar o link real da barbearia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/onboarding"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Configurar barbearia
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Agenda de hoje</CardTitle>
          <CardDescription>Próximos horários do dia.</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsToday.length ? (
            <div className="space-y-3">
              {appointmentsToday.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col justify-between gap-3 rounded-md border bg-background p-4 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-medium">
                      {appointment.time} - {appointment.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatAppointmentServices(appointment)} com{" "}
                      {appointment.barber.nome} -{" "}
                      {getAppointmentTotalDuration(appointment)} min
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum agendamento para hoje.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/agendar/${tenant.slug}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ExternalLink className="h-4 w-4" />
          Abrir link público
        </Link>
        <Link
          href="/dashboard/barbeiros"
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          Cadastrar barbeiros
        </Link>
        <Link
          href="/dashboard/servicos"
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          Cadastrar serviços
        </Link>
      </div>
    </div>
  );
}
