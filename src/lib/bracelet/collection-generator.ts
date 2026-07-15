import { Selections } from "@/lib/types";
import { braceletGroups, findBraceletGroup } from "@/lib/bracelet/taxonomy";
import { getThemeVocab, vocabList } from "@/lib/bracelet/vocabulary";
import { createSeededRandom, hashString } from "@/lib/bracelet/random";
import { generateBraceletConcept } from "@/lib/bracelet/concept-generator";
import { BraceletCollection, ConceptGenerationInput } from "@/lib/bracelet/types";
import { translateOptionLabel } from "@/lib/i18n/translate-generator";
import { en, es } from "@/lib/i18n/dictionaries";
import { joinNatural } from "@/lib/prompt-engine";
import { Locale } from "@/lib/types";

/**
 * The AI Collection Generator: produces a cohesive set of 8-15 bracelets
 * that all share the same theme, story, and color palette (the "unifying"
 * filters) while varying style and materials across individual pieces so
 * the collection doesn't feel repetitive.
 *
 * Cohesion strategy: generate each piece with the *same* theme/aesthetic/
 * emotion/occasion/colorPalette selections (so vocabulary and story stay
 * consistent) but let the seeded random vary the bracelet name/style/
 * materials/gemstones per piece — exactly like a real collection where
 * every item shares a design language but isn't identical.
 */

function bracelDict(locale: Locale) {
  return locale === "es" ? es : en;
}

function localizedLabel(groupId: string, selections: Selections, locale: Locale): string | undefined {
  const group = findBraceletGroup(groupId);
  const picked = selections[groupId]?.[0];
  if (!picked) return undefined;
  if (picked.startsWith("custom:")) return picked.slice("custom:".length).trim();
  if (picked === "custom") return undefined;
  const opt = group.options.find((o) => o.id === picked);
  if (!opt) return undefined;
  if (locale === "en") return opt.label;
  return translateOptionLabel(bracelDict(locale), "bracelet", groupId, picked, opt.label);
}

