import Link from "next/link";
import { ClipboardList, LogOut, MapPin, ShieldCheck, Users } from "lucide-react";
import { logout } from "@/app/app/actions";
import type { WorkspaceContext } from "@/lib/organizations/workspace";

const roleLabels: Record<WorkspaceContext["role"], string> = {
  owner: "Owner",
  admin: "Administrador",
  dispatcher: "Coordenador",
  technician: "Técnico",
  customer: "Cliente",
};

export function DashboardShell({
  active,
  children,
  workspace,
}: {
  active: "customers" | "overview";
  children: React.ReactNode;
  workspace: WorkspaceContext;
}) {
  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand" href="/app"><span className="brand-mark"><MapPin size={17} /></span>FieldPilot</Link>
        <nav aria-label="Área de trabalho">
          <Link className={active === "overview" ? "active" : undefined} href="/app"><ClipboardList size={17} />Visão geral</Link>
          <Link className={active === "customers" ? "active" : undefined} href="/app/customers"><Users size={17} />Clientes</Link>
        </nav>
        <form action={logout}><button className="sidebar-logout" type="submit"><LogOut size={16} />Terminar sessão</button></form>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div><small>ÁREA DE TRABALHO</small><h1>{workspace.organizationName}</h1></div>
          <span className="role-badge"><ShieldCheck size={15} />{roleLabels[workspace.role]}</span>
        </header>
        <nav className="mobile-workspace-nav" aria-label="Área de trabalho móvel">
          <Link className={active === "overview" ? "active" : undefined} href="/app">Visão geral</Link>
          <Link className={active === "customers" ? "active" : undefined} href="/app/customers">Clientes</Link>
        </nav>
        {children}
      </section>
    </main>
  );
}
