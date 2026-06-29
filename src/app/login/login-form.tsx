"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  nextPath: string;
  ownerEmail: string;
  ownerPassword: string;
};

const initialState = {
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending}>
      <LogIn className="h-4 w-4" />
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm({
  nextPath,
  ownerEmail,
  ownerPassword,
}: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={ownerEmail}
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={ownerPassword}
          autoComplete="current-password"
          required
        />
      </div>
      {state.error ? (
        <div className="rounded-md border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </div>
      ) : null}
      <SubmitButton />
    </form>
  );
}
