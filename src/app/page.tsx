"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";

export default function Home() {
  const { dict } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-14 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {dict.home.eyebrow}
        </p>
        <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
          {dict.home.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-taupe">{dict.home.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const copy = dict.contentTypes[type.dictKey];
          const content = (
            <Card
              className={cn(
                "group relative flex h-full flex-col justify-between p-6 transition-all duration-200",
                type.live
                  ? "cursor-pointer hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
                  : "opacity-70"
              )}
            >
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-espresso">
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
