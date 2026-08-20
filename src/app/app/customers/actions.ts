"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  customerFormValues,
  customerIdSchema,
  customerLocationSchema,
  customerSchema,
  locationFormValues,
} from "@/lib/customers/validation";
import { canManageCustomers, getCurrentWorkspace } from "@/lib/organizations/workspace";

export type CustomerActionState = {
  message: string;
  status: "idle" | "error";
};

function validationMessage(issues: { message: string }[]): CustomerActionState {
  return { message: issues[0]?.message ?? "Revise os dados e tente novamente.", status: "error" };
}

async function getManagementWorkspace() {
  const workspace = await getCurrentWorkspace();
  if (!workspace) redirect("/login?error=expired");
  return canManageCustomers(workspace.role) ? workspace : null;
}

export async function createCustomer(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const result = customerSchema.safeParse(customerFormValues(formData));
  if (!result.success) return validationMessage(result.error.issues);

  const workspace = await getManagementWorkspace();
  if (!workspace) return { message: "Não tem permissão para criar clientes.", status: "error" };

  const { data, error } = await workspace.supabase
    .from("customers")
    .insert({
      created_by: workspace.userId,
      display_name: result.data.displayName,
      email: result.data.email,
      kind: result.data.kind,
      legal_name: result.data.legalName,
      notes: result.data.notes,
      organization_id: workspace.organizationId,
      phone: result.data.phone,
      tax_id: result.data.taxId,
      updated_by: workspace.userId,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    return { message: "Já existe um cliente com esse identificador fiscal.", status: "error" };
  }
  if (error || !data) return { message: "Não foi possível criar o cliente.", status: "error" };

  revalidatePath("/app");
  revalidatePath("/app/customers");
  redirect(`/app/customers/${data.id}?created=1`);
}

export async function updateCustomer(
  customerId: string,
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsedId = customerIdSchema.safeParse(customerId);
  const result = customerSchema.safeParse(customerFormValues(formData));
  if (!parsedId.success || !result.success) {
    return validationMessage(result.success ? [{ message: "Cliente inválido." }] : result.error.issues);
  }

  const workspace = await getManagementWorkspace();
  if (!workspace) return { message: "Não tem permissão para editar clientes.", status: "error" };

  const { data, error } = await workspace.supabase
    .from("customers")
    .update({
      display_name: result.data.displayName,
      email: result.data.email,
      kind: result.data.kind,
      legal_name: result.data.legalName,
      notes: result.data.notes,
      phone: result.data.phone,
      tax_id: result.data.taxId,
      updated_by: workspace.userId,
    })
    .eq("organization_id", workspace.organizationId)
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error?.code === "23505") {
    return { message: "Já existe um cliente com esse identificador fiscal.", status: "error" };
  }
  if (error || !data) return { message: "Não foi possível atualizar o cliente.", status: "error" };

  revalidatePath("/app");
  revalidatePath("/app/customers");
  revalidatePath(`/app/customers/${parsedId.data}`);
  redirect(`/app/customers/${parsedId.data}?updated=1`);
}

export async function toggleCustomerArchive(customerId: string): Promise<void> {
  const parsedId = customerIdSchema.safeParse(customerId);
  if (!parsedId.success) return;

  const workspace = await getManagementWorkspace();
  if (!workspace) return;

  const { data: customer, error: readError } = await workspace.supabase
    .from("customers")
    .select("archived_at")
    .eq("organization_id", workspace.organizationId)
    .eq("id", parsedId.data)
    .maybeSingle();

  if (readError || !customer) return;

  const { error } = await workspace.supabase
    .from("customers")
    .update({ archived_at: customer.archived_at ? null : new Date().toISOString(), updated_by: workspace.userId })
    .eq("organization_id", workspace.organizationId)
    .eq("id", parsedId.data);

  if (error) return;

  revalidatePath("/app");
  revalidatePath("/app/customers");
  revalidatePath(`/app/customers/${parsedId.data}`);
}

export async function createCustomerLocation(
  customerId: string,
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsedId = customerIdSchema.safeParse(customerId);
  const result = customerLocationSchema.safeParse(locationFormValues(formData));
  if (!parsedId.success || !result.success) {
    return validationMessage(result.success ? [{ message: "Cliente inválido." }] : result.error.issues);
  }

  const workspace = await getManagementWorkspace();
  if (!workspace) return { message: "Não tem permissão para criar locais.", status: "error" };

  const { data: customer, error: customerError } = await workspace.supabase
    .from("customers")
    .select("id")
    .eq("organization_id", workspace.organizationId)
    .eq("id", parsedId.data)
    .maybeSingle();

  if (customerError || !customer) return { message: "Cliente não encontrado.", status: "error" };

  const { error } = await workspace.supabase.from("customer_locations").insert({
    access_notes: result.data.accessNotes,
    address_line_1: result.data.addressLine1,
    address_line_2: result.data.addressLine2,
    city: result.data.city,
    country_code: result.data.countryCode,
    created_by: workspace.userId,
    customer_id: customer.id,
    is_primary: result.data.isPrimary,
    name: result.data.name,
    organization_id: workspace.organizationId,
    postal_code: result.data.postalCode,
    region: result.data.region,
    updated_by: workspace.userId,
  });

  if (error) return { message: "Não foi possível criar o local.", status: "error" };

  revalidatePath("/app");
  revalidatePath("/app/customers");
  revalidatePath(`/app/customers/${parsedId.data}`);
  redirect(`/app/customers/${parsedId.data}?locationCreated=1`);
}

export async function updateCustomerLocation(
  customerId: string,
  locationId: string,
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsedCustomerId = customerIdSchema.safeParse(customerId);
  const parsedLocationId = customerIdSchema.safeParse(locationId);
  const result = customerLocationSchema.safeParse(locationFormValues(formData));
  if (!parsedCustomerId.success || !parsedLocationId.success || !result.success) {
    return validationMessage(result.success ? [{ message: "Local inválido." }] : result.error.issues);
  }

  const workspace = await getManagementWorkspace();
  if (!workspace) return { message: "Não tem permissão para editar locais.", status: "error" };

  const { data, error } = await workspace.supabase
    .from("customer_locations")
    .update({
      access_notes: result.data.accessNotes,
      address_line_1: result.data.addressLine1,
      address_line_2: result.data.addressLine2,
      city: result.data.city,
      country_code: result.data.countryCode,
      is_primary: result.data.isPrimary,
      name: result.data.name,
      postal_code: result.data.postalCode,
      region: result.data.region,
      updated_by: workspace.userId,
    })
    .eq("organization_id", workspace.organizationId)
    .eq("customer_id", parsedCustomerId.data)
    .eq("id", parsedLocationId.data)
    .select("id")
    .maybeSingle();

  if (error || !data) return { message: "Não foi possível atualizar o local.", status: "error" };

  revalidatePath("/app");
  revalidatePath("/app/customers");
  revalidatePath(`/app/customers/${parsedCustomerId.data}`);
  redirect(`/app/customers/${parsedCustomerId.data}?locationUpdated=1`);
}
