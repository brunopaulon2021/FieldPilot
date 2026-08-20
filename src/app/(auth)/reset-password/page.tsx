import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updatePassword } from "@/app/auth/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { authMessage } from "@/lib/auth/messages";
import { verifySession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Nova palavra-passe" };
type Props = { searchParams: Promise<{ error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const session = await verifySession();
  if (!session) redirect("/forgot-password?error=expired");

  const params = await searchParams;
  const message = authMessage(params.error);

  return (
    <div className="auth-card">
      <div className="auth-title"><span>NOVO ACESSO</span><h1>Defina uma nova palavra-passe.</h1><p>Use uma palavra-passe longa e exclusiva para o FieldPilot.</p></div>
      {message && <p className="form-message error" role="alert">{message}</p>}
      <form action={updatePassword} className="auth-form">
        <label>Nova palavra-passe<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} /></label>
        <AuthSubmitButton>Guardar palavra-passe</AuthSubmitButton>
      </form>
    </div>
  );
}
