// Shared domain types for the Umi AI Studio prompt engine.

/** The active UI/output language. Defined here (rather than in i18n/locale-context)
 *  so the prompt engine and every generator can depend on it without importing
 *  the React-specific locale context module. */
export type Locale = "en" | "es";

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
  | "stable-diffusion"
  | "leonardo"
  | "firefly"
  | "runway"
  | "veo"
  | "kling"
  | "luma";

export type PlatformKind = "text" | "image" | "video";

export interface PlatformMeta {
  id: PlatformId;
  label: string;
  kind: PlatformKind;
  /** "instructional" platforms want natural-language paragraphs.
   *  "keyword" platforms want dense, comma-separated descriptor prompts. */
  promptStyle: "instructional" | "keyword";
}

export const PLATFORMS: PlatformMeta[] = [
  { id: "chatgpt", label: "ChatGPT", kind: "text", promptStyle: "instructional" },
  { id: "claude", label: "Claude", kind: "text", promptStyle: "instructional" },
  { id: "gemini", label: "Gemini", kind: "text", promptStyle: "instructional" },
  { id: "midjourney", label: "Midjourney", kind: "image", promptStyle: "keyword" },
  { id: "flux", label: "FLUX", kind: "image", promptStyle: "keyword" },
  { id: "ideogram", label: "Ideogram", kind: "image", promptStyle: "keyword" },
  { id: "stable-diffusion", label: "Stable Diffusion", kind: "image", promptStyle: "keyword" },
  { id: "leonardo", label: "Leonardo AI", kind: "image", promptStyle: "keyword" },
  { id: "firefly", label: "Adobe Firefly", kind: "image", promptStyle: "keyword" },
  { id: "runway", label: "Runway", kind: "video", promptStyle: "instructional" },
  { id: "veo", label: "Veo", kind: "video", promptStyle: "instructional" },
  { id: "kling", label: "Kling AI", kind: "video", promptStyle: "instructional" },
  { id: "luma", label: "Luma Dream Machine", kind: "video", promptStyle: "instructional" },
];

/** Image-generation-capable platforms, used by the Image generator's platform selector. */
export const IMAGE_PLATFORMS: PlatformMeta[] = PLATFORMS.filter(
  (p) => p.kind === "image" || p.kind === "text"
);

/** Video-generation-capable platforms (Runway, Veo, Kling, Luma), used by the Video generator. */
export const VIDEO_PLATFORMS: PlatformMeta[] = PLATFORMS.filter((p) => p.kind === "video");

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
  /** Groups this belongs to a collapsible FilterCategoryDef (see GeneratorBlueprint.categories).
   *  Groups without a categoryId render in an always-open "Basics" section. */
  categoryId?: string;
  /** Show a search box above the chips once options.length exceeds this many (default: always shown if > 8). */
  searchable?: boolean;
  options: FilterOption[];
}

/** A collapsible section that groups related FilterGroups together, e.g. "Visual Style", "Lighting & Mood". */
export interface FilterCategoryDef {
  id: string;
  label: string;
  helper?: string;
  icon?: string;
  defaultOpen?: boolean;
}

/** selections[groupId] = string[] of selected option ids (custom text stored under `${groupId}:custom`) */
export type Selections = Record<string, string[]>;

export interface GeneratorBlueprint {
  slug: string;
  selectionGroups: FilterGroup[];
  /** Collapsible categories that organize selectionGroups (rich generators like Image use this;
   *  simpler text generators can omit it and render a flat list instead). */
  categories?: FilterCategoryDef[];
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
  /** The language the generated prompt text itself should be written in.
   *  Defaults to "en" if omitted (all generators treat a missing locale as English). */
  locale?: Locale;
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

// --- Creative presets, favorites, and recents -----------------------------

/** A saved combination of filter selections for a specific generator, e.g. "Umi Luxury Editorial". */
export interface CreativePreset {
  id: string;
  generatorSlug: string;
  name: string;
  selections: Selections;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Per-generator memory of favorited filter options and recently-used ones. */
export interface FilterMemory {
  /** Set of `${groupId}:${optionId}` strings the user has starred. */
  favorites: string[];
  /** Most-recently-used `${groupId}:${optionId}` strings, newest first. */
  recents: string[];
}

export const EMPTY_FILTER_MEMORY: FilterMemory = { favorites: [], recents: [] };

// --- Writing personality (combinable tone traits for text generators) ----

export interface PersonalityTrait {
  id: string;
  label: string;
}

export const WRITING_PERSONALITIES: PersonalityTrait[] = [
  { id: "friendly", label: "Friendly" },
  { id: "warm", label: "Warm" },
  { id: "elegant", label: "Elegant" },
  { id: "luxurious", label: "Luxurious" },
  { id: "sophisticated", label: "Sophisticated" },
  { id: "professional", label: "Professional" },
  { id: "conversational", label: "Conversational" },
  { id: "storytelling", label: "Storytelling" },
  { id: "inspirational", label: "Inspirational" },
  { id: "motivational", label: "Motivational" },
  { id: "encouraging", label: "Encouraging" },
  { id: "empowering", label: "Empowering" },
  { id: "witty", label: "Witty" },
  { id: "clever", label: "Clever" },
  { id: "funny", label: "Funny" },
  { id: "playful", label: "Playful" },
  { id: "cheerful", label: "Cheerful" },
  { id: "bold", label: "Bold" },
  { id: "confident", label: "Confident" },
  { id: "calm", label: "Calm" },
  { id: "gentle", label: "Gentle" },
  { id: "romantic", label: "Romantic" },
  { id: "passionate", label: "Passionate" },
  { id: "authentic", label: "Authentic" },
  { id: "honest", label: "Honest" },
  { id: "heartfelt", label: "Heartfelt" },
  { id: "emotional", label: "Emotional" },
  { id: "educational", label: "Educational" },
  { id: "informative", label: "Informative" },
  { id: "persuasive", label: "Persuasive" },
  { id: "sales-focused", label: "Sales-focused" },
  { id: "premium", label: "Premium" },
  { id: "minimalist", label: "Minimalist" },
  { id: "poetic", label: "Poetic" },
  { id: "reflective", label: "Reflective" },
  { id: "adventurous", label: "Adventurous" },
  { id: "curious", label: "Curious" },
  { id: "optimistic", label: "Optimistic" },
  { id: "thought-provoking", label: "Thought-provoking" },
  { id: "aspirational", label: "Aspirational" },
];

export const CONTENT_GOALS: PersonalityTrait[] = [
  { id: "sell", label: "Sell" },
  { id: "inspire", label: "Inspire" },
  { id: "educate", label: "Educate" },
  { id: "entertain", label: "Entertain" },
  { id: "generate-comments", label: "Generate Comments" },
  { id: "increase-shares", label: "Increase Shares" },
  { id: "increase-saves", label: "Increase Saves" },
  { id: "launch-product", label: "Launch Product" },
  { id: "tell-story", label: "Tell Story" },
  { id: "build-community", label: "Build Community" },
  { id: "drive-traffic", label: "Drive Website Traffic" },
  { id: "collect-leads", label: "Collect Leads" },
  { id: "promote-event", label: "Promote Event" },
  { id: "celebrate-milestone", label: "Celebrate Milestone" },
];
