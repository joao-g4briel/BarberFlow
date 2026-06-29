import Link from "next/link";
import { CalendarCheck, Scissors, ShieldCheck, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const benefits = [
  {
    title: "Agenda centralizada",
    description: "Acompanhe o dia da barbearia e reduza conflitos de horario.",
    icon: CalendarCheck,
  },
  {
    title: "Cadastro essencial",
    description: "Tenha barbeiros, servicos e clientes em um fluxo simples.",
    icon: Users,
  },
  {
    title: "Link publico",
    description: "Receba agendamentos por um endereco proprio da barbearia.",
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
              <Scissors className="h-4 w-4 text-primary" />
              BarberFlow MVP
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                BarberFlow
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Um SaaS local e minimalista para barbearias pequenas controlarem
                agenda, barbeiros, servicos e link publico de agendamento.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className={cn(buttonVariants(), "w-full sm:w-auto")}>
                <Scissors className="h-4 w-4" />
                Acessar Sistema
              </Link>
              <Button variant="outline" className="w-full sm:w-auto" disabled>
                Sem integracoes externas
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agenda de hoje</p>
                <h2 className="text-xl font-semibold">Resumo operacional</h2>
              </div>
              <div className="rounded-md bg-primary/15 px-3 py-2 text-sm text-primary">
                100% local
              </div>
            </div>
            <div className="space-y-3">
              {["09:00 Corte classico", "10:00 Barba completa", "14:00 Degrade"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md border bg-background px-4 py-3"
                  >
                    <span className="text-sm">{item}</span>
                    <span className="text-xs text-muted-foreground">Confirmado</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <Card key={benefit.title}>
              <CardHeader>
                <Icon className="h-5 w-5 text-primary" />
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Fluxo pensado para o primeiro MVP: direto, escuro e responsivo.
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
