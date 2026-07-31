"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function OpenTemplateForm() {
  const router = useRouter();
  const [id, setId] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (id.trim()) router.push(`/closing-templates/${id.trim()}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abrir modelo existente</CardTitle>
        <CardDescription>
          Ainda não há uma listagem de modelos — informe o ID do modelo para configurar suas etapas.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-2 pt-0">
          <Label htmlFor="templateId">ID do modelo</Label>
          <Input
            id="templateId"
            type="number"
            min={1}
            value={id}
            onChange={(event) => setId(event.target.value)}
            required
          />
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
