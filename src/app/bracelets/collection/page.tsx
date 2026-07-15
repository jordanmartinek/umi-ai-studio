"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { FilterPanel } from "@/components/generator/filter-panel";
import { ConceptCard } from "@/components/bracelet/concept-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Selections } from "@/lib/types";
import { braceletCategories, braceletGroups } from "@/lib/bracelet/taxonomy";
import { generateBraceletCollection } from "@/lib/bracelet/collection-generator";
import { BraceletCollection } from "@/lib/bracelet/types";
import { isCollectionSaved, saveCollection, saveConcept } from "@/lib/bracelet/design-board-storage";
import { loadOrSeedBrandProfile } from "@/lib/storage";
import { useLocale } from "@/lib/i18n/locale-context";

const braceletBlueprint = { slug: "bracelet", selectionGroups: braceletGroups, categories: braceletCategories };

function selectionsFromQuery(searchParams: URLSearchParams): Selections {
  const selections: Selections = {};
  for (const group of braceletGroups) {
    const raw = searchParams.get(group.id);
    if (raw) selections[group.id] = raw.split(",").filter(Boolean);
  }
  return selections;
}

export default function CollectionGeneratorPage() {
  return (
    <Suspense>
      <CollectionGeneratorForm />
    </Suspense>
  );
}

function CollectionGeneratorForm() {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = dict.bracelets.collectionGen;

  const [selections, setSelections] = useState<Selections>(() => selectionsFromQuery(searchParams));
  const [pieceCount, setPieceCount] = useState(10);
  const [seed, setSeed] = useState(0);
  const [collection, setCollection] = useState<BraceletCollection | null>(null);
  const [saved, setSaved] = useState(false);

  const brand = useMemo(() => loadOrSeedBrandProfile(locale), [locale]);

  function handleChange(groupId: string, values: string[]) {
    setSelections((prev) => ({ ...prev, [groupId]: values }));
  }

  function handleGenerate() {
    const next = generateBraceletCollection({ selections, brand, locale, seed, pieceCount });
    setCollection(next);
    setSaved(isCollectionSaved(next.id));
  }

  function handleRegenerate() {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    const next = generateBraceletCollection({ selections, brand, locale, seed: nextSeed, pieceCount });
    setCollection(next);
    setSaved(isCollectionSaved(next.id));
  }

  function handleSave() {
    if (!collection) return;
    saveCollection(collection);
    setSaved(true);
  }

  function handleLaunchPackage(pieceId: string) {
    if (!collection) return;
    // Save the collection (if not already saved) and the individual piece
    // as a standalone concept, so the Launch Package page — which looks up
    // concepts by id in the Design Board's concepts store — can find it.
    if (!saved) {
      saveCollection(collection);
      setSaved(true);
    }
    const piece = collection.pieces.find((p) => p.id === pieceId);
    if (piece) saveConcept(piece);
    router.push(`/bracelets/launch/${pieceId}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/bracelets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-taupe hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" /> {copy.backToGenerator}
      </Link>

      <div className="mb-10 max-w-2xl">
        <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {copy.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">{copy.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <FilterPanel blueprint={braceletBlueprint} selections={selections} onChange={handleChange} />

          <div className="rounded-2xl border border-line bg-white p-4">
            <label className="mb-2 block text-sm font-semibold text-espresso" htmlFor="piece-count">
              {copy.pieceCountLabel}: {pieceCount}
            </label>
            <input
              id="piece-count"
              type="range"
              min={8}
              max={15}
              step={1}
              value={pieceCount}
              onChange={(e) => setPieceCount(Number(e.target.value))}
              className="w-full accent-espresso"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={collection ? handleRegenerate : handleGenerate}>
              <Sparkles className="h-4 w-4" />
              {collection ? copy.regenerate : copy.generate}
            </Button>
            {collection ? (
              <Button size="lg" variant={saved ? "secondary" : "primary"} onClick={handleSave} disabled={saved}>
                {saved ? copy.saved : copy.save}
              </Button>
            ) : null}
          </div>
        </div>

        <div>
          {collection ? (
            <div className="space-y-6">
              <Card className="p-6">
                <p className="mb-1 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {copy.summaryTitle}
                </p>
                <h2 className="font-display text-2xl text-espresso">{collection.collectionName}</h2>
                <p className="mt-2 text-sm leading-relaxed text-taupe">{collection.story}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-taupe">
                      {dict.bracelets.conceptCard.themeLabel}
                    </div>
                    <div className="text-espresso">{collection.theme}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-taupe">
                      {dict.bracelets.conceptCard.colorPaletteLabel}
                    </div>
                    <div className="text-espresso">{collection.colorPalette}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-taupe">
                      {dict.bracelets.conceptCard.moodLabel}
                    </div>
                    <div className="text-espresso">{collection.aesthetic}</div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                {collection.pieces.map((piece, index) => (
                  <div key={piece.id}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-taupe">
                      {copy.pieceLabel} {index + 1}
                    </p>
                    <ConceptCard
                      concept={piece}
                      actions={
                        <Button variant="secondary" onClick={() => handleLaunchPackage(piece.id)}>
                          {copy.viewLaunchPackage}
                        </Button>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-espresso">
                <Sparkles className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="mx-auto max-w-xs text-sm text-taupe">{copy.emptyHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
