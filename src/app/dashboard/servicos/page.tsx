import { Save, Trash2, Wrench } from "lucide-react";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
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

type ServicesPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;
  const services = await db.service.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Catálogo</p>
        <h1 className="text-3xl font-semibold tracking-normal">Serviços</h1>
      </div>

      <FeedbackMessage success={params?.success} error={params?.error} />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Novo serviço</CardTitle>
            <CardDescription>Nome e duração em minutos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createServiceAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" placeholder="Ex: Corte clássico" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duração</Label>
                <Input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  min="1"
                  defaultValue="45"
                  required
                />
              </div>
              <Button>
                <Wrench className="h-4 w-4" />
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços cadastrados</CardTitle>
            <CardDescription>{services.length} registro(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {services.length ? (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-md border bg-background p-4"
                  >
                    <form
                      action={updateServiceAction}
                      className="grid gap-3 md:grid-cols-[1fr_150px_auto]"
                    >
                      <input type="hidden" name="serviceId" value={service.id} />
                      <div className="space-y-2">
                        <Label htmlFor={`service-${service.id}`}>Nome</Label>
                        <Input
                          id={`service-${service.id}`}
                          name="nome"
                          defaultValue={service.nome}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${service.id}`}>DuraÃ§Ã£o</Label>
                        <Input
                          id={`duration-${service.id}`}
                          name="durationMinutes"
                          type="number"
                          min="1"
                          defaultValue={service.durationMinutes}
                          required
                        />
                      </div>
                      <Button variant="secondary" className="self-end">
                        <Save className="h-4 w-4" />
                        Salvar
                      </Button>
                    </form>
                    <form action={deleteServiceAction} className="mt-3">
                      <input type="hidden" name="serviceId" value={service.id} />
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
                Nenhum serviço cadastrado ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
