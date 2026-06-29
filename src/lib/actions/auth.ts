"use server";

import { redirect } from "next/navigation";
import { clearOwnerSession, isValidOwnerCredentials, setOwnerSession } from "@/lib/auth";
import { ensureTenantForOwner } from "@/lib/tenant";
import { OWNER_EMAIL, OWNER_PASSWORD } from "@/lib/constants";

type LoginState = {
  error?: string;
};

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeDashboardPath(value: string) {
  return value.startsWith("/dashboard") ? value : "/dashboard";
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");
  const nextPath = safeDashboardPath(readText(formData, "next"));

  if (!isValidOwnerCredentials(email, password)) {
    return {
      error: `Use ${OWNER_EMAIL} / ${OWNER_PASSWORD} para entrar neste MVP.`,
    };
  }

  const { created } = await ensureTenantForOwner(email);
  await setOwnerSession();

  redirect(created ? "/dashboard/onboarding" : nextPath);
}

export async function logoutAction() {
  await clearOwnerSession();
  redirect("/login");
}
