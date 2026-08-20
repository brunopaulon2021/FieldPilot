"use server";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { fieldValue, organizationSchema } from "@/lib/auth/validation";

export async function createOrganization(formData: FormData) {
  const result = organizationSchema.safeParse({
    name: fieldValue(formData, "name"),
    slug: fieldValue(formData, "slug"),
  });

  if (!result.success) redirect("/onboarding?error=invalid");

  const session = await verifySession();
  if (!session) redirect("/login?error=expired");

  const { error } = await session.supabase.from("organizations").insert({
    created_by: session.userId,
    name: result.data.name,
    slug: result.data.slug,
  });

  if (error?.code === "23505") redirect("/onboarding?error=organization_exists");
  if (error) redirect("/onboarding?error=generic");

  redirect("/app");
}
