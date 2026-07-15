import {
  BrandProfile,
  ComposeContext,
  FilterGroup,
  Locale,
  PlatformMeta,
  Selections,
} from "@/lib/types";
import { en, es } from "@/lib/i18n/dictionaries";
import { translateOptionLabel } from "@/lib/i18n/translate-generator";

/**
 * Shared helpers for turning structured filter selections + a brand profile
 * into rich, professional prompt copy. Individual generators (image, caption,
 * poll, etc.) build on top of these primitives inside `lib/generators/*`.
 *
 * The engine is intentionally provider-agnostic: it only ever produces plain
 * text. Wiring a generator up to a live model API later is a matter of
 * sending this same string to that provider — no redesign required.
 *
 * IMPORTANT: the *generated prompt text* now respects the active site
 * language (English or Spanish), matching the UI language toggle. Every
 * helper below takes a `locale` parameter (defaulting to "en") and returns
 * the appropriate language's phrasing. Generators (src/lib/generators/*)
 * branch on `ctx.locale` to select between English and Spanish sentence
 * templates, and use the `*Localized` selectors below to pull translated
 * option labels (from the same dictionaries the UI uses) into those
 * sentences.
 */

function dictFor(locale: Locale) {
  return locale === "es" ? es : en;
}

/** Resolve the human-readable labels the user picked for a given group (always English, from the FilterGroup definition). */
export function selectedLabels(group: FilterGroup, selections: Selections): string[] {
  const picked = selections[group.id] ?? [];
  const labels: string[] = [];
  for (const id of picked) {
    if (id === "custom") continue;
    if (id.startsWith("custom:")) {
      const text = id.slice("custom:".length).trim();
      if (text) labels.push(text);
      continue;
    }
    const opt = group.options.find((o) => o.id === id);
    if (opt) labels.push(opt.label);
  }
  return labels;
}

/** Convenience: first selected label only (for single-select groups). */
export function selectedLabel(group: FilterGroup, selections: Selections): string | undefined {
  return selectedLabels(group, selections)[0];
}

/**
 * Locale-aware label selection: returns the selected options' labels
 * translated into the active language (using the same dictionary the UI
 * chips use), falling back to the canonical English label if no
 * translation exists. Custom free-text entries pass through unchanged
 * regardless of locale, since they're the user's own words.
 */
export function selectedLabelsLocalized(
  group: FilterGroup,
  selections: Selections,
  generatorSlug: string,
  locale: Locale = "en"
): string[] {
  if (locale === "en") return selectedLabels(group, selections);
  const dict = dictFor(locale);
  const picked = selections[group.id] ?? [];
  const labels: string[] = [];
  for (const id of picked) {
    if (id === "custom") continue;
    if (id.startsWith("custom:")) {
      const text = id.slice("custom:".length).trim();
      if (text) labels.push(text);
      continue;
    }
    const opt = group.options.find((o) => o.id === id);
    if (opt) labels.push(translateOptionLabel(dict, generatorSlug, group.id, id, opt.label));
  }
  return labels;
}

/** Convenience: first localized label only (for single-select groups). */
export function selectedLabelLocalized(
  group: FilterGroup,
  selections: Selections,
  generatorSlug: string,
  locale: Locale = "en"
): string | undefined {
  return selectedLabelsLocalized(group, selections, generatorSlug, locale)[0];
}

