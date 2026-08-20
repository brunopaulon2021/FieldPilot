import { describe, expect, it } from "vitest";
import { customerIdSchema, customerLocationSchema, customerSchema } from "@/lib/customers/validation";

describe("customer validation", () => {
  it("normalizes optional customer fields without inventing data", () => {
    const result = customerSchema.parse({
      displayName: "  Oficina Central  ",
      email: "  OPERACOES@EXAMPLE.COM ",
      kind: "company",
      legalName: "",
      notes: "",
      phone: "+351 210 000 000",
      taxId: " pt 501234567 ",
    });

    expect(result).toEqual({
      displayName: "Oficina Central",
      email: "operacoes@example.com",
      kind: "company",
      legalName: null,
      notes: null,
      phone: "+351 210 000 000",
      taxId: "PT 501234567",
    });
  });

  it("rejects malformed contact details", () => {
    const result = customerSchema.safeParse({
      displayName: "A",
      email: "email-invalido",
      kind: "company",
      legalName: "",
      notes: "",
      phone: "abc",
      taxId: "1",
    });

    expect(result.success).toBe(false);
  });

  it("validates locations and normalizes the country code", () => {
    const result = customerLocationSchema.parse({
      accessNotes: "",
      addressLine1: "Rua do Campo, 10",
      addressLine2: "",
      city: "Lisboa",
      countryCode: "pt",
      isPrimary: true,
      name: "Sede",
      postalCode: "1000-100",
      region: "Lisboa",
    });

    expect(result.countryCode).toBe("PT");
    expect(result.addressLine2).toBeNull();
    expect(result.accessNotes).toBeNull();
  });

  it("accepts only UUID customer identifiers", () => {
    expect(customerIdSchema.safeParse("a0000000-0000-4000-8000-000000000001").success).toBe(true);
    expect(customerIdSchema.safeParse("../outro-cliente").success).toBe(false);
  });
});
