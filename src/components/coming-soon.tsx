import { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft text-espresso">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl text-espresso">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-taupe">{description}</p>
    </div>
  );
}
