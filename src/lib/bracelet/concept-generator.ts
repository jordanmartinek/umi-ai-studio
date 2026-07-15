import { Locale, Selections } from "@/lib/types";
import { joinNatural } from "@/lib/prompt-engine";
import { translateOptionLabel } from "@/lib/i18n/translate-generator";
import { en, es } from "@/lib/i18n/dictionaries";
import { braceletGroups, findBraceletGroup } from "@/lib/bracelet/taxonomy";
import { getThemeVocab, vocabList } from "@/lib/bracelet/vocabulary";
import { difficultyLabel, formatBuildTime, getStyleProfile } from "@/lib/bracelet/style-profile";
import { createSeededRandom, hashString } from "@/lib/bracelet/random";
import { BraceletConcept, ConceptGenerationInput } from "@/lib/bracelet/types";

/**
 * The Bracelet Idea Generator's composition engine. Turns a set of Creative
 * Filter selections (theme, style, aesthetic, emotion, occasion, color
 * palette, materials) into a complete, cohesive BraceletConcept — a
 * realistic, manufacturable design brief, not just an image prompt.
 *
 * Cohesion comes from three places:
 *  1. Theme-specific vocabulary banks (naming words, gemstones, imagery,
 *     charms) so a "Flowers" theme never suggests desert imagery.
 *  2. Style profiles that map each bracelet style to sensible manufacturing
 *     defaults (metal/cord type, difficulty, build time).
 *  3. A seeded random generator so "Regenerate" produces genuine variety
 *     while still respecting every filter the user selected.
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

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildNameEn(nameWords: string[], rand: ReturnType<typeof createSeededRandom>): string {
  const parts = rand.pickMany(nameWords, 2);
  return parts.join(" ");
}

function buildNameEs(nameWords: string[], rand: ReturnType<typeof createSeededRandom>): string {
  const parts = rand.pickMany(nameWords, Math.min(2, nameWords.length));
  return parts.join(" ");
}

const COLLECTION_WORDS_EN = ["Bloom", "Dreams", "Muse", "Season", "Story", "Light", "Reverie", "Wonder"];
const COLLECTION_WORDS_ES = ["Florecer", "Sueños", "Musa", "Temporada", "Historia", "Luz", "Ensueño", "Maravilla"];

/** Builds a collection name from theme-relevant vocabulary words (e.g. "Wild Bloom", "Moonlit Reverie")
 *  rather than literally pasting the theme's filter-chip label, which reads grammatically backward
 *  for many themes (e.g. "Flowers Wild"). `usedWords` excludes whatever the bracelet name already used. */
function buildCollectionName(
  nameWords: string[],
  usedWords: string[],
  locale: Locale,
  rand: ReturnType<typeof createSeededRandom>
): string {
  const collectionWords = locale === "es" ? COLLECTION_WORDS_ES : COLLECTION_WORDS_EN;
  const availableNameWords = nameWords.filter((w) => !usedWords.includes(w));
  const lead = rand.pick(availableNameWords.length ? availableNameWords : nameWords);
  const suffix = rand.pick(collectionWords);
  return `${lead} ${suffix}`;
}

function buildStory(
  imagery: string,
  locale: Locale
): string {
  if (locale === "es") {
    return `Inspirada en ${imagery}.`;
  }
  return `Inspired by ${imagery}.`;
}

function buildInspiration(themeLabel: string | undefined, aestheticLabels: string[], locale: Locale): string {
  if (locale === "es") {
    const theme = themeLabel ? themeLabel.toLowerCase() : "un momento cotidiano de belleza silenciosa";
    const aesthetic = aestheticLabels.length ? ` con un enfoque ${joinNatural(aestheticLabels.map((a) => a.toLowerCase()), "es")}` : "";
    return `El tema de ${theme}${aesthetic}.`;
  }
  const theme = themeLabel ? themeLabel.toLowerCase() : "a quiet, everyday moment of beauty";
  const aesthetic = aestheticLabels.length ? ` with a ${joinNatural(aestheticLabels.map((a) => a.toLowerCase()))} approach` : "";
  return `The theme of ${theme}${aesthetic}.`;
}

function buildTargetCustomer(
  aestheticLabels: string[],
  emotionLabels: string[],
  occasionLabel: string | undefined,
  locale: Locale
): string {
  const aestheticText = aestheticLabels.length
    ? joinNatural(aestheticLabels.map((a) => a.toLowerCase()), locale)
    : locale === "es"
    ? "elegante y con significado"
    : "elegant and meaningful";

  if (locale === "es") {
    const emotionText = emotionLabels.length
      ? ` y buscan sentirse ${joinNatural(emotionLabels.map((e) => e.toLowerCase()), "es")}`
      : "";
    const occasionText = occasionLabel ? ` Ideal para ${occasionLabel.toLowerCase()}.` : "";
    return `Mujeres que aprecian la joyería artesanal con un estilo ${aestheticText}${emotionText}.${occasionText}`;
  }

  const emotionText = emotionLabels.length
    ? ` and want to feel ${joinNatural(emotionLabels.map((e) => e.toLowerCase()))}`
    : "";
  const occasionText = occasionLabel ? ` Ideal for ${occasionLabel.toLowerCase()}.` : "";
  return `Women who appreciate handmade jewelry with a ${aestheticText} style${emotionText}.${occasionText}`;
}

