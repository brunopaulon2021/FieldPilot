import "server-only";

import { cache } from "react";
import { verifySession } from "@/lib/auth/session";

export type WorkspaceRole = "owner" | "admin" | "dispatcher" | "technician" | "customer";

export type WorkspaceContext = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: WorkspaceRole;
  supabase: NonNullable<Awaited<ReturnType<typeof verifySession>>>["supabase"];
  userId: string;
};

export const getCurrentWorkspace = cache(async (): Promise<WorkspaceContext | null> => {
  const session = await verifySession();
  if (!session) return null;

  const { data: membership, error: membershipError } = await session.supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) throw new Error("Could not load organization membership");
  if (!membership) return null;

  const { data: organization, error: organizationError } = await session.supabase
    .from("organizations")
    .select("name, slug")
    .eq("id", membership.organization_id)
    .single();

  if (organizationError || !organization) throw new Error("Could not load organization");

  return {
    organizationId: membership.organization_id,
    organizationName: organization.name,
    organizationSlug: organization.slug,
    role: membership.role as WorkspaceRole,
    supabase: session.supabase,
    userId: session.userId,
  };
});

export function canManageCustomers(role: WorkspaceRole): boolean {
  return role === "owner" || role === "admin" || role === "dispatcher";
}
