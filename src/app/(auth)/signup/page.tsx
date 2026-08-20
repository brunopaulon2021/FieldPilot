import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { authMessage } from "@/lib/auth/messages";

export const metadata: Metadata = { title: "Criar conta" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignUpPage({ searchParams }: Props) {
  const params = await searchParams;
  const message = authMessage(params.error);

  return (
    <div className="auth-card">
      <div className="auth-title"><span>COMEÇAR</span><h1>Crie a sua conta.</h1><p>Depois do email confirmado, configuramos a sua empresa.</p></div>
      {message && <p className="form-message error" role="alert">{message}</p>}
      <form action={signUp} className="auth-form">
        <label>Nome completo<input name="fullName" autoComplete="name" required minLength={2} maxLength={120} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={320} /></label>
        <label>Palavra-passe<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} aria-describedby="password-hint" /></label>
        <small id="password-hint" className="field-hint">Pelo menos 12 caracteres.</small>
        <AuthSubmitButton>Criar conta</AuthSubmitButton>
      </form>
      <p className="auth-switch">Já tem conta? <Link href="/login">Iniciar sessão</Link></p>
    </div>
  );
}
