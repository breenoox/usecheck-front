"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { completeClosingStepAction } from "./actions";
import type { ClosingStatus, ClosingStep, TaxObligation } from "@/lib/types";
import { ClosingStatusBadge } from "@/components/data/ClosingStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddClosingStepDialog } from "./AddClosingStepDialog";

function computeStatus(steps: ClosingStep[]): ClosingStatus {
  if (steps.length === 0) return "PENDING";
  const completedCount = steps.filter((step) => step.completed).length;
  if (completedCount === 0) return "PENDING";
  if (completedCount === steps.length) return "COMPLETED";
  return "IN_PROGRESS";
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ClosingChecklistProps = {
  closingId: number;
  initialSteps: ClosingStep[];
  taxObligations: TaxObligation[];
};

export function ClosingChecklist({ closingId, initialSteps, taxObligations }: ClosingChecklistProps) {
  const [steps, setSteps] = useState(initialSteps);
  const status = useMemo(() => computeStatus(steps), [steps]);

  function upsertStep(step: ClosingStep) {
    setSteps((current) => {
      const exists = current.some((item) => item.id === step.id);
      return exists
        ? current.map((item) => (item.id === step.id ? step : item))
        : [...current, step];
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Status do fechamento</span>
          <ClosingStatusBadge status={status} />
        </div>
        <AddClosingStepDialog closingId={closingId} taxObligations={taxObligations} onAdded={upsertStep} />
      </div>
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Obrigação fiscal</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  Nenhuma etapa neste fechamento.
                </TableCell>
              </TableRow>
            ) : (
              steps.map((step) => (
                <StepRow key={step.id} step={step} onCompleted={upsertStep} />
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function StepRow({ step, onCompleted }: { step: ClosingStep; onCompleted: (step: ClosingStep) => void }) {
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      const result = await completeClosingStepAction(step.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.step) {
        onCompleted(result.step);
        toast.success(`${result.step.obligationNameSnapshot} marcada como entregue.`);
      }
    });
  }

  const completionDate = formatDate(step.completionDate);

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{step.obligationNameSnapshot}</TableCell>
      <TableCell>
        {step.mandatory ? (
          <Badge variant="outline">Obrigatória</Badge>
        ) : (
          <Badge variant="secondary">Avulsa</Badge>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {step.completed
          ? `${completionDate ?? "—"}${step.completedByUserId ? ` · usuário #${step.completedByUserId}` : ""}`
          : "—"}
      </TableCell>
      <TableCell className="text-right">
        {step.completed ? (
          <Badge variant="accent">
            <Check className="size-3" />
            Concluída
          </Badge>
        ) : (
          <Button variant="accent" size="sm" onClick={handleComplete} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Concluir
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
