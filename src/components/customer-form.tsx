"use client";

import { useActionState } from "react";
import { createCustomer, updateCustomer, type CustomerActionState } from "@/app/app/customers/actions";

export type CustomerFormInitial = {
  displayName: string;
  email: string;
  kind: "company" | "individual";
  legalName: string;
  notes: string;
  phone: string;
  taxId: string;
};

const emptyCustomer: CustomerFormInitial = {
  displayName: "",
  email: "",
  kind: "company",
  legalName: "",
  notes: "",
  phone: "",
  taxId: "",
};

const initialState: CustomerActionState = { message: "", status: "idle" };

export function CustomerForm({
  customerId,
  initial = emptyCustomer,
}: {
  customerId?: string;
  initial?: CustomerFormInitial;
}) {
  const action = customerId ? updateCustomer.bind(null, customerId) : createCustomer;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="entity-form">
      <div className="form-grid">
        <label>Tipo de cliente<select name="kind" defaultValue={initial.kind}><option value="company">Empresa</option><option value="individual">Particular</option></select></label>
        <label>Nome do cliente<input name="displayName" defaultValue={initial.displayName} required minLength={2} maxLength={160} autoComplete="organization" /></label>
        <label>Nome legal<input name="legalName" defaultValue={initial.legalName} minLength={2} maxLength={160} /></label>
        <label>NIF / Identificação fiscal<input name="taxId" defaultValue={initial.taxId} minLength={3} maxLength={32} autoComplete="off" /></label>
        <label>Email<input name="email" defaultValue={initial.email} type="email" maxLength={320} autoComplete="email" /></label>
        <label>Telefone<input name="phone" defaultValue={initial.phone} type="tel" minLength={6} maxLength={40} autoComplete="tel" /></label>
      </div>
      <label>Notas<textarea name="notes" defaultValue={initial.notes} maxLength={2000} rows={4} /></label>
      {state.status === "error" && <p className="form-message error" role="alert">{state.message}</p>}
      <button className="button entity-submit" type="submit" disabled={pending}>{pending ? "A guardar…" : customerId ? "Guardar alterações" : "Criar cliente"}</button>
    </form>
  );
}
