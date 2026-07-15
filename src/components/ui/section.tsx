import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function SectionLabel({
  children,
  helper,
  className,
}: {
  children: ReactNode;
  helper?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-3", className)}>
      <h3 className="text-sm font-semibold tracking-wide text-espresso">{children}</h3>
      {helper ? <p className="mt-0.5 text-xs text-taupe">{helper}</p> : null}
    </div>
  );
}
