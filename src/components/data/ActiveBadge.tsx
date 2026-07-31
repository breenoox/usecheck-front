import { Badge } from "@/components/ui/badge";

export function ActiveBadge({ active }: { active: boolean }) {
  return active ? <Badge variant="accent">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>;
}
