"use client";

import { useActionState, useId } from "react";
import {
  createCustomerLocation,
  updateCustomerLocation,
  type CustomerActionState,
} from "@/app/app/customers/actions";

export type CustomerLocationFormInitial = {
  accessNotes: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  countryCode: string;
  isPrimary: boolean;
  name: string;
  postalCode: string;
  region: string;
};

const emptyLocation: CustomerLocationFormInitial = {
  accessNotes: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  countryCode: "PT",
  isPrimary: false,
  name: "",
  postalCode: "",
  region: "",
};

const initialState: CustomerActionState = { message: "", status: "idle" };

export function CustomerLocationForm({
  customerId,
  initial = emptyLocation,
  locationId,
}: {
  customerId: string;
  initial?: CustomerLocationFormInitial;
  locationId?: string;
}) {
  const action = locationId
    ? updateCustomerLocation.bind(null, customerId, locationId)
    : createCustomerLocation.bind(null, customerId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const countryHintId = useId();

  return (
    <form action={formAction} className="entity-form">
      <div className="form-grid">
        <label>Nome do local<input name="name" defaultValue={initial.name} required minLength={2} maxLength={120} placeholder="Sede, Loja do Porto…" /></label>
        <label>Morada<input name="addressLine1" defaultValue={initial.addressLine1} required minLength={3} maxLength={180} autoComplete="address-line1" /></label>
        <label>Complemento<input name="addressLine2" defaultValue={initial.addressLine2} minLength={2} maxLength={180} autoComplete="address-line2" /></label>
        <label>Código postal<input name="postalCode" defaultValue={initial.postalCode} required minLength={3} maxLength={20} autoComplete="postal-code" /></label>
        <label>Localidade<input name="city" defaultValue={initial.city} required minLength={2} maxLength={120} autoComplete="address-level2" /></label>
        <label>Distrito / Região<input name="region" defaultValue={initial.region} minLength={2} maxLength={120} autoComplete="address-level1" /></label>
        <label>País<input name="countryCode" defaultValue={initial.countryCode} required minLength={2} maxLength={2} pattern="[A-Za-z]{2}" aria-describedby={countryHintId} /></label>
        <label className="checkbox-label"><input name="isPrimary" type="checkbox" defaultChecked={initial.isPrimary} />Local principal</label>
      </div>
      <small id={countryHintId} className="field-hint">Código ISO com duas letras, por exemplo PT ou ES.</small>
      <label>Instruções de acesso<textarea name="accessNotes" defaultValue={initial.accessNotes} maxLength={1000} rows={3} placeholder="Portaria, contacto no local ou restrições de acesso." /></label>
      {state.status === "error" && <p className="form-message error" role="alert">{state.message}</p>}
      <button className="button entity-submit" type="submit" disabled={pending}>{pending ? "A guardar…" : locationId ? "Guardar local" : "Adicionar local"}</button>
    </form>
  );
}
