import { Save, Trash2, UserRound } from "lucide-react";
import {
  createBarberAction,
  deleteBarberAction,
  updateBarberAction,
} from "@/lib/actions/catalog";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
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

type BarbersPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function BarbersPage({ searchParams }: BarbersPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;
  const barbers = await db.barber.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Equipe</p>
        <h1 className="text-3xl font-semibold tracking-normal">Barbeiros</h1>
      </div>

      <FeedbackMessage success={params?.success} error={params?.error} />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Novo barbeiro</CardTitle>
            <CardDescription>Cadastre apenas o nome neste MVP.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createBarberAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" placeholder="Ex: João Silva" required />
              </div>
              <Button>
                <UserRound className="h-4 w-4" />
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barbeiros cadastrados</CardTitle>
            <CardDescription>{barbers.length} registro(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {barbers.length ? (
              <div className="space-y-3">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="rounded-md border bg-background p-4"
                  >
                    <form
                      action={updateBarberAction}
                      className="grid gap-3 sm:grid-cols-[1fr_auto]"
                    >
                      <input type="hidden" name="barberId" value={barber.id} />
                      <div className="space-y-2">
                        <Label htmlFor={`barber-${barber.id}`}>Nome</Label>
                        <Input
                          id={`barber-${barber.id}`}
                          name="nome"
                          defaultValue={barber.nome}
                          required
                        />
                      </div>
                      <Button variant="secondary" className="self-end">
                        <Save className="h-4 w-4" />
                        Salvar
                      </Button>
                    </form>
                    <form action={deleteBarberAction} className="mt-3">
                      <input type="hidden" name="barberId" value={barber.id} />
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum barbeiro cadastrado ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
