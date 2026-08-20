import "server-only";

import { getCurrentWorkspace } from "@/lib/organizations/workspace";

export type CustomerListItem = {
  archivedAt: string | null;
  displayName: string;
  email: string | null;
  id: string;
  kind: "company" | "individual";
  locationCount: number;
  phone: string | null;
  primaryCity: string | null;
  taxId: string | null;
};

export type CustomerLocationDTO = {
  accessNotes: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  countryCode: string;
  id: string;
  isPrimary: boolean;
  name: string;
  postalCode: string;
  region: string | null;
};

export type CustomerDetailDTO = {
  archivedAt: string | null;
  displayName: string;
  email: string | null;
  id: string;
  kind: "company" | "individual";
  legalName: string | null;
  locations: CustomerLocationDTO[];
  notes: string | null;
  phone: string | null;
  taxId: string | null;
};

type CustomerRow = Omit<CustomerListItem, "locationCount" | "primaryCity">;
type LocationSummaryRow = { city: string; customer_id: string; is_primary: boolean };
type CustomerDetailRow = {
  archived_at: string | null;
  display_name: string;
  email: string | null;
  id: string;
  kind: CustomerDetailDTO["kind"];
  legal_name: string | null;
  notes: string | null;
  phone: string | null;
  tax_id: string | null;
};
type LocationRow = {
  access_notes: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  country_code: string;
  id: string;
  is_primary: boolean;
  name: string;
  postal_code: string;
  region: string | null;
};

function safeSearchPattern(value: string): string {
  return value.trim().slice(0, 80).replace(/[\\%_]/g, (character) => `\\${character}`);
}

export async function listCustomers(search = ""): Promise<CustomerListItem[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];

  let query = workspace.supabase
    .from("customers")
    .select("id, kind, display_name, tax_id, email, phone, archived_at")
    .eq("organization_id", workspace.organizationId)
    .order("display_name", { ascending: true })
    .limit(100);

  const pattern = safeSearchPattern(search);
  if (pattern) query = query.ilike("display_name", `%${pattern}%`);

  const { data, error } = await query;
  if (error) throw new Error("Could not load customers");

  const rows = (data ?? []).map((row) => ({
    archivedAt: row.archived_at,
    displayName: row.display_name,
    email: row.email,
    id: row.id,
    kind: row.kind as CustomerListItem["kind"],
    phone: row.phone,
    taxId: row.tax_id,
  })) satisfies CustomerRow[];

  if (rows.length === 0) return [];

  const { data: locationData, error: locationError } = await workspace.supabase
    .from("customer_locations")
    .select("customer_id, city, is_primary")
    .eq("organization_id", workspace.organizationId)
    .in("customer_id", rows.map((row) => row.id));

  if (locationError) throw new Error("Could not load customer locations");
  const locations = (locationData ?? []) as LocationSummaryRow[];
  const locationSummaries = new Map<string, { count: number; primaryCity: string | null }>();

  for (const location of locations) {
    const current = locationSummaries.get(location.customer_id) ?? { count: 0, primaryCity: null };
    locationSummaries.set(location.customer_id, {
      count: current.count + 1,
      primaryCity: location.is_primary || current.primaryCity === null ? location.city : current.primaryCity,
    });
  }

  return rows.map((row) => {
    const summary = locationSummaries.get(row.id);

    return {
      ...row,
      locationCount: summary?.count ?? 0,
      primaryCity: summary?.primaryCity ?? null,
    };
  });
}

export async function getCustomer(customerId: string): Promise<CustomerDetailDTO | null> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return null;

  const [{ data: customerData, error: customerError }, { data: locationData, error: locationError }] =
    await Promise.all([
      workspace.supabase
        .from("customers")
        .select("id, kind, display_name, legal_name, tax_id, email, phone, notes, archived_at")
        .eq("organization_id", workspace.organizationId)
        .eq("id", customerId)
        .maybeSingle(),
      workspace.supabase
        .from("customer_locations")
        .select("id, name, address_line_1, address_line_2, postal_code, city, region, country_code, access_notes, is_primary")
        .eq("organization_id", workspace.organizationId)
        .eq("customer_id", customerId)
        .order("is_primary", { ascending: false })
        .order("name", { ascending: true }),
    ]);

  if (customerError || locationError) throw new Error("Could not load customer");
  if (!customerData) return null;

  const customer = customerData as CustomerDetailRow;
  const locations = (locationData ?? []) as LocationRow[];

  return {
    archivedAt: customer.archived_at,
    displayName: customer.display_name,
    email: customer.email,
    id: customer.id,
    kind: customer.kind,
    legalName: customer.legal_name,
    locations: locations.map((location) => ({
      accessNotes: location.access_notes,
      addressLine1: location.address_line_1,
      addressLine2: location.address_line_2,
      city: location.city,
      countryCode: location.country_code,
      id: location.id,
      isPrimary: location.is_primary,
      name: location.name,
      postalCode: location.postal_code,
      region: location.region,
    })),
    notes: customer.notes,
    phone: customer.phone,
    taxId: customer.tax_id,
  };
}

export async function getCustomerCounts(): Promise<{ activeCustomers: number; locations: number }> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { activeCustomers: 0, locations: 0 };

  const [customersResult, locationsResult] = await Promise.all([
    workspace.supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", workspace.organizationId)
      .is("archived_at", null),
    workspace.supabase
      .from("customer_locations")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", workspace.organizationId),
  ]);

  if (customersResult.error || locationsResult.error) throw new Error("Could not load customer totals");

  return {
    activeCustomers: customersResult.count ?? 0,
    locations: locationsResult.count ?? 0,
  };
}
