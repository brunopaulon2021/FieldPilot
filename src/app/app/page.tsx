import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, MapPinned, ShieldCheck, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCustomerCounts } from "@/lib/customers/data";
import { getCurrentWorkspace } from "@/lib/organizations/workspace";

export const metadata: Metadata = { title: "Painel" };

export default async function AppPage() {
  const workspace = await getCurrentWorkspace();
  if (!workspace) redirect("/onboarding");

  const counts = await getCustomerCounts();

  return (
    <DashboardShell active="overview" workspace={workspace}>
      <div className="welcome-panel">
        <span>OPERAÇÃO EM CONSTRUÇÃO</span>
        <h2>Clientes e locais já estão ligados à sua empresa.</h2>
        <p>Registe a base de clientes e os locais onde a equipa presta assistência. Os dados ficam separados por organização desde a primeira gravação.</p>
        <Link className="button dashboard-cta" href="/app/customers">Gerir clientes</Link>
      </div>
      <div className="dashboard-grid">
        <article><span className="dashboard-icon"><Users size={20} /></span><small>CLIENTES ATIVOS</small><strong>{counts.activeCustomers}</strong><p>Empresas e particulares disponíveis para a operação.</p></article>
        <article><span className="dashboard-icon"><MapPinned size={20} /></span><small>LOCAIS</small><strong>{counts.locations}</strong><p>Moradas onde serão associados equipamentos e serviços.</p></article>
        <article><span className="dashboard-icon"><Building2 size={20} /></span><small>EMPRESA</small><strong>{workspace.organizationName}</strong><p>/{workspace.organizationSlug}</p></article>
        <article><span className="dashboard-icon"><ShieldCheck size={20} /></span><small>SEGURANÇA</small><strong>RLS ativo</strong><p>Leitura e escrita isoladas por organização.</p></article>
      </div>
    </DashboardShell>
  );
}
