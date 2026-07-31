import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
};

export function PageHeader({ title, description, newHref, newLabel = "Novo" }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {newHref ? (
        <Button asChild variant="accent">
          <Link href={newHref}>
            <Plus className="size-4" />
            {newLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
