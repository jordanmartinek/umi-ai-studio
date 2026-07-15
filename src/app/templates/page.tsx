"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useLocale } from "@/lib/i18n/locale-context";
import { CONTENT_TYPES } from "@/lib/content-types";
import { TEMPLATE_CATEGORIES, TemplateCategory, getTemplatesByCategory } from "@/lib/templates";

export default function TemplatesPage() {
  const { dict } = useLocale();
  const [category, setCategory] = useState<TemplateCategory | "all">("all");

  const templates = useMemo(() => getTemplatesByCategory(category), [category]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-2xl">
        <div className="storybook-border mb-4 flex h-11 w-11 items-center justify-center bg-gold-soft text-espresso">
          <LayoutTemplate className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {dict.templateGallery.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">
          {dict.templateGallery.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">
          {dict.templateGallery.subtitle}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Chip selected={category === "all"} onClick={() => setCategory("all")}>
          {dict.templateGallery.categoryAll}
        </Chip>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <Chip key={cat} selected={category === cat} onClick={() => setCategory(cat)}>
            {dict.templateGallery.categories[cat]}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const copy = dict.templateGallery.items[template.id as keyof typeof dict.templateGallery.items];
          const contentType = CONTENT_TYPES.find((c) => c.slug === template.generatorSlug);
          const generatorLabel = contentType ? dict.contentTypes[contentType.dictKey].title : "";

          return (
            <Link
              key={template.id}
              href={`/create/${template.generatorSlug}?template=${template.id}`}
              className="block h-full"
            >
              <Card className="group flex h-full flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
                <div>
                  <span className="mb-3 inline-block rounded-full bg-bone px-2.5 py-1 text-xs font-medium text-taupe">
                    {dict.templateGallery.categories[template.category]}
                  </span>
                  <h3 className="font-display text-lg text-espresso">{copy?.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-taupe">
                    {copy?.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-medium text-taupe">
                    {dict.templateGallery.opensIn.replace("{generator}", generatorLabel)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-espresso group-hover:gap-2.5 transition-all">
                    {dict.templateGallery.useTemplate}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
