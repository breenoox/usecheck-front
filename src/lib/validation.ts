import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
  .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
  .regex(/[0-9]/, "A senha deve conter ao menos um número")
  .regex(/[^a-zA-Z0-9]/, "A senha deve conter ao menos um caractere especial");

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

const userBaseSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  surname: z.string().trim().min(1, "Informe o sobrenome"),
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
  active: z.coerce.boolean(),
  permissionId: z.coerce.number().int().positive("Informe uma permissão válida"),
});

export const userCreateSchema = userBaseSchema.extend({
  password: passwordSchema,
});

// The backend requires `password` on every update call (PUT /users/{id}
// fails without it), so there's no "leave blank to keep" option here.
export const userUpdateSchema = userBaseSchema.extend({
  password: passwordSchema,
});

export const organizationCreateSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da organização"),
});

export const organizationUpdateSchema = organizationCreateSchema.extend({
  active: z.coerce.boolean(),
});

const cnpjSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(z.string().length(14, "CNPJ deve conter 14 dígitos"));

export const companyCreateSchema = z.object({
  organizationId: z.coerce.number().int().positive("Informe a organização"),
  businessName: z.string().trim().min(1, "Informe a razão social"),
  companyName: z.string().trim().min(1, "Informe o nome fantasia"),
  cnpj: cnpjSchema,
  active: z.coerce.boolean(),
});

export const companyUpdateSchema = z.object({
  businessName: z.string().trim().min(1, "Informe a razão social"),
  companyName: z.string().trim().min(1, "Informe o nome fantasia"),
  cnpj: cnpjSchema,
  active: z.coerce.boolean(),
});

export const closingTemplateCreateSchema = z.object({
  organizationId: z.coerce.number().int().positive("Informe a organização"),
  name: z.string().trim().min(1, "Informe o nome do modelo"),
});

export const closingTemplateStepCreateSchema = z.object({
  taxObligationId: z.coerce.number().int().positive("Selecione a obrigação fiscal"),
  priority: z.coerce.number().int().positive("Informe uma prioridade válida"),
});

export const closingTemplateBindingSchema = z.object({
  closingTemplateId: z.coerce.number().int().positive("Informe o ID do modelo de fechamento"),
});

export const closingStepCreateSchema = z.object({
  taxObligationId: z.coerce.number().int().positive("Selecione a obrigação fiscal"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;
export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
export type ClosingTemplateCreateInput = z.infer<typeof closingTemplateCreateSchema>;
export type ClosingTemplateStepCreateInput = z.infer<typeof closingTemplateStepCreateSchema>;
export type ClosingTemplateBindingInput = z.infer<typeof closingTemplateBindingSchema>;
export type ClosingStepCreateInput = z.infer<typeof closingStepCreateSchema>;
