import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgba(43,36,32,0.04)]",
        className
      )}
      {...rest}
    />
  );
}
