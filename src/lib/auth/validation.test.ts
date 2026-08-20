import { describe, expect, it } from "vitest";
import { slugifyOrganizationName } from "@/lib/auth/slug";
import { organizationSchema, signUpSchema } from "@/lib/auth/validation";

describe("auth validation", () => {
  it("requires a long password", () => {
    expect(signUpSchema.safeParse({ fullName: "Ana Silva", email: "ana@example.com", password: "short" }).success).toBe(false);
    expect(signUpSchema.safeParse({ fullName: "Ana Silva", email: "ana@example.com", password: "uma-frase-segura-2026" }).success).toBe(true);
  });

  it("normalizes Portuguese organization names into safe slugs", () => {
    expect(slugifyOrganizationName("  Assistência São João, Lda. ")).toBe("assistencia-sao-joao-lda");
  });

  it("rejects slugs that could escape their URL segment", () => {
    expect(organizationSchema.safeParse({ name: "Empresa A", slug: "../empresa" }).success).toBe(false);
    expect(organizationSchema.safeParse({ name: "Empresa A", slug: "empresa-a" }).success).toBe(true);
  });
});
