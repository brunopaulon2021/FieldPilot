"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/supabase/config";
import { verifySession } from "@/lib/auth/session";
import { fieldValue, loginSchema, passwordSchema, recoverySchema, signUpSchema } from "@/lib/auth/validation";
import { safeRedirectPath } from "@/lib/auth/redirect";

function withMessage(path: string, type: "error" | "success", code: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}${type}=${encodeURIComponent(code)}` as Route);
}

export async function login(formData: FormData) {
  const result = loginSchema.safeParse({
    email: fieldValue(formData, "email"),
    password: fieldValue(formData, "password"),
  });
  const next = safeRedirectPath(fieldValue(formData, "next"), "/app");

  if (!result.success) withMessage("/login", "error", "invalid");

  const supabase = await createClient();
  if (!supabase) withMessage("/login", "error", "configuration");

  const { error } = await supabase.auth.signInWithPassword(result.data);
  if (error) withMessage("/login", "error", "credentials");

  redirect(next as Route);
}

export async function signUp(formData: FormData) {
  const result = signUpSchema.safeParse({
    fullName: fieldValue(formData, "fullName"),
    email: fieldValue(formData, "email"),
    password: fieldValue(formData, "password"),
  });

  if (!result.success) withMessage("/signup", "error", "invalid");

  const supabase = await createClient();
  if (!supabase) withMessage("/signup", "error", "configuration");

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
      emailRedirectTo: `${getAppUrl()}/auth/callback?next=/onboarding`,
    },
  });

  if (error) withMessage("/signup", "error", "generic");
  if (data.session) redirect("/onboarding");
  withMessage("/login", "success", "email_pending");
}

export async function requestPasswordRecovery(formData: FormData) {
  const result = recoverySchema.safeParse({ email: fieldValue(formData, "email") });
  if (!result.success) withMessage("/forgot-password", "error", "invalid");

  const supabase = await createClient();
  if (!supabase) withMessage("/forgot-password", "error", "configuration");

  await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
  });

  withMessage("/forgot-password", "success", "recovery_sent");
}

export async function updatePassword(formData: FormData) {
  const result = passwordSchema.safeParse({ password: fieldValue(formData, "password") });
  if (!result.success) withMessage("/reset-password", "error", "invalid");

  const session = await verifySession();
  if (!session) withMessage("/forgot-password", "error", "expired");

  const { error } = await session.supabase.auth.updateUser({ password: result.data.password });
  if (error) withMessage("/reset-password", "error", "generic");

  await session.supabase.auth.signOut();
  withMessage("/login", "success", "updated");
}
