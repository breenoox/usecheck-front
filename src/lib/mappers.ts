import type {
  Closing,
  ClosingStep,
  ClosingTemplate,
  ClosingTemplateBinding,
  ClosingTemplateStep,
  ClosingTemplateSummary,
  Company,
  Organization,
  TaxObligation,
  User,
} from "@/lib/types";

/**
 * The backend accepts camelCase in request bodies but serializes responses
 * in snake_case (e.g. `permission_id`, `organization_id`, `business_name`).
 * These mappers normalize responses into the camelCase shape used by the UI.
 */

type Raw = Record<string, unknown>;

export function mapUser(raw: Raw): User {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    surname: String(raw.surname ?? ""),
    email: String(raw.email ?? ""),
    active: Boolean(raw.active),
    permissionId: Number(raw.permission_id ?? raw.permissionId ?? 0),
  };
}

export function mapOrganization(raw: Raw): Organization {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    active: Boolean(raw.active),
  };
}

export function mapCompany(raw: Raw): Company {
  return {
    id: Number(raw.id),
    organizationId: Number(raw.organization_id ?? raw.organizationId ?? 0),
    businessName: String(raw.business_name ?? raw.businessName ?? ""),
    companyName: String(raw.company_name ?? raw.companyName ?? ""),
    cnpj: String(raw.cnpj ?? ""),
    active: Boolean(raw.active),
  };
}

export function mapTaxObligation(raw: Raw): TaxObligation {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    scope: (raw.scope as TaxObligation["scope"]) ?? "FEDERAL",
  };
}

export function mapClosingTemplate(raw: Raw): ClosingTemplate {
  return {
    id: Number(raw.id),
    organizationId: Number(raw.organization_id ?? raw.organizationId ?? 0),
    name: String(raw.name ?? ""),
    active: Boolean(raw.active),
  };
}

export function mapClosingTemplateSummary(raw: Raw): ClosingTemplateSummary {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
  };
}

export function mapClosingTemplateStep(raw: Raw): ClosingTemplateStep {
  return {
    id: Number(raw.id),
    taxObligationId: Number(raw.tax_obligation_id ?? raw.taxObligationId ?? 0),
    obligationName: String(raw.obligation_name ?? raw.obligationName ?? ""),
    priority: Number(raw.priority ?? 0),
  };
}

export function mapClosingTemplateBinding(raw: Raw): ClosingTemplateBinding {
  return {
    companyId: Number(raw.company_id ?? raw.companyId ?? 0),
    closingTemplateId: Number(raw.closing_template_id ?? raw.closingTemplateId ?? 0),
  };
}

export function mapClosingStep(raw: Raw): ClosingStep {
  return {
    id: Number(raw.id),
    closingId: Number(raw.closing_id ?? raw.closingId ?? 0),
    taxObligationId: Number(raw.tax_obligation_id ?? raw.taxObligationId ?? 0),
    obligationNameSnapshot: String(
      raw.obligation_name_snapshot ?? raw.obligationNameSnapshot ?? ""
    ),
    mandatory: Boolean(raw.mandatory),
    completed: Boolean(raw.completed),
    completionDate: (raw.completion_date ?? raw.completionDate ?? null) as string | null,
    completedByUserId:
      raw.completed_by_user_id != null || raw.completedByUserId != null
        ? Number(raw.completed_by_user_id ?? raw.completedByUserId)
        : null,
  };
}

export function mapClosing(raw: Raw): Closing {
  const stepsRaw = Array.isArray(raw.steps) ? raw.steps : [];
  return {
    id: Number(raw.id),
    companyId: Number(raw.company_id ?? raw.companyId ?? 0),
    closingTemplateId: Number(raw.closing_template_id ?? raw.closingTemplateId ?? 0),
    referenceMonth: String(raw.reference_month ?? raw.referenceMonth ?? ""),
    status: (raw.status as Closing["status"]) ?? "PENDING",
    steps: stepsRaw.map((step) => mapClosingStep(step as Raw)),
  };
}
