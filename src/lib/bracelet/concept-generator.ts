import { Locale, Selections } from "@/lib/types";
import { joinNatural } from "@/lib/prompt-engine";
import { translateOptionLabel } from "@/lib/i18n/translate-generator";
import { en, es } from "@/lib/i18n/dictionaries";
import {
  braceletGroups,
  findBraceletGroup,
  MATERIAL_GROUP_IDS,
  GEMSTONE_MATERIAL_GROUP_IDS,
  METAL_MATERIAL_GROUP_ID,
  CORD_MATERIAL_GROUP_ID,
} from "@/lib/bracelet/taxonomy";
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
  materialsForStory: string[],
  moodLabels: string[],
  locale: Locale
): string {
  // materialsForStory is whatever the concept is actually made from
  // (gemstones if any were selected, otherwise the other selected
  // materials) — falling back to a generic "natural stones" phrase only
  // when NOTHING was selected at all, never as a stand-in for a real,
  // deliberately-chosen non-gemstone material (see caller).
  const materialsText = materialsForStory.length
    ? joinNatural(materialsForStory, locale)
    : locale === "es"
    ? "piedras naturales seleccionadas a mano"
    : "hand-selected natural stones";
  const moodText = moodLabels.length
    ? joinNatural(moodLabels.map((m) => m.toLowerCase()), locale)
    : locale === "es"
    ? "cálida y atemporal"
    : "warm and timeless";

  if (locale === "es") {
    return `${name} combina ${materialsText} con una sensación ${moodText}, sintiéndose a la vez personal y digna de ser coleccionada — el tipo de pieza que las clientas atesoran y regalan.`;
  }
  return `${name} pairs ${materialsText} with a ${moodText} feeling, making it feel both personal and collectible — the kind of piece customers treasure and gift.`;
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
  // Materials are spread across several focused sub-groups (gemstones, metal,
  // cord, findings, etc.) rather than one flat list — flatten every group's
  // selections into a single ordered list of labels for the concept output.
  const materialLabels = MATERIAL_GROUP_IDS.flatMap((groupId) =>
    localizedLabels(groupId, selections, locale)
  );

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

  // Whether the user touched the Materials category AT ALL — across every
  // sub-group (gemstones, metal, cord, findings, decorative, etc.), not
  // just the gemstone ones. This is the key distinction: if they picked
  // *anything* under Materials (say, only a cord/thread for a pure macramé
  // piece), that's a deliberate, complete choice and we must never invent
  // additional materials/gemstones they didn't ask for. The random
  // "surprise me" gemstone suggestion should only fire when the whole
  // Materials section was left untouched — i.e. the user wants the
  // generator to suggest something on their behalf.
  const anyMaterialSelected = materialLabels.length > 0;

  // The user's own Gemstones / Glass & Crystal Bead picks should always win
  // over a random theme-vocabulary gemstone — otherwise a concept could
  // describe "aquamarine" in its story while the Materials field (correctly)
  // lists something completely different, like "mostacilla" the user chose.
  const selectedGemstones = GEMSTONE_MATERIAL_GROUP_IDS.flatMap((groupId) =>
    localizedLabels(groupId, selections, locale)
  );
  const gemstoneCount = rand.int(1, 2);
  const gemstones = selectedGemstones.length
    ? selectedGemstones
    : anyMaterialSelected
    ? [] // user made deliberate material choices that don't include any gemstones/beads — respect that, don't invent one
    : rand.pickMany(gemstoneWords, gemstoneCount);

  const charmCount = rand.int(1, 2);
  const charmSuggestions = rand.pickMany(charmWords, charmCount);

  const resolvedMaterials = anyMaterialSelected
    ? materialLabels
    : [styleProfile.metalType[locale], ...(locale === "es" ? ["piedras naturales"] : ["natural gemstones"])];

  // Likewise, an explicitly picked Metal or Cord/Thread material should
  // override the bracelet style's generic manufacturing default (e.g. a
  // "Silk" style defaulting to "Gold-filled clasp" even though the user
  // picked Sterling Silver, or picking "Thread" but the style default
  // still reporting "Waxed cotton cord" instead of the chosen thread).
  const selectedMetal = localizedLabels(METAL_MATERIAL_GROUP_ID, selections, locale);
  const selectedCord = localizedLabels(CORD_MATERIAL_GROUP_ID, selections, locale);
  const resolvedMetalType = selectedMetal.length ? joinNatural(selectedMetal, locale) : styleProfile.metalType[locale];
  const resolvedCordType = selectedCord.length
    ? joinNatural(selectedCord, locale)
    : styleProfile.cordType?.[locale];

  const buildTime = formatBuildTime(styleProfile.buildTimeMinutes, locale);
  const difficulty = styleProfile.difficulty;

  const paletteFallback = locale === "es" ? "Neutros cálidos y dorado" : "Warm neutrals and gold";

  // The "why customers love it" story should describe gemstones when the
  // piece has any, but fall back to whatever materials were actually
  // selected (e.g. "embroidery floss and pressed flowers") for a piece with
  // no gemstones at all — never silently drop back to a generic "natural
  // stones" claim just because gemstones is empty by design.
  const materialsForStory = gemstones.length ? gemstones : resolvedMaterials;
  const whyCustomersLoveIt = buildWhyCustomersLoveIt(name, materialsForStory, emotionLabels, locale);

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
    metalType: resolvedMetalType,
    cordType: resolvedCordType,
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
