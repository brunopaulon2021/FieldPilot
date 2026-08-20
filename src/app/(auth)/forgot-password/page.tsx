import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordRecovery } from "@/app/auth/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { authMessage } from "@/lib/auth/messages";

export const metadata: Metadata = { title: "Recuperar palavra-passe" };
type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const message = authMessage(params.error ?? params.success);

  return (
    <div className="auth-card">
      <div className="auth-title"><span>RECUPERAÇÃO</span><h1>Recupere o acesso.</h1><p>Enviaremos um link seguro para definir uma nova palavra-passe.</p></div>
      {message && <p className={`form-message ${params.error ? "error" : "success"}`} role={params.error ? "alert" : "status"}>{message}</p>}
      <form action={requestPasswordRecovery} className="auth-form">
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={320} /></label>
        <AuthSubmitButton>Enviar instruções</AuthSubmitButton>
      </form>
      <p className="auth-switch"><Link href="/login">Voltar ao início de sessão</Link></p>
    </div>
  );
}
