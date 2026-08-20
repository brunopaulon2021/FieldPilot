import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MapPin, ShieldCheck } from "lucide-react";
import { OrganizationForm } from "@/components/organization-form";
import { authMessage } from "@/lib/auth/messages";
import { verifySession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Configurar empresa" };
type Props = { searchParams: Promise<{ error?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { data: membership } = await session.supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", session.userId)
    .limit(1)
    .maybeSingle();

  if (membership) redirect("/app");

  const params = await searchParams;
  const message = authMessage(params.error);

  return (
    <main className="onboarding-page">
      <header className="auth-header"><span className="brand"><span className="brand-mark"><MapPin size={17} /></span>FieldPilot</span><span className="step-label">PASSO 1 DE 1</span></header>
      <section className="onboarding-card">
        <div className="auth-title"><span>CONFIGURAÇÃO INICIAL</span><h1>Como se chama a sua empresa?</h1><p>Criaremos um espaço privado. A sua conta ficará como Owner e poderá convidar a equipa depois.</p></div>
        {message && <p className="form-message error" role="alert">{message}</p>}
        <OrganizationForm />
        <div className="security-note"><ShieldCheck size={18} /><span><strong>Separação desde o primeiro registo</strong><small>As políticas do banco impedem acesso a dados de outras empresas.</small></span></div>
      </section>
    </main>
  );
}
