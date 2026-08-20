import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Archive, ArrowLeft, Building2, MapPin, RotateCcw } from "lucide-react";
import { toggleCustomerArchive } from "@/app/app/customers/actions";
import { CustomerForm } from "@/components/customer-form";
import { CustomerLocationForm } from "@/components/customer-location-form";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCustomer } from "@/lib/customers/data";
import { customerIdSchema } from "@/lib/customers/validation";
import { canManageCustomers, getCurrentWorkspace } from "@/lib/organizations/workspace";

export const metadata: Metadata = { title: "Detalhe do cliente" };

type Props = {
  params: Promise<{ customerId: string }>;
  searchParams: Promise<{ created?: string; locationCreated?: string; locationUpdated?: string; updated?: string }>;
};

export default async function CustomerPage({ params, searchParams }: Props) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) redirect("/onboarding");

  const { customerId } = await params;
  if (!customerIdSchema.safeParse(customerId).success) notFound();

  const customer = await getCustomer(customerId);
  if (!customer) notFound();

  const notices = await searchParams;
  const canManage = canManageCustomers(workspace.role);
  const archiveAction = toggleCustomerArchive.bind(null, customer.id);
  const notice = notices.created
    ? "Cliente criado. Adicione agora o primeiro local."
    : notices.locationCreated
      ? "Local criado com sucesso."
      : notices.locationUpdated
        ? "Local atualizado com sucesso."
        : notices.updated
          ? "Cliente atualizado com sucesso."
          : null;

  return (
    <DashboardShell active="customers" workspace={workspace}>
      <Link className="back-link" href="/app/customers"><ArrowLeft size={15} />Voltar aos clientes</Link>
      <div className="customer-detail-header">
        <div><span>{customer.kind === "company" ? "EMPRESA" : "PARTICULAR"}</span><h2>{customer.displayName}</h2><p>{customer.taxId ?? "Sem identificação fiscal"} · {customer.locations.length} {customer.locations.length === 1 ? "local" : "locais"}</p></div>
        {customer.archivedAt && <span className="status-badge archived">Cliente arquivado</span>}
      </div>
      {notice && <p className="form-message success customer-notice" role="status">{notice}</p>}

      <div className="customer-detail-grid">
        <section className="entity-form-panel">
          <div className="entity-panel-heading"><div><small>DADOS DO CLIENTE</small><h3>Informação geral</h3></div></div>
          {canManage ? (
            <CustomerForm customerId={customer.id} initial={{
              displayName: customer.displayName,
              email: customer.email ?? "",
              kind: customer.kind,
              legalName: customer.legalName ?? "",
              notes: customer.notes ?? "",
              phone: customer.phone ?? "",
              taxId: customer.taxId ?? "",
            }} />
          ) : (
            <dl className="customer-readonly"><div><dt>Email</dt><dd>{customer.email ?? "—"}</dd></div><div><dt>Telefone</dt><dd>{customer.phone ?? "—"}</dd></div><div><dt>Notas</dt><dd>{customer.notes ?? "—"}</dd></div></dl>
          )}
          {canManage && (
            <form action={archiveAction} className="archive-form"><button type="submit">{customer.archivedAt ? <RotateCcw size={15} /> : <Archive size={15} />}{customer.archivedAt ? "Reativar cliente" : "Arquivar cliente"}</button></form>
          )}
        </section>

        {canManage && (
          <section className="entity-form-panel">
            <div className="entity-panel-heading"><div><small>NOVO LOCAL</small><h3>Adicionar morada</h3></div><MapPin size={19} /></div>
            <CustomerLocationForm customerId={customer.id} />
          </section>
        )}
      </div>

      <section className="locations-section" aria-labelledby="locations-title">
        <div className="entity-panel-heading"><div><small>OPERAÇÃO NO TERRENO</small><h3 id="locations-title">Locais do cliente</h3></div><span>{customer.locations.length}</span></div>
        {customer.locations.length === 0 ? (
          <div className="empty-state compact"><span className="empty-icon"><MapPin size={23} /></span><h3>Sem locais registados</h3><p>Adicione a primeira morada para associar equipamentos e futuros pedidos.</p></div>
        ) : (
          <div className="location-list">
            {customer.locations.map((location) => (
              <details className="location-card" key={location.id}>
                <summary>
                  <span className="customer-avatar"><Building2 size={18} /></span>
                  <span><strong>{location.name}</strong><small>{location.addressLine1}, {location.postalCode} {location.city}</small></span>
                  {location.isPrimary && <span className="status-badge">Principal</span>}
                </summary>
                <div className="location-card-body">
                  <p>{location.addressLine2 ? `${location.addressLine2}, ` : ""}{location.region ? `${location.region}, ` : ""}{location.countryCode}</p>
                  {location.accessNotes && <p><strong>Acesso:</strong> {location.accessNotes}</p>}
                  {canManage && <CustomerLocationForm customerId={customer.id} locationId={location.id} initial={{
                    accessNotes: location.accessNotes ?? "",
                    addressLine1: location.addressLine1,
                    addressLine2: location.addressLine2 ?? "",
                    city: location.city,
                    countryCode: location.countryCode,
                    isPrimary: location.isPrimary,
                    name: location.name,
                    postalCode: location.postalCode,
                    region: location.region ?? "",
                  }} />}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
