import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Página {page} de {Math.max(totalPages, 1)}
      </p>
      <div className="flex gap-2">
        <PageLink href={`${basePath}?page=${page - 1}`} enabled={hasPrev}>
          <ChevronLeft className="size-4" />
          Anterior
        </PageLink>
        <PageLink href={`${basePath}?page=${page + 1}`} enabled={hasNext}>
          Próxima
          <ChevronRight className="size-4" />
        </PageLink>
      </div>
    </div>
  );
}

function PageLink({
  href,
  enabled,
  children,
}: {
  href: string;
  enabled: boolean;
  children: ReactNode;
}) {
  const className = cn(buttonVariants({ variant: "outline", size: "sm" }));

  if (!enabled) {
    return <span className={cn(className, "pointer-events-none opacity-50")}>{children}</span>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