function localizedLabels(groupId: string, selections: Selections, locale: Locale): string[] {
  const group = findBraceletGroup(groupId);
  const picked = selections[groupId] ?? [];
  const dict = bracelDict(locale);
  const labels: string[] = [];
  for (const id of picked) {
    if (id === "custom") continue;
    if (id.startsWith("custom:")) {
      const text = id.slice("custom:".length).trim();
      if (text) labels.push(text);
      continue;
    }
    const opt = group.options.find((o) => o.id === id);
    if (!opt) continue;
    labels.push(locale === "en" ? opt.label : translateOptionLabel(dict, "bracelet", groupId, id, opt.label));
  }
  return labels;
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

/** Converts a small ordinal (2-15) to a Roman numeral, used as a last-resort
 *  disambiguating suffix when a theme's vocabulary pool is too small to
 *  produce a genuinely unique name for every piece in a large collection. */
function toRomanNumeral(n: number): string {
  return ROMAN_NUMERALS[n - 1] ?? String(n);
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// The bracelet styles a collection will rotate through when the user hasn't
// pinned a specific style — keeps every piece feeling different while still
// belonging to the same collection.
const STYLE_ROTATION = [
  "gemstone-beaded",
  "seed-bead",
  "mixed-beads",
  "chain",
  "wire-wrapped",
  "waxed-cord",
  "adjustable-knot",
  "pearl-beaded",
];

function buildCollectionStory(themeLabel: string | undefined, aestheticLabels: string[], locale: Locale): string {
  if (locale === "es") {
    const theme = themeLabel ? themeLabel.toLowerCase() : "un momento cotidiano de belleza silenciosa";
    const aesthetic = aestheticLabels.length
      ? ` con un espíritu ${joinNatural(aestheticLabels.map((a) => a.toLowerCase()), "es")}`
      : "";
    return `Una colección inspirada en ${theme}${aesthetic}, donde cada pieza cuenta una parte de la misma historia.`;
  }
  const theme = themeLabel ? themeLabel.toLowerCase() : "a quiet, everyday moment of beauty";
  const aesthetic = aestheticLabels.length
    ? ` with a ${joinNatural(aestheticLabels.map((a) => a.toLowerCase()))} spirit`
    : "";
  return `A collection inspired by ${theme}${aesthetic}, where every piece tells a part of the same story.`;
}

export interface CollectionGenerationInput extends ConceptGenerationInput {
  pieceCount: number;
}

/** Generates a cohesive AI Collection of bracelets sharing theme/story/palette. */
export function generateBraceletCollection(input: CollectionGenerationInput): BraceletCollection {
  const { selections, brand, locale } = input;
  const pieceCount = Math.min(15, Math.max(8, input.pieceCount));

  const themeId = selections.theme?.[0]?.startsWith("custom") ? undefined : selections.theme?.[0];
  const themeLabel = localizedLabel("theme", selections, locale);
  const aestheticLabels = localizedLabels("aesthetic", selections, locale);
  const colorPaletteLabel = localizedLabel("colorPalette", selections, locale);

  const vocab = getThemeVocab(themeId);
  const nameWords = vocabList(vocab, "nameWords", locale);

  const collectionSeedBase = hashString(JSON.stringify(selections)) + (input.seed ?? 0);
  const collectionRand = createSeededRandom(collectionSeedBase);

  const collectionWords = locale === "es"
    ? ["Colección", "Edición", "Serie"]
    : ["Collection", "Edit", "Series"];
  const collectionLead = collectionRand.pick(nameWords);
  const collectionSuffix = collectionRand.pick(collectionWords);
  const collectionName =
    locale === "es" ? `${collectionSuffix} ${collectionLead}` : `${collectionLead} ${collectionSuffix}`;

  const story = buildCollectionStory(themeLabel, aestheticLabels, locale);

  // Determine which styles this collection will rotate through: if the user
  // pinned a specific style, honor it for every piece (a themed collection
  // that's all-macramé, say); otherwise rotate through a varied style pool
  // so the collection has visual range like a real product line.
  const pinnedStyle = selections.style?.[0];
  const styleSequence: (string | undefined)[] = pinnedStyle
    ? new Array(pieceCount).fill(pinnedStyle)
    : Array.from({ length: pieceCount }, (_, i) => STYLE_ROTATION[i % STYLE_ROTATION.length]);

  // Each collection's name-word pool is small (a handful of words per
  // theme), so with 8-15 pieces name collisions become likely by chance
  // alone (e.g. a 6-word pool only has 30 two-word permutations, and the
  // birthday-paradox effect makes collisions likely well before 15 draws).
  // Retry with a different seed offset (many attempts, since generation is
  // cheap) whenever a generated name has already been used in this
  // collection. If every retry is exhausted and the vocab pool is simply
  // too small to guarantee a fresh permutation, fall back to a Roman-
  // numeral suffix (e.g. "Moonlit Glow II") — a real naming convention for
  // collections — so the Design Board can never end up with two pieces
  // sharing a literal name.
  const usedNames = new Set<string>();
  const pieces = styleSequence.map((styleId, index) => {
    const pieceSelections: Selections = {
      ...selections,
      ...(styleId ? { style: [styleId] } : {}),
    };
    let concept = generateBraceletConcept({
      selections: pieceSelections,
      brand,
      locale,
      seed: (input.seed ?? 0) + index * 97 + 1,
    });
    let attempt = 1;
    while (usedNames.has(concept.name) && attempt <= 20) {
      concept = generateBraceletConcept({
        selections: pieceSelections,
        brand,
        locale,
        seed: (input.seed ?? 0) + index * 97 + 1 + attempt * 5000,
      });
      attempt++;
    }
    if (usedNames.has(concept.name)) {
      let ordinal = 2;
      let candidateName = `${concept.name} ${toRomanNumeral(ordinal)}`;
      while (usedNames.has(candidateName)) {
        ordinal++;
        candidateName = `${concept.name} ${toRomanNumeral(ordinal)}`;
      }
      concept = { ...concept, name: candidateName };
    }
    usedNames.add(concept.name);
    return concept;
  });

  return {
    id: makeId(),
    collectionName,
    theme: themeLabel ?? (locale === "es" ? "Belleza cotidiana" : "Everyday beauty"),
    story,
    colorPalette: colorPaletteLabel ?? (locale === "es" ? "Neutros cálidos y dorado" : "Warm neutrals and gold"),
    aesthetic: aestheticLabels.length
      ? joinNatural(aestheticLabels, locale)
      : locale === "es"
      ? "Elegante y con significado"
      : "Elegant and meaningful",
    pieces,
    selections,
    locale,
    createdAt: new Date().toISOString(),
  };
}

export { braceletGroups };
