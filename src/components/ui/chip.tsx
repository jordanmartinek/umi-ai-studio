import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.97]",
        selected
          ? "border-gold bg-espresso text-cream shadow-sm"
          : "border-line bg-white text-taupe hover:border-taupe-light hover:text-espresso",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
