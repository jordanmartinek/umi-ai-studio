import {
  BrandProfile,
  ComposeContext,
  FilterGroup,
  PlatformMeta,
  Selections,
} from "@/lib/types";

/**
 * Shared helpers for turning structured filter selections + a brand profile
 * into rich, professional prompt copy. Individual generators (image, caption,
 * poll, etc.) build on top of these primitives inside `lib/generators/*`.
 *
 * The engine is intentionally provider-agnostic: it only ever produces plain
 * text. Wiring a generator up to a live model API later is a matter of
 * sending this same string to that provider — no redesign required.
 */

/** Resolve the human-readable labels the user picked for a given group. */
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

/** Natural join: "a, b and c" */
export function joinNatural(items: string[]): string {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} and ${clean[clean.length - 1]}`;
}

/** Lowercase-join for keyword-style prompts (Midjourney, Flux, etc.) */
export function joinKeywords(items: string[]): string {
  return items.filter(Boolean).join(", ");
}

/** Builds 1-2 short, natural sentences describing the brand, for instructional prompts. */
export function brandContextSentence(brand: BrandProfile): string {
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

/** Short comma-fragment brand descriptor, for keyword-style prompts. */
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

/** Returns "a" or "an" depending on whether `word` starts with a vowel sound. */
export function article(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? "an" : "a";
}

/** Aspect ratio / platform-specific technical suffix helpers. */
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
export function videoPlatformDirective(platform: PlatformMeta): string {
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

export function modeDirective(mode: "reliable" | "creative" | "viral"): string {
  switch (mode) {
    case "reliable":
      return "Favor a safe, consistent, and dependable result that reliably matches the brief with minimal risk of unusable output.";
    case "creative":
      return "Favor an artistic, imaginative interpretation that takes tasteful creative risks while staying on-brand.";
    case "viral":
      return "Favor a bold, high-impact result engineered to stop the scroll and maximize shares, saves, and comments on social media.";
  }
}

export function modeKeyword(mode: "reliable" | "creative" | "viral"): string {
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
 * e.g. ["Elegant", "Witty"] -> "an elegant yet witty tone" and
 * ["Luxury", "Friendly", "Storytelling"] -> "a luxurious, friendly and
 * storytelling-driven tone". Designed to read fluently for any number of
 * combined traits (1 to many).
 */
export function personalityPhrase(traits: string[]): string {
  const clean = traits.filter(Boolean).map((t) => t.toLowerCase());
  if (clean.length === 0) return "";
  if (clean.length === 1) return `${article(clean[0])} ${clean[0]} tone`;
  if (clean.length === 2) return `${article(clean[0])} ${clean[0]} yet ${clean[1]} tone`;
  return `a tone that is ${joinNatural(clean)}`;
}