function buildWhyCustomersLoveIt(
  name: string,
  gemstoneLabels: string[],
  moodLabels: string[],
  locale: Locale
): string {
  const gemstoneText = gemstoneLabels.length
    ? joinNatural(gemstoneLabels, locale)
    : locale === "es"
    ? "piedras naturales seleccionadas a mano"
    : "hand-selected natural stones";
  const moodText = moodLabels.length
    ? joinNatural(moodLabels.map((m) => m.toLowerCase()), locale)
    : locale === "es"
    ? "cálida y atemporal"
    : "warm and timeless";

  if (locale === "es") {
    return `${name} combina ${gemstoneText} con una sensación ${moodText}, sintiéndose a la vez personal y digna de ser coleccionada — el tipo de pieza que las clientas atesoran y regalan.`;
  }
  return `${name} pairs ${gemstoneText} with a ${moodText} feeling, making it feel both personal and collectible — the kind of piece customers treasure and gift.`;
}

/** Generates a single, cohesive bracelet concept from the given filters. */
export function generateBraceletConcept(input: ConceptGenerationInput): BraceletConcept {
  const { selections, locale } = input;
  const themeId = selections.theme?.[0]?.startsWith("custom") ? undefined : selections.theme?.[0];
  const styleId = selections.style?.[0];

  const seedBase = hashString(JSON.stringify(selections)) + (input.seed ?? 0);
  const rand = createSeededRandom(seedBase);

  const vocab = getThemeVocab(themeId);
  const styleProfile = getStyleProfile(styleId);

  const themeLabel = localizedLabel("theme", selections, locale);
  const styleLabel = localizedLabel("style", selections, locale) ?? (locale === "es" ? "Pulsera artesanal" : "Handcrafted bracelet");
  const aestheticLabels = localizedLabels("aesthetic", selections, locale);
  const emotionLabels = localizedLabels("emotion", selections, locale);
  const occasionLabel = localizedLabel("occasion", selections, locale);
  const colorPaletteLabel = localizedLabel("colorPalette", selections, locale);
  const materialLabels = localizedLabels("materials", selections, locale);

  const nameWords = vocabList(vocab, "nameWords", locale);
  const gemstoneWords = vocabList(vocab, "gemstones", locale);
  const imageryFragments = vocabList(vocab, "imagery", locale);
  const charmWords = vocabList(vocab, "charms", locale);

  const name = locale === "es" ? buildNameEs(nameWords, rand) : buildNameEn(nameWords, rand);
  const usedNameWords = name.split(" ");
  const collectionName = buildCollectionName(nameWords, usedNameWords, locale, rand);
  const imagery = rand.pick(imageryFragments);
  const story = buildStory(imagery, locale);
  const inspiration = buildInspiration(themeLabel, aestheticLabels, locale);
  const targetCustomer = buildTargetCustomer(aestheticLabels, emotionLabels, occasionLabel, locale);

  const gemstoneCount = rand.int(1, 2);
  const gemstones = rand.pickMany(gemstoneWords, gemstoneCount);

  const charmCount = rand.int(1, 2);
  const charmSuggestions = rand.pickMany(charmWords, charmCount);

  const resolvedMaterials = materialLabels.length
    ? materialLabels
    : [styleProfile.metalType[locale], ...(locale === "es" ? ["piedras naturales"] : ["natural gemstones"])];

  const buildTime = formatBuildTime(styleProfile.buildTimeMinutes, locale);
  const difficulty = styleProfile.difficulty;

  const paletteFallback = locale === "es" ? "Neutros cálidos y dorado" : "Warm neutrals and gold";

  const whyCustomersLoveIt = buildWhyCustomersLoveIt(name, gemstones, emotionLabels, locale);

  return {
    id: makeId(),
    name,
    collectionName,
    theme: themeLabel ?? (locale === "es" ? "Belleza cotidiana" : "Everyday beauty"),
    inspiration,
    story,
    targetCustomer,
    mood: emotionLabels.length ? emotionLabels : aestheticLabels,
    style: styleLabel,
    occasion: occasionLabel ?? (locale === "es" ? "Uso diario" : "Everyday wear"),
    colorPalette: colorPaletteLabel ?? paletteFallback,
    materials: resolvedMaterials,
    gemstones,
    metalType: styleProfile.metalType[locale],
    cordType: styleProfile.cordType?.[locale],
    charmSuggestions,
    difficulty,
    buildTime,
    whyCustomersLoveIt,
    selections,
    locale,
    createdAt: new Date().toISOString(),
  };
}

export { difficultyLabel };
export { braceletGroups };
