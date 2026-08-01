export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  active: boolean;
  permissionId: number;
};

export type Organization = {
  id: number;
  name: string;
  active: boolean;
};

export type Company = {
  id: number;
  organizationId: number;
  businessName: string;
  companyName: string;
  cnpj: string;
  active: boolean;
};

export type TaxObligationScope = "FEDERAL" | "STATE" | "MUNICIPAL";

export type TaxObligation = {
  id: number;
  name: string;
  scope: TaxObligationScope;
};

export type ClosingTemplate = {
  id: number;
  organizationId: number;
  name: string;
  active: boolean;
};

/** Lightweight shape returned by the `/closing-templates` list endpoint, used to populate selects. */
export type ClosingTemplateSummary = {
  id: number;
  name: string;
};

export type ClosingTemplateStep = {
  id: number;
  taxObligationId: number;
  obligationName: string;
  priority: number;
};

export type ClosingTemplateBinding = {
  companyId: number;
  closingTemplateId: number;
};

export type ClosingStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type ClosingStep = {
  id: number;
  closingId: number;
  taxObligationId: number;
  obligationNameSnapshot: string;
  mandatory: boolean;
  completed: boolean;
  completionDate: string | null;
  completedByUserId: number | null;
};

export type Closing = {
  id: number;
  companyId: number;
  closingTemplateId: number;
  referenceMonth: string;
  status: ClosingStatus;
  steps: ClosingStep[];
};
