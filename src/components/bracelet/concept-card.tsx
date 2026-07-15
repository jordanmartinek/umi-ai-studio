"use client";

import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";
import { BraceletConcept } from "@/lib/bracelet/types";
import { difficultyLabel } from "@/lib/bracelet/style-profile";
import { ReactNode } from "react";

/**
 * Renders a complete BraceletConcept: name, collection, theme, inspiration,
 * story, target customer, mood, style, occasion, color palette, materials,
 * gemstones, metal/cord type, charm suggestions, difficulty, build time,
 * and why customers would love it. `actions` renders any buttons (Regenerate,
 * Save, Generate Launch Package) below the concept fields.
 */
export function ConceptCard({
  concept,
  actions,
}: {
  concept: BraceletConcept;
  actions?: ReactNode;
}) {
  const { dict } = useLocale();
  const c = dict.bracelets.conceptCard;

  return (
    <Card className="p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl text-espresso">{concept.name}</h3>
        <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-espresso">
          {c.collectionLabel}: {concept.collectionName}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-taupe">{concept.story}</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={c.themeLabel} value={concept.theme} />
        <Field label={c.styleLabel} value={concept.style} />
        <Field label={c.occasionLabel} value={concept.occasion} />
        <Field label={c.colorPaletteLabel} value={concept.colorPalette} />
        <Field label={c.moodLabel} value={concept.mood.join(", ")} />
        <Field
          label={c.difficultyLabel}
          value={difficultyLabel(concept.difficulty, concept.locale)}
        />
        <Field label={c.buildTimeLabel} value={concept.buildTime} />
        <Field label={c.metalTypeLabel} value={concept.metalType} />
        {concept.cordType ? <Field label={c.cordTypeLabel} value={concept.cordType} /> : null}
        <Field label={c.materialsLabel} value={concept.materials.join(", ")} />
        <Field label={c.gemstonesLabel} value={concept.gemstones.join(", ")} />
        <Field label={c.charmsLabel} value={concept.charmSuggestions.join(", ")} />
      </div>

      <div className="mt-5 space-y-3 border-t border-line pt-4">
        <TextBlock label={c.inspirationLabel} value={concept.inspiration} />
        <TextBlock label={c.targetCustomerLabel} value={concept.targetCustomer} />
        <TextBlock label={c.whyTheyLoveItLabel} value={concept.whyCustomersLoveIt} />
      </div>

      {actions ? <div className="mt-6 flex flex-wrap gap-2">{actions}</div> : null}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-taupe">{label}</div>
      <div className="mt-0.5 text-sm text-espresso">{value}</div>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-taupe">{label}</div>
      <p className="mt-0.5 text-sm leading-relaxed text-espresso">{value}</p>
    </div>
  );
}
