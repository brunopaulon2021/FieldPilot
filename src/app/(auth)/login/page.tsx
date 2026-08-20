import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { authMessage } from "@/lib/auth/messages";
import { safeRedirectPath } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "Iniciar sessão" };

type Props = { searchParams: Promise<{ error?: string; success?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const message = authMessage(params.error ?? params.success);
  const next = safeRedirectPath(params.next, "/app");

  return (
    <div className="auth-card">
      <div className="auth-title"><span>ÁREA RESERVADA</span><h1>Bem-vindo de volta.</h1><p>Inicie sessão para continuar para a sua operação.</p></div>
      {message && <p className={`form-message ${params.error ? "error" : "success"}`} role={params.error ? "alert" : "status"}>{message}</p>}
      <form action={login} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={320} /></label>
        <label>Palavra-passe<input name="password" type="password" autoComplete="current-password" required /></label>
        <div className="form-meta"><Link href="/forgot-password">Esqueci-me da palavra-passe</Link></div>
        <AuthSubmitButton>Iniciar sessão</AuthSubmitButton>
      </form>
      <p className="auth-switch">Ainda não tem conta? <Link href="/signup">Criar conta</Link></p>
    </div>
  );
}
