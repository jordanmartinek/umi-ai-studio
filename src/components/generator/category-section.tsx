"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  helper?: string;
  defaultOpen?: boolean;
  /** Number of active selections inside this category, shown as a small badge. */
  activeCount?: number;
  children: ReactNode;
}

/** A collapsible section used to group related filter controls (Lightroom/Figma-style panel). */
export function CategorySection({ label, helper, defaultOpen, activeCount, children }: Props) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <div className="rounded-2xl border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-espresso">{label}</span>
          {activeCount ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-soft px-1.5 text-[11px] font-semibold text-espresso">
              {activeCount}
            </span>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-taupe transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <div className="space-y-6 border-t border-line px-4 py-5">
          {helper ? <p className="-mt-1 text-xs text-taupe">{helper}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
