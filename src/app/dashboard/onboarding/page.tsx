import { updateTenantAction } from "@/lib/actions/tenant";
import { getCurrentTenant } from "@/lib/tenant";
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
import { FeedbackMessage } from "@/components/feedback-message";

type OnboardingPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Primeiro acesso</p>
        <h1 className="text-3xl font-semibold tracking-normal">
          Configure sua barbearia
        </h1>
      </div>

      <FeedbackMessage success={params?.success} error={params?.error} />

      <Card>
        <CardHeader>
          <CardTitle>Dados básicos</CardTitle>
          <CardDescription>
            Esses dados também definem o link público de agendamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateTenantAction} className="space-y-4">
            <input type="hidden" name="successPath" value="/dashboard" />
            <input type="hidden" name="failurePath" value="/dashboard/onboarding" />
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da barbearia</Label>
              <Input id="nome" name="nome" defaultValue={tenant.nome} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug público</Label>
              <Input id="slug" name="slug" defaultValue={tenant.slug} required />
              <p className="text-xs text-muted-foreground">
                Exemplo: barberflow-demo vira /agendar/barberflow-demo.
              </p>
            </div>
            <Button>Salvar e ir para o dashboard</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
