import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function SectionCard({
  id,
  title,
  actions,
  children,
  className,
  bodyClassName,
  ariaLabel,
}: {
  id?: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  ariaLabel?: string;
}) {
  return (
    <section id={id} aria-label={ariaLabel ?? title} className={cn("li-card scroll-mt-28", className)}>
      <div className="flex items-start justify-between gap-3 px-4 pt-5 sm:px-6">
        <h2 className="li-section-title">{title}</h2>
        {actions ? <div className="-mr-1 flex shrink-0 items-center gap-0.5">{actions}</div> : null}
      </div>
      <div className={cn("px-4 pb-5 pt-3 sm:px-6", bodyClassName)}>{children}</div>
    </section>
  );
}

export function MetaDot() {
  return (
    <span aria-hidden="true" className="px-1 text-ink-faint">
      ·
    </span>
  );
}
