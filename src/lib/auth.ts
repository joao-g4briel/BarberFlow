import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  OWNER_EMAIL,
  OWNER_PASSWORD,
  SESSION_COOKIE_NAME,
  SESSION_VALUE,
} from "@/lib/constants";

export function isValidOwnerCredentials(email: string, password: string) {
  return email === OWNER_EMAIL && password === OWNER_PASSWORD;
}

export async function setOwnerSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearOwnerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentOwnerEmail() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return session === SESSION_VALUE ? OWNER_EMAIL : null;
}

export async function requireOwnerEmail() {
  const ownerEmail = await getCurrentOwnerEmail();

  if (!ownerEmail) {
    redirect("/login");
  }

  return ownerEmail;
}
