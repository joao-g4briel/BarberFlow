import Link from "next/link";
import { Scissors } from "lucide-react";
import { LoginForm } from "@/app/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OWNER_EMAIL, OWNER_PASSWORD } from "@/lib/constants";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next?.startsWith("/dashboard")
    ? params.next
    : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="mb-2 inline-flex items-center gap-2 text-sm">
            <Scissors className="h-4 w-4 text-primary" />
            BarberFlow
          </Link>
          <CardTitle>Entrar no sistema</CardTitle>
          <CardDescription>
            Login fake do MVP: {OWNER_EMAIL} / {OWNER_PASSWORD}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            nextPath={nextPath}
            ownerEmail={OWNER_EMAIL}
            ownerPassword={OWNER_PASSWORD}
          />
        </CardContent>
      </Card>
    </main>
  );
}
