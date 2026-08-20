import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Building2, ClipboardList, LogOut, MapPin, ShieldCheck, Users } from "lucide-react";
import { logout } from "@/app/app/actions";
import { verifySession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Painel" };

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Administrador",
  dispatcher: "Coordenador",
  technician: "Técnico",
  customer: "Cliente",
};

export default async function AppPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { data: membership, error: membershipError } = await session.supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) throw new Error("Could not load organization membership");
  if (!membership) redirect("/onboarding");

  const { data: organization, error: organizationError } = await session.supabase
    .from("organizations")
    .select("name, slug")
    .eq("id", membership.organization_id)
    .single();

  if (organizationError || !organization) throw new Error("Could not load organization");

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <span className="brand"><span className="brand-mark"><MapPin size={17} /></span>FieldPilot</span>
        <nav aria-label="Área de trabalho"><a className="active" href="/app"><ClipboardList size={17} />Visão geral</a></nav>
        <form action={logout}><button className="sidebar-logout" type="submit"><LogOut size={16} />Terminar sessão</button></form>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-header"><div><small>ÁREA DE TRABALHO</small><h1>{organization.name}</h1></div><span className="role-badge"><ShieldCheck size={15} />{roleLabels[membership.role] ?? membership.role}</span></header>
        <div className="welcome-panel"><span>BASE CONFIGURADA</span><h2>A sua operação já tem um espaço seguro.</h2><p>A conta, a empresa e o acesso Owner foram criados. A próxima entrega adicionará clientes, locais e equipamentos sobre esta base.</p></div>
        <div className="dashboard-grid">
          <article><span className="dashboard-icon"><Building2 size={20} /></span><small>EMPRESA</small><strong>{organization.name}</strong><p>/{organization.slug}</p></article>
          <article><span className="dashboard-icon"><Users size={20} /></span><small>EQUIPA</small><strong>1 membro</strong><p>Convites chegam na próxima etapa.</p></article>
          <article><span className="dashboard-icon"><ShieldCheck size={20} /></span><small>SEGURANÇA</small><strong>RLS ativo</strong><p>Leitura e escrita isoladas por organização.</p></article>
        </div>
      </section>
    </main>
  );
}
