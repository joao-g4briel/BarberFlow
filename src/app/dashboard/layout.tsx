import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  ExternalLink,
  Home,
  LogOut,
  PlusCircle,
  Scissors,
  Settings,
  UserRound,
  Wrench,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { getCurrentTenant } from "@/lib/tenant";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/agenda", label: "Agenda do dia", icon: CalendarDays },
  { href: "/dashboard/agendamentos", label: "Agendamentos", icon: ClipboardList },
  { href: "/dashboard/agendamentos/novo", label: "Novo", icon: PlusCircle },
  { href: "/dashboard/barbeiros", label: "Barbeiros", icon: UserRound },
  { href: "/dashboard/servicos", label: "Serviços", icon: Wrench },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getCurrentTenant();
  const publicUrl = `/agendar/${tenant.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-72">
          <div className="rounded-lg border bg-card p-4">
            <Link href="/dashboard" className="mb-5 flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">BarberFlow</p>
                <p className="text-xs text-muted-foreground">{tenant.nome}</p>
              </div>
            </Link>

            <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 grid gap-2">
              <Link
                href={publicUrl}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-start",
                )}
              >
                <ExternalLink className="h-4 w-4" />
                Link público
              </Link>
              <form action={logoutAction}>
                <Button variant="secondary" className="w-full justify-start">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
