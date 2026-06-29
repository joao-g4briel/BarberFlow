import Link from "next/link";
import { ExternalLink, Save } from "lucide-react";
import { updateTenantAction } from "@/lib/actions/tenant";
import { getCurrentTenant } from "@/lib/tenant";
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
import { cn } from "@/lib/utils";

type SettingsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;
  const publicUrl = `/agendar/${tenant.slug}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Administração</p>
        <h1 className="text-3xl font-semibold tracking-normal">Configurações</h1>
      </div>

      <FeedbackMessage success={params?.success} error={params?.error} />

      <Card>
        <CardHeader>
          <CardTitle>Barbearia</CardTitle>
          <CardDescription>Atualize o nome e o slug público.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateTenantAction} className="space-y-4">
            <input
              type="hidden"
              name="successPath"
              value="/dashboard/configuracoes"
            />
            <input
              type="hidden"
              name="failurePath"
              value="/dashboard/configuracoes"
            />
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" defaultValue={tenant.nome} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={tenant.slug} required />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button>
                <Save className="h-4 w-4" />
                Salvar
              </Button>
              <Link
                href={publicUrl}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir link público
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