/** Natural join: "a, b and c" (English) or "a, b y c" (Spanish) */
export function joinNatural(items: string[], locale: Locale = "en"): string {
  const clean = items.filter(Boolean);
  const conj = locale === "es" ? "y" : "and";
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} ${conj} ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} ${conj} ${clean[clean.length - 1]}`;
}

/** Lowercase-join for keyword-style prompts (Midjourney, Flux, etc.) — always comma-separated regardless of locale. */
export function joinKeywords(items: string[]): string {
  return items.filter(Boolean).join(", ");
}

/** Builds 1-2 short, natural sentences describing the brand, for instructional prompts. */
export function brandContextSentence(brand: BrandProfile, locale: Locale = "en"): string {
  if (locale === "es") return brandContextSentenceEs(brand);

  const name = brand.brandName || "the brand";
  const sentenceOne: string[] = [];
  if (brand.voice) sentenceOne.push(`a ${brand.voice.toLowerCase()} brand voice`);
  if (brand.audience) sentenceOne.push(`speaks to ${brand.audience.toLowerCase()}`);
  if (brand.materials) sentenceOne.push(`works primarily with ${brand.materials.toLowerCase()}`);

  const sentences: string[] = [];
  if (sentenceOne.length > 0) {
    sentences.push(capitalize(`${name} has ${joinNatural(sentenceOne)}.`));
  }
  if (brand.colorPalette) {
    sentences.push(capitalize(`Its signature color palette is ${brand.colorPalette.toLowerCase()}.`));
  }
  if (brand.usp) {
    sentences.push(capitalize(`What sets it apart: ${lowerFirst(brand.usp.replace(/\.$/, ""))}.`));
  }
  if (brand.mission) {
    sentences.push(capitalize(`Its mission is ${lowerFirst(brand.mission.replace(/\.$/, ""))}.`));
  }
  return sentences.join(" ");
}

function brandContextSentenceEs(brand: BrandProfile): string {
  const name = brand.brandName || "la marca";
  const sentenceOne: string[] = [];
  if (brand.voice) sentenceOne.push(`una voz de marca ${brand.voice.toLowerCase()}`);
  if (brand.audience) sentenceOne.push(`se dirige a ${brand.audience.toLowerCase()}`);
  if (brand.materials) sentenceOne.push(`trabaja principalmente con ${brand.materials.toLowerCase()}`);

  const sentences: string[] = [];
  if (sentenceOne.length > 0) {
    sentences.push(capitalize(`${name} tiene ${joinNatural(sentenceOne, "es")}.`));
  }
  if (brand.colorPalette) {
    sentences.push(capitalize(`Su paleta de colores distintiva es ${brand.colorPalette.toLowerCase()}.`));
  }
  if (brand.usp) {
    sentences.push(capitalize(`Lo que la distingue: ${lowerFirst(brand.usp.replace(/\.$/, ""))}.`));
  }
  if (brand.mission) {
    sentences.push(capitalize(`Su misión es ${lowerFirst(brand.mission.replace(/\.$/, ""))}.`));
  }
  return sentences.join(" ");
}

/** Short comma-fragment brand descriptor, for keyword-style prompts. Always plain values, locale-independent. */
export function brandKeywords(brand: BrandProfile): string[] {
  return [brand.brandName, brand.voice, brand.materials, brand.colorPalette].filter(
    (v): v is string => Boolean(v && v.trim())
  );
}

export function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Lowercases only the first character, leaving the rest (e.g. acronyms) untouched. */
export function lowerFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Returns "a" or "an" depending on whether `word` starts with a vowel sound. Spanish has no equivalent article-elision rule, so it's unused for `locale === "es"` call sites. */
export function article(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? "an" : "a";
}

/** Aspect ratio / platform-specific technical suffix helpers (always in English/technical flag syntax, since these are literal model parameters, not prose). */
export function platformSuffix(platform: PlatformMeta): string {
  switch (platform.id) {
    case "midjourney":
      return "--ar 4:5 --v 6.1 --style raw --quality 1";
    case "flux":
      return "aspect ratio 4:5, ultra-detailed, photorealistic rendering";
    case "ideogram":
      return "aspect ratio 4:5, sharp typography-safe composition";
    case "stable-diffusion":
      return "aspect ratio 4:5, 8k, highly detailed, professional photography, negative prompt: blurry, low quality, distorted, watermark, text, oversaturated";
    case "leonardo":
      return "aspect ratio 4:5, PhotoReal style, ultra-detailed, high fidelity";
    case "firefly":
      return "aspect ratio 4:5, photo content type, commercially safe, clean composition";
    default:
      return "";
  }
}

/** Instructional directive appended for video-generation platforms (Runway, Veo, Kling, Luma). */
export function videoPlatformDirective(platform: PlatformMeta, locale: Locale = "en"): string {
  if (locale === "es") {
    switch (platform.id) {
      case "runway":
        return "Describe la toma como un movimiento de cámara suave y cinematográfico (por ejemplo, un acercamiento lento o un paneo sutil) de 4 a 8 segundos, en una sola toma continua.";
      case "veo":
        return "Describe la escena con movimiento físico claro, un movimiento de cámara natural y una iluminación consistente durante toda la duración del clip.";
      case "kling":
        return "Enfatiza un movimiento fluido y natural con una dinámica físicamente creíble, manteniendo al sujeto claramente legible durante todo el clip.";
      case "luma":
        return "Mantén el movimiento simple y elegante: una deriva de cámara sutil o el movimiento de un objeto funcionan mejor para un loop corto y onírico.";
      default:
        return "";
    }
  }
  switch (platform.id) {
    case "runway":
      return "Describe the shot as a smooth, cinematic camera move (e.g. slow push-in or gentle pan) lasting 4-8 seconds, in a single continuous take.";
    case "veo":
      return "Describe the scene with clear physical motion, natural camera movement, and consistent lighting across the full duration of the clip.";
    case "kling":
      return "Emphasize fluid, natural motion and physically plausible dynamics, keeping the subject clearly readable throughout the clip.";
    case "luma":
      return "Keep the motion simple and elegant — a subtle camera drift or object motion works best for a short, dreamlike loop.";
    default:
      return "";
  }
}

export function modeDirective(mode: "reliable" | "creative" | "viral", locale: Locale = "en"): string {
  if (locale === "es") {
    switch (mode) {
      case "reliable":
        return "Favorece un resultado seguro, consistente y confiable que cumpla fielmente con el brief con el mínimo riesgo de un resultado inutilizable.";
      case "creative":
        return "Favorece una interpretación artística e imaginativa que tome riesgos creativos con buen gusto sin dejar de ser fiel a la marca.";
      case "viral":
        return "Favorece un resultado audaz y de alto impacto diseñado para detener el scroll y maximizar las comparticiones, guardados y comentarios en redes sociales.";
    }
  }
  switch (mode) {
    case "reliable":
      return "Favor a safe, consistent, and dependable result that reliably matches the brief with minimal risk of unusable output.";
    case "creative":
      return "Favor an artistic, imaginative interpretation that takes tasteful creative risks while staying on-brand.";
    case "viral":
      return "Favor a bold, high-impact result engineered to stop the scroll and maximize shares, saves, and comments on social media.";
  }
}

export function modeKeyword(mode: "reliable" | "creative" | "viral", locale: Locale = "en"): string {
  if (locale === "es") {
    switch (mode) {
      case "reliable":
        return "limpio, confiable, pulido, fiel al brief";
      case "creative":
        return "artístico, imaginativo, expresivo, encuadre inesperado";
      case "viral":
        return "llamativo, audaz, alto contraste, detiene el scroll, capta la atención";
    }
  }
  switch (mode) {
    case "reliable":
      return "clean, dependable, polished, true-to-brief";
    case "creative":
      return "artistic, imaginative, expressive, unexpected framing";
    case "viral":
      return "eye-catching, bold, high-contrast, scroll-stopping, thumb-stopping";
  }
}

export type Compose = (ctx: ComposeContext) => Record<"reliable" | "creative" | "viral", string>;

/**
 * Builds a natural-language description of a combined writing personality,
 * e.g. ["elegant", "witty"] -> "an elegant yet witty tone" (English) or
 * "un tono elegante pero ingenioso" (Spanish). Designed to read fluently for
 * any number of combined traits (1 to many).
 */
export function personalityPhrase(traits: string[], locale: Locale = "en"): string {
  const clean = traits.filter(Boolean).map((t) => t.toLowerCase());
  if (clean.length === 0) return "";

  if (locale === "es") {
    // Every Spanish sentence template pairs these traits with "un tono"
    // (masculine), so the dictionary stores masculine adjective forms
    // (e.g. "ingenioso", "alentador") to keep correct gender agreement.
    if (clean.length === 1) return `un tono ${clean[0]}`;
    if (clean.length === 2) return `un tono ${clean[0]} pero ${clean[1]}`;
    return `un tono que es ${joinNatural(clean, "es")}`;
  }

  if (clean.length === 1) return `${article(clean[0])} ${clean[0]} tone`;
  if (clean.length === 2) return `${article(clean[0])} ${clean[0]} yet ${clean[1]} tone`;
  return `a tone that is ${joinNatural(clean)}`;
}
