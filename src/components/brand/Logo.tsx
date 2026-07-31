import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  monochrome?: boolean;
};

/** Icon-only mark: checklist lines + circular check, matching the usecheck brand sheet. */
export function LogoMark({ className, monochrome = false }: LogoMarkProps) {
  const navy = monochrome ? "#ffffff" : "#0d2b45";
  const green = monochrome ? "#ffffff" : "#28b463";
  const gray = monochrome ? "#ffffff" : "#64748b";

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="4" y1="20" x2="16" y2="20" stroke={gray} strokeWidth="4" strokeLinecap="round" />
      <line x1="4" y1="28" x2="14" y2="28" stroke={gray} strokeWidth="4" strokeLinecap="round" />
      <line x1="4" y1="36" x2="10" y2="36" stroke={green} strokeWidth="4" strokeLinecap="round" />
      <path
        d="M22 16a20 20 0 1 0 18-6"
        stroke={navy}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M23 32l8 8 14-16"
        stroke={green}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  monochrome?: boolean;
  tagline?: boolean;
};

export function Logo({ className, monochrome = false, tagline = false }: LogoProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2">
        <LogoMark monochrome={monochrome} />
        <span className="text-2xl font-bold tracking-tight">
          <span className={monochrome ? "text-white" : "text-brand-navy"}>use</span>
          <span className={monochrome ? "text-white/80" : "text-brand-green"}>check</span>
        </span>
      </div>
      {tagline ? (
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.2em]",
            monochrome ? "text-white/70" : "text-brand-gray"
          )}
        >
          Organize. Acompanhe. Conclua.
        </span>
      ) : null}
    </div>
  );
}
