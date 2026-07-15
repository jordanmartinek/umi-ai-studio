import { cn } from "@/lib/utils";

/**
 * A soft, repeating wave silhouette — a small, consistent nod to the ocean
 * theme used beneath the header and above the footer. Purely decorative.
 */
export function WaveDivider({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      className={cn("wave-divider", flip && "rotate-180", className)}
      aria-hidden="true"
    >
      <path
        d="M0 7c10 6 20 6 30 0s20-6 30 0 20 6 30 0 20-6 30 0 20 6 30 0 20-6 30 0 20 6 30 0 20-6 30 0 20 6 30 0v7H0z"
        fill="currentColor"
      />
    </svg>
  );
}
