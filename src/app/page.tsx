"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";

// A gentle rotation of ocean-pastel accent tints (coral, seafoam, seagrass)
// for content-type icon badges, so the grid feels painterly rather than
// uniform — like sea glass along a Ghibli-seaside shoreline.
const ICON_ACCENTS = ["bg-gold-soft", "bg-sky-soft", "bg-forest-soft"];

export default function Home() {
  const { dict } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-14 max-w-2xl">
        <p className="mb-3 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {dict.home.eyebrow}
        </p>
        <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
          {dict.home.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-taupe">{dict.home.subtitle}</p>
      </div>

      <Link href="/bracelets" className="mb-12 block">
        <Card className="storybook-border group relative flex flex-col justify-between gap-6 overflow-hidden border-gold bg-gold-soft/30 p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-espresso text-cream">
              <Sparkles className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div>
              <p className="mb-1 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {dict.bracelets.hero.eyebrow}
              </p>
              <h2 className="font-display text-2xl text-espresso sm:text-3xl">
                {dict.bracelets.hero.title}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-taupe">
                {dict.bracelets.hero.subtitle}
              </p>
            </div>
          </div>
          <Button size="lg" className="shrink-0">
            {dict.home.create}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Card>
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_TYPES.map((type, index) => {
          const Icon = type.icon;
          const copy = dict.contentTypes[type.dictKey];
          const iconBg = ICON_ACCENTS[index % ICON_ACCENTS.length];
          const content = (
            <Card
              className={cn(
                "storybook-border group relative flex h-full flex-col justify-between p-6 transition-all duration-200",
                type.live
                  ? "cursor-pointer hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
                  : "opacity-70"
              )}
            >
              <div>
                <div
                  className={cn(
                    "mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-espresso",
                    iconBg
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl text-espresso">{copy.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-taupe">
                  {copy.description}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                {type.live ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-espresso group-hover:gap-2.5 transition-all">
                    {dict.home.create}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                ) : (
                  <span className="rounded-full bg-bone px-2.5 py-1 text-xs font-medium text-taupe">
                    {dict.home.comingSoon}
                  </span>
                )}
              </div>
            </Card>
          );

          return type.live ? (
            <Link key={type.slug} href={`/create/${type.slug}`} className="block h-full">
              {content}
            </Link>
          ) : (
            <div key={type.slug} className="h-full">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
