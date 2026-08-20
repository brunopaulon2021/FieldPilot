import { z } from "zod";

const email = z.string().trim().email("Introduza um email válido.").max(320);
const password = z.string().min(12, "A palavra-passe deve ter pelo menos 12 caracteres.").max(72);

export const loginSchema = z.object({ email, password: z.string().min(1, "Introduza a palavra-passe.") });

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Introduza o seu nome.").max(120),
  email,
  password,
});

export const recoverySchema = z.object({ email });
export const passwordSchema = z.object({ password });

export const organizationSchema = z.object({
  name: z.string().trim().min(2, "Introduza o nome da empresa.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "O identificador deve ter pelo menos 2 caracteres.")
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífenes."),
});

export function fieldValue(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}
