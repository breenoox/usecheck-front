"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { addClosingStepAction } from "./actions";
import type { ClosingStep, TaxObligation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AddClosingStepDialogProps = {
  closingId: number;
  taxObligations: TaxObligation[];
  onAdded: (step: ClosingStep) => void;
};

export function AddClosingStepDialog({ closingId, taxObligations, onAdded }: AddClosingStepDialogProps) {
  const [open, setOpen] = useState(false);
  const [taxObligationId, setTaxObligationId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!taxObligationId) return;
    startTransition(async () => {
      const result = await addClosingStepAction(closingId, Number(taxObligationId));
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.step) {
        onAdded(result.step);
        toast.success("Etapa adicionada ao fechamento deste mês.");
        setOpen(false);
        setTaxObligationId("");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" />
          Adicionar etapa avulsa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar etapa avulsa</DialogTitle>
          <DialogDescription>
            Etapa específica para este mês — não entra no modelo recorrente da empresa.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="taxObligationId">Obrigação fiscal</Label>
          <Select value={taxObligationId} onValueChange={setTaxObligationId}>
            <SelectTrigger id="taxObligationId">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {taxObligations.map((obligation) => (
                <SelectItem key={obligation.id} value={String(obligation.id)}>
                  {obligation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="accent"
            onClick={handleSubmit}
            disabled={isPending || !taxObligationId}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
