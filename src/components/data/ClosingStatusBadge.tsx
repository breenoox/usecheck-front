import { Badge } from "@/components/ui/badge";
import type { ClosingStatus } from "@/lib/types";

const LABELS: Record<ClosingStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

export function ClosingStatusBadge({ status }: { status: ClosingStatus }) {
  if (status === "COMPLETED") return <Badge variant="accent">{LABELS[status]}</Badge>;
  if (status === "IN_PROGRESS") return <Badge variant="warning">{LABELS[status]}</Badge>;
  return <Badge variant="secondary">{LABELS[status]}</Badge>;
}
