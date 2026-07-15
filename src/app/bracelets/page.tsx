"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Layers } from "lucide-react";
import { FilterPanel } from "@/components/generator/filter-panel";
import { ConceptCard } from "@/components/bracelet/concept-card";
import { Button } from "@/components/ui/button";
import { Selections } from "@/lib/types";
import { braceletCategories, braceletGroups } from "@/lib/bracelet/taxonomy";
import { generateBraceletConcept } from "@/lib/bracelet/concept-generator";
import { BraceletConcept } from "@/lib/bracelet/types";
import { isConceptSaved, saveConcept } from "@/lib/bracelet/design-board-storage";
import { loadOrSeedBrandProfile } from "@/lib/storage";
import { useLocale } from "@/lib/i18n/locale-context";

const braceletBlueprint = { slug: "bracelet", selectionGroups: braceletGroups, categories: braceletCategories };

export default function BraceletsPage() {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const copy = dict.bracelets;

  const [selections, setSelections] = useState<Selections>({});
  const [seed, setSeed] = useState(0);
  const [concept, setConcept] = useState<BraceletConcept | null>(null);
  const [saved, setSaved] = useState(false);

  const brand = useMemo(() => loadOrSeedBrandProfile(locale), [locale]);

  function handleChange(groupId: string, values: string[]) {
    setSelections((prev) => ({ ...prev, [groupId]: values }));
  }

  function handleGenerate() {
    const next = generateBraceletConcept({ selections, brand, locale, seed });
    setConcept(next);
    setSaved(isConceptSaved(next.id));
  }

  function handleRegenerate() {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    const next = generateBraceletConcept({ selections, brand, locale, seed: nextSeed });
    setConcept(next);
    setSaved(isConceptSaved(next.id));
  }

  function handleSave() {
    if (!concept) return;
    saveConcept(concept);
    setSaved(true);
  }

  function handleLaunchPackage() {
    if (!concept) return;
    if (!saved) {
      saveConcept(concept);
      setSaved(true);
    }
    router.push(`/bracelets/launch/${concept.id}`);
  }

  function handleCollection() {
    router.push(`/bracelets/collection?${selectionsToQuery(selections)}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {copy.generator.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">{copy.generator.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">{copy.generator.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_460px]">
        <div className="space-y-6">
          <FilterPanel blueprint={braceletBlueprint} selections={selections} onChange={handleChange} />

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={handleGenerate}>
              <Sparkles className="h-4 w-4" />
              {copy.generator.generate}
            </Button>
            <Link href="/bracelets/design-board">
              <Button size="lg" variant="secondary">
                {dict.bracelets.designBoard.eyebrow}
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {concept ? (
            <div className="space-y-4">
              <ConceptCard
                concept={concept}
                actions={
                  <>
                    <Button variant="secondary" onClick={handleRegenerate}>
                      {copy.generator.regenerate}
                    </Button>
                    <Button variant={saved ? "secondary" : "primary"} onClick={handleSave} disabled={saved}>
                      {saved ? copy.generator.saved : copy.generator.save}
                    </Button>
                  </>
                }
              />
              <div className="flex flex-wrap gap-3">
                <Button className="flex-1" onClick={handleLaunchPackage}>
                  {copy.generator.generateLaunchPackage}
                </Button>
                <Button variant="secondary" className="flex-1" onClick={handleCollection}>
                  <Layers className="h-4 w-4" />
                  {copy.generator.generateCollection}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-espresso">
                <Sparkles className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="mx-auto max-w-xs text-sm text-taupe">{copy.generator.emptyHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Serializes Selections into a query string so the Collection Generator page
 *  can start from the same filters the user already picked here. */
function selectionsToQuery(selections: Selections): string {
  const params = new URLSearchParams();
  for (const [groupId, values] of Object.entries(selections)) {
    if (values.length) params.set(groupId, values.join(","));
  }
  return params.toString();
}
