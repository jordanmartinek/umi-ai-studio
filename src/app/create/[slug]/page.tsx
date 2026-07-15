"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlueprint } from "@/lib/generators";
import { CONTENT_TYPES, ContentTypeMeta } from "@/lib/content-types";
import { FilterGroupControl } from "@/components/generator/filter-group";
import { PromptOutput } from "@/components/generator/prompt-output";
import { Button } from "@/components/ui/button";
import { PLATFORMS, Selections, GenerationMode, PlatformMeta, GeneratorBlueprint } from "@/lib/types";
import { loadOrSeedBrandProfile } from "@/lib/storage";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTemplate } from "@/lib/templates";

export default function CreatePage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const templateId = searchParams.get("template");
  const blueprint = getBlueprint(slug);
  const meta = CONTENT_TYPES.find((c) => c.slug === slug);
  const { dict } = useLocale();

  if (!blueprint || !meta) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-espresso">
          {dict.generatorPage.notBuiltTitle}
        </h1>
        <p className="mt-2 text-sm text-taupe">{dict.generatorPage.notBuiltDescription}</p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" /> {dict.generatorPage.back}
          </Button>
        </Link>
      </div>
    );
  }

  // Keying by slug+template forces a clean remount (fresh selections state)
  // whenever the user navigates to a different generator or a different
  // template for the same generator, even without a full page reload.
  return (
    <GeneratorForm
      key={`${slug}-${templateId ?? "blank"}`}
      blueprint={blueprint}
      meta={meta}
      templateId={templateId}
    />
  );
}

function GeneratorForm({
  blueprint,
  meta,
  templateId,
}: {
  blueprint: GeneratorBlueprint;
  meta: ContentTypeMeta;
  templateId: string | null;
}) {
  const { dict } = useLocale();

  const initialSelections = useMemo<Selections>(() => {
    if (!templateId) return {};
    const template = getTemplate(templateId);
    if (!template || template.generatorSlug !== blueprint.slug) return {};
    // Clone so edits in the form never mutate the shared template definition.
    return Object.fromEntries(
      Object.entries(template.selections).map(([key, values]) => [key, [...values]])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selections, setSelections] = useState<Selections>(initialSelections);
  const [results, setResults] = useState<Record<GenerationMode, string> | null>(null);

  const brand = useMemo(() => loadOrSeedBrandProfile(), []);

  function handleChange(groupId: string, values: string[]) {
    setSelections((prev) => ({ ...prev, [groupId]: values }));
  }

  let platform: PlatformMeta | undefined;
  if (blueprint.platformGroupId) {
    const platformGroup = blueprint.selectionGroups.find(
      (g) => g.id === blueprint.platformGroupId
    );
    const selectedPlatformId = platformGroup ? selections[platformGroup.id]?.[0] : undefined;
    platform = PLATFORMS.find((p) => p.id === selectedPlatformId) ?? PLATFORMS[0];
  }

  const requiredGroups = blueprint.selectionGroups.filter((g) => !g.optional);
  const canGenerate = requiredGroups.every((g) => (selections[g.id] ?? []).length > 0);

  function handleGenerate() {
    const composed = blueprint.compose({ selections, brand, platform });
    setResults(composed);
  }

  const copy = dict.contentTypes[meta.dictKey];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-taupe hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" /> {dict.generatorPage.back}
      </Link>

      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {copy.title} {dict.generatorPage.promptGeneratorSuffix}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">
          {copy.description}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          {blueprint.selectionGroups.map((group) => (
            <FilterGroupControl
              key={group.id}
              generatorSlug={blueprint.slug}
              group={group}
              selections={selections}
              onChange={handleChange}
            />
          ))}

          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full sm:w-auto"
          >
            {dict.generatorPage.generate}
          </Button>
          {!canGenerate ? (
            <p className="text-xs text-taupe">{dict.generatorPage.selectAllHint}</p>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PromptOutput results={results} sourceSlug={blueprint.slug} sourceLabel={copy.title} />
        </div>
      </div>
    </div>
  );
}
