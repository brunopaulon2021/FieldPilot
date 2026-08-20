import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, MapPin, Plus, Search, UserRound } from "lucide-react";
import { CustomerForm } from "@/components/customer-form";
import { DashboardShell } from "@/components/dashboard-shell";
import { listCustomers } from "@/lib/customers/data";
import { canManageCustomers, getCurrentWorkspace } from "@/lib/organizations/workspace";

export const metadata: Metadata = { title: "Clientes" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function CustomersPage({ searchParams }: Props) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) redirect("/onboarding");

  const params = await searchParams;
  const search = params.q?.trim().slice(0, 80) ?? "";
  const customers = await listCustomers(search);
  const canManage = canManageCustomers(workspace.role);

  return (
    <DashboardShell active="customers" workspace={workspace}>
      <div className="entity-page-header">
        <div><span>BASE OPERACIONAL</span><h2>Clientes e locais</h2><p>Organize quem recebe o serviço e todas as moradas onde a equipa trabalha.</p></div>
        {canManage && <a className="button" href="#novo-cliente"><Plus size={17} />Novo cliente</a>}
      </div>

      <div className="customer-layout">
        <section className="entity-list-panel" aria-labelledby="customer-list-title">
          <div className="entity-panel-heading"><div><small>CARTEIRA</small><h3 id="customer-list-title">{customers.length} {customers.length === 1 ? "cliente" : "clientes"}</h3></div></div>
          <form className="customer-search" action="/app/customers" role="search">
            <Search size={17} aria-hidden="true" />
            <input name="q" defaultValue={search} maxLength={80} placeholder="Pesquisar pelo nome" aria-label="Pesquisar clientes" />
            <button type="submit">Pesquisar</button>
          </form>

          {customers.length === 0 ? (
            <div className="empty-state"><UsersEmptyIcon /><h3>{search ? "Nenhum resultado encontrado" : "Ainda não existem clientes"}</h3><p>{search ? "Experimente pesquisar outro nome." : "Crie o primeiro cliente para começar a estruturar a operação."}</p></div>
          ) : (
            <div className="customer-list">
              {customers.map((customer) => (
                <Link className="customer-row" href={`/app/customers/${customer.id}`} key={customer.id}>
                  <span className="customer-avatar">{customer.kind === "company" ? <Building2 size={19} /> : <UserRound size={19} />}</span>
                  <span className="customer-summary"><strong>{customer.displayName}</strong><small>{customer.taxId ?? customer.email ?? customer.phone ?? "Sem contacto registado"}</small></span>
                  <span className="customer-location"><MapPin size={14} />{customer.primaryCity ?? "Sem local"}<small>{customer.locationCount} {customer.locationCount === 1 ? "local" : "locais"}</small></span>
                  {customer.archivedAt && <span className="status-badge archived">Arquivado</span>}
                </Link>
              ))}
            </div>
          )}
        </section>

        {canManage && (
          <aside className="entity-form-panel" id="novo-cliente">
            <div className="entity-panel-heading"><div><small>NOVO REGISTO</small><h3>Criar cliente</h3></div></div>
            <CustomerForm />
          </aside>
        )}
      </div>
    </DashboardShell>
  );
}

function UsersEmptyIcon() {
  return <span className="empty-icon" aria-hidden="true"><UserRound size={24} /></span>;
}
