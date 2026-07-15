// Shared domain types for the Umi AI Studio prompt engine.

export type GenerationMode = "reliable" | "creative" | "viral";

export interface ModeMeta {
  id: GenerationMode;
  label: string;
  description: string;
}

export const GENERATION_MODES: ModeMeta[] = [
  {
    id: "reliable",
    label: "Reliable",
    description: "Safe, consistent, and predictable results.",
  },
  {
    id: "creative",
    label: "Creative",
    description: "More artistic, imaginative, and expressive.",
  },
  {
    id: "viral",
    label: "Viral",
    description: "Optimized for attention and social engagement.",
  },
];

export type PlatformId =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "midjourney"
  | "flux"
  | "ideogram"
  | "stable-diffusion";

export interface PlatformMeta {
  id: PlatformId;
  label: string;
  /** "instructional" platforms want natural-language paragraphs.
   *  "keyword" platforms want dense, comma-separated descriptor prompts. */
  promptStyle: "instructional" | "keyword";
}

export const PLATFORMS: PlatformMeta[] = [
  { id: "chatgpt", label: "ChatGPT", promptStyle: "instructional" },
  { id: "claude", label: "Claude", promptStyle: "instructional" },
  { id: "gemini", label: "Gemini", promptStyle: "instructional" },
  { id: "midjourney", label: "Midjourney", promptStyle: "keyword" },
  { id: "flux", label: "Flux", promptStyle: "keyword" },
  { id: "ideogram", label: "Ideogram", promptStyle: "keyword" },
  { id: "stable-diffusion", label: "Stable Diffusion", promptStyle: "keyword" },
];

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  helper?: string;
  /** Allow more than one option to be selected. */
  multiple?: boolean;
  /** Show a free-text input (used when "Custom" is chosen, or always if alwaysShowCustom). */
  allowCustom?: boolean;
  customPlaceholder?: string;
  /** If true, the group is not required to generate a prompt. */
  optional?: boolean;
  /** If true, render as a standalone textarea with no chips (e.g. "paste the customer's comment"). */
  freeText?: boolean;
  options: FilterOption[];
}

/** selections[groupId] = string[] of selected option ids (custom text stored under `${groupId}:custom`) */
export type Selections = Record<string, string[]>;

export interface GeneratorBlueprint {
  slug: string;
  selectionGroups: FilterGroup[];
  /** Only image/video-style generators need an AI-model platform selector
   *  (Midjourney vs. ChatGPT have very different prompt syntax). Text
   *  generators (captions, polls, etc.) can omit this entirely. */
  platformGroupId?: string;
  compose: (ctx: ComposeContext) => Record<GenerationMode, string>;
}

export interface ComposeContext {
  selections: Selections;
  brand: BrandProfile;
  /** Present only when the generator defines a platformGroupId. */
  platform?: PlatformMeta;
  extraNotes?: string;
}

export interface BrandProfile {
  brandName: string;
  tagline: string;
  voice: string;
  audience: string;
  products: string;
  materials: string;
  colorPalette: string;
  mission: string;
  usp: string;
}

export const EMPTY_BRAND_PROFILE: BrandProfile = {
  brandName: "",
  tagline: "",
  voice: "",
  audience: "",
  products: "",
  materials: "",
  colorPalette: "",
  mission: "",
  usp: "",
};
