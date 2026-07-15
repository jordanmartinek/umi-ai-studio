import { BrandProfile } from "@/lib/types";
import { brandContextSentence, modeDirective } from "@/lib/prompt-engine";

export type EnhancerContentType = "image" | "text";

const IMAGE_HINT_WORDS = [
  "photo",
  "picture",
  "image",
  "shot",
  "render",
  "drawing",
  "painting",
  "illustration",
  "logo",
  "scene",
];

/** Best-effort guess at whether a pasted prompt is describing an image vs. text content. */
export function guessContentType(raw: string): EnhancerContentType {
  const lower = raw.toLowerCase();
  return IMAGE_HINT_WORDS.some((w) => lower.includes(w)) ? "image" : "text";
}

function cleanInput(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").replace(/\.+$/, "");
}

const IMAGE_BOOSTERS: Record<"reliable" | "creative" | "viral", string[]> = {
  reliable: [
    "professional product photography",
    "soft, flattering natural light",
    "shallow depth of field",
    "clean, uncluttered composition",
    "true-to-life color accuracy",
    "high resolution, ultra-detailed",
  ],
  creative: [
    "editorial art direction",
    "an unexpected but tasteful camera angle",
    "rich, evocative lighting with depth",
    "a considered color story",
    "cinematic texture and mood",
    "high resolution, ultra-detailed",
  ],
  viral: [
    "bold, scroll-stopping composition",
    "high contrast and vivid color",
    "a single unmistakable focal point",
    "instant visual impact within the first half-second",
    "trend-aware social-media framing",
    "high resolution, ultra-detailed",
  ],
};

const TEXT_BOOSTERS: Record<"reliable" | "creative" | "viral", string[]> = {
  reliable: [
    "a clear, dependable structure",
    "polished, on-brand language",
    "a specific, natural call-to-action",
    "a tone that consistently matches the brand",
  ],
  creative: [
    "an imaginative angle or storytelling hook",
    "vivid, sensory language",
    "an unexpected but on-brand twist",
    "a memorable closing line",
  ],
  viral: [
    "an attention-grabbing opening line",
    "language engineered to spark comments, shares, or saves",
    "a bold hook within the first sentence",
    "a strong, specific call-to-action",
  ],
};

function buildImageEnhancement(
  input: string,
  mode: "reliable" | "creative" | "viral",
  brand: BrandProfile
): string {
  const boosters = IMAGE_BOOSTERS[mode];
  const brandSentence = brandContextSentence(brand);

  return [
    `Create a highly detailed, professional-quality image of: ${input}.`,
    `Incorporate ${boosters.slice(0, 3).join(", ")}, and ${boosters[3]}.`,
    `Render with ${boosters[4]} and ${boosters[5]}.`,
    brandSentence,
    modeDirective(mode),
    "Specify an aspect ratio appropriate for the intended platform (e.g. 4:5 for Instagram feed, 9:16 for Stories/Reels).",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildTextEnhancement(
  input: string,
  mode: "reliable" | "creative" | "viral",
  brand: BrandProfile
): string {
  const boosters = TEXT_BOOSTERS[mode];
  const brandSentence = brandContextSentence(brand);

  return [
    `Rewrite and expand the following idea into a polished, professional piece of marketing copy: "${input}".`,
    `Give it ${boosters[0]}, ${boosters[1]}, and ${boosters[2]}.`,
    `End with ${boosters[3]}.`,
    brandSentence,
    modeDirective(mode),
    "Keep the language natural and conversational rather than corporate or generic.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function enhancePrompt(
  rawInput: string,
  contentType: EnhancerContentType,
  brand: BrandProfile
): Record<"reliable" | "creative" | "viral", string> {
  const input = cleanInput(rawInput);
  const build = contentType === "image" ? buildImageEnhancement : buildTextEnhancement;
  return {
    reliable: build(input, "reliable", brand),
    creative: build(input, "creative", brand),
    viral: build(input, "viral", brand),
  };
}
