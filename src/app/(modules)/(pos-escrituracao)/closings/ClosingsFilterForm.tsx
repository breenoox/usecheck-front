"use client";

import { Search } from "lucide-react";

import type { Company } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClosingsFilterFormProps = {
  companies: Company[];
  companyId?: string;
  month: string;
};

export function ClosingsFilterForm({ companies, companyId, month }: ClosingsFilterFormProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <form action="/closings" className="flex flex-wrap items-end gap-4">
          <div className="flex min-w-56 flex-1 flex-col gap-2">
            <Label htmlFor="companyId">Empresa</Label>
            <Select name="companyId" defaultValue={companyId}>
              <SelectTrigger id="companyId">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="month">Competência</Label>
            <Input id="month" name="month" type="month" defaultValue={month} required />
          </div>
          <Button type="submit" variant="accent">
            <Search className="size-4" />
            Buscar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
