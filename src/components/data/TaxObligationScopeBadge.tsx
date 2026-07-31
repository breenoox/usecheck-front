import { Badge } from "@/components/ui/badge";
import type { TaxObligationScope } from "@/lib/types";

const LABELS: Record<TaxObligationScope, string> = {
  FEDERAL: "Federal",
  STATE: "Estadual",
  MUNICIPAL: "Municipal",
};

export function TaxObligationScopeBadge({ scope }: { scope: TaxObligationScope }) {
  return <Badge variant="outline">{LABELS[scope]}</Badge>;
}
