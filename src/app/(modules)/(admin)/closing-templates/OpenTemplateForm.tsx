"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import type { ClosingTemplateSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OpenTemplateFormProps = {
  templates: ClosingTemplateSummary[];
};

export function OpenTemplateForm({ templates }: OpenTemplateFormProps) {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = new FormData(event.currentTarget).get("templateId");
    if (id) router.push(`/closing-templates/${id}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abrir modelo existente</CardTitle>
        <CardDescription>Selecione um modelo cadastrado para configurar suas etapas.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-2 pt-0">
          <Label htmlFor="templateId">Modelo de fechamento</Label>
          <Select name="templateId" required>
            <SelectTrigger id="templateId">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={String(template.id)}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" variant="outline">
            Abrir
            <ArrowRight className="size-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
