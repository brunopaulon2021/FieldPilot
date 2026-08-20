import { z } from "zod";

const nullableText = (minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value, context) => {
      if (!value) return null;
      if (value.length < minimum) {
        context.addIssue({ code: "custom", message: `Use pelo menos ${minimum} caracteres.` });
        return z.NEVER;
      }
      return value;
    });

const optionalEmail = z
  .string()
  .trim()
  .max(320)
  .transform((value) => value.toLowerCase())
  .pipe(z.union([z.literal(""), z.email("Introduza um email válido.")]))
  .transform((value) => value || null);

const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .refine((value) => !value || /^[0-9+().\s-]{6,40}$/.test(value), "Introduza um telefone válido.")
  .transform((value) => value || null);

export const customerIdSchema = z.uuid();

export const customerSchema = z.object({
  kind: z.enum(["company", "individual"]),
  displayName: z.string().trim().min(2, "Introduza o nome do cliente.").max(160),
  legalName: nullableText(2, 160),
  taxId: z
    .string()
    .trim()
    .max(32)
    .transform((value) => value.toUpperCase().replace(/\s+/g, " "))
    .refine((value) => !value || value.length >= 3, "Introduza um identificador fiscal válido.")
    .transform((value) => value || null),
  email: optionalEmail,
  phone: optionalPhone,
  notes: z.string().trim().max(2000).transform((value) => value || null),
});

export const customerLocationSchema = z.object({
  name: z.string().trim().min(2, "Introduza o nome do local.").max(120),
  addressLine1: z.string().trim().min(3, "Introduza a morada.").max(180),
  addressLine2: nullableText(2, 180),
  postalCode: z.string().trim().min(3, "Introduza o código postal.").max(20),
  city: z.string().trim().min(2, "Introduza a localidade.").max(120),
  region: nullableText(2, 120),
  countryCode: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "Use um código de país com duas letras."),
  accessNotes: z.string().trim().max(1000).transform((value) => value || null),
  isPrimary: z.boolean(),
});

export function customerFormValues(formData: FormData) {
  return {
    kind: formData.get("kind"),
    displayName: formData.get("displayName"),
    legalName: formData.get("legalName"),
    taxId: formData.get("taxId"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
  };
}

export function locationFormValues(formData: FormData) {
  return {
    name: formData.get("name"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    region: formData.get("region"),
    countryCode: formData.get("countryCode"),
    accessNotes: formData.get("accessNotes"),
    isPrimary: formData.get("isPrimary") === "on",
  };
}
