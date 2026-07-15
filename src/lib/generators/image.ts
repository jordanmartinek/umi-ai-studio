import { ComposeContext, FilterGroup, GeneratorBlueprint } from "@/lib/types";
import {
  brandContextSentence,
  brandKeywords,
  joinKeywords,
  joinNatural,
  modeDirective,
  modeKeyword,
  platformSuffix,
  selectedLabel,
  selectedLabels,
} from "@/lib/prompt-engine";

export const imageGroups: FilterGroup[] = [
  {
    id: "subject",
    label: "What are you promoting?",
    options: [
      { id: "bracelet", label: "Bracelet" },
      { id: "necklace", label: "Necklace" },
      { id: "earrings", label: "Earrings" },
      { id: "collection", label: "Collection" },
      { id: "brand", label: "Brand" },
      { id: "lifestyle", label: "Lifestyle" },
    ],
    allowCustom: true,
    customPlaceholder: "e.g. Anklet, ring stack, gift set...",
  },
  {
    id: "goal",
    label: "Goal",
    options: [
      { id: "sell", label: "Sell" },
      { id: "inspire", label: "Inspire" },
      { id: "luxury-branding", label: "Luxury branding" },
      { id: "engagement", label: "Engagement" },
      { id: "storytelling", label: "Storytelling" },
      { id: "product-showcase", label: "Product showcase" },
      { id: "holiday-campaign", label: "Holiday campaign" },
    ],
  },
  {
    id: "style",
    label: "Style",
    multiple: true,
    options: [
      { id: "luxury", label: "Luxury" },
      { id: "minimalist", label: "Minimalist" },
      { id: "editorial", label: "Editorial" },
      { id: "fashion-magazine", label: "Fashion magazine" },
      { id: "cozy", label: "Cozy" },
      { id: "bohemian", label: "Bohemian" },
      { id: "elegant", label: "Elegant" },
      { id: "modern", label: "Modern" },
      { id: "scandinavian", label: "Scandinavian" },
      { id: "dark-luxury", label: "Dark luxury" },
      { id: "high-fashion", label: "High fashion" },
      { id: "dreamy", label: "Dreamy" },
      { id: "organic", label: "Organic" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    options: [
      { id: "golden-hour", label: "Golden hour" },
      { id: "studio", label: "Studio" },
      { id: "soft-natural", label: "Soft natural" },
      { id: "dramatic", label: "Dramatic" },
      { id: "moody", label: "Moody" },
      { id: "sunset", label: "Sunset" },
      { id: "window-light", label: "Window light" },
      { id: "backlit", label: "Backlit" },
      { id: "candlelight", label: "Candlelight" },
    ],
  },
  {
    id: "palette",
    label: "Color Palette",
    multiple: true,
    options: [
      { id: "warm-neutrals", label: "Warm neutrals" },
      { id: "earth-tones", label: "Earth tones" },
      { id: "gold", label: "Gold" },
      { id: "rose-gold", label: "Rose gold" },
      { id: "black", label: "Black" },
      { id: "white", label: "White" },
      { id: "emerald", label: "Emerald" },
      { id: "pastels", label: "Pastels" },
      { id: "vibrant", label: "Vibrant" },
    ],
  },
  {
    id: "camera",
    label: "Camera",
    options: [
      { id: "macro", label: "Macro" },
      { id: "close-up", label: "Close-up" },
      { id: "product-shot", label: "Product shot" },
      { id: "flat-lay", label: "Flat lay" },
      { id: "lifestyle-shot", label: "Lifestyle" },
      { id: "portrait", label: "Portrait" },
      { id: "overhead", label: "Overhead" },
      { id: "cinematic", label: "Cinematic" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    helper: "Different models need different prompt styles.",
    options: [
      { id: "chatgpt", label: "ChatGPT" },
      { id: "claude", label: "Claude" },
      { id: "midjourney", label: "Midjourney" },
      { id: "flux", label: "Flux" },
      { id: "ideogram", label: "Ideogram" },
      { id: "stable-diffusion", label: "Stable Diffusion" },
      { id: "gemini", label: "Gemini" },
    ],
  },
];

function findGroup(id: string) {
  return imageGroups.find((g) => g.id === id)!;
}

function buildInstructional(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const platform = ctx.platform!;
  const subject = selectedLabel(findGroup("subject"), selections) || "jewelry piece";
  const goal = selectedLabel(findGroup("goal"), selections);
  const styles = selectedLabels(findGroup("style"), selections);
  const lighting = selectedLabel(findGroup("lighting"), selections);
  const palette = selectedLabels(findGroup("palette"), selections);
  const camera = selectedLabel(findGroup("camera"), selections);

  const brandName = brand.brandName || "the brand";
  const styleText = styles.length ? joinNatural(styles).toLowerCase() : "premium editorial";
  const paletteText = palette.length ? joinNatural(palette).toLowerCase() : "warm neutral tones";

  const opening =
    mode === "viral"
      ? `Create a bold, scroll-stopping ${styleText} product photograph of a handcrafted ${subject.toLowerCase()} for ${brandName}, engineered to grab attention in a crowded social feed.`
      : mode === "creative"
      ? `Create an imaginative, art-directed ${styleText} photograph of a handcrafted ${subject.toLowerCase()} for ${brandName}, exploring an unexpected but tasteful visual concept.`
      : `Create an ultra-high-end ${styleText} product photograph of a handcrafted ${subject.toLowerCase()} for ${brandName}.`;

  const lightingSentence = lighting
    ? `Light the scene with ${lighting.toLowerCase()} light, creating soft, flattering highlights across the piece and a sense of depth.`
    : `Use soft, flattering light that creates gentle highlights and a sense of depth.`;

  const cameraSentence = camera
    ? `Capture using a ${camera.toLowerCase()} composition with a shallow depth of field, keeping the ${subject.toLowerCase()} in crisp focus while the background falls softly out of focus.`
    : `Use a shallow depth of field, keeping the ${subject.toLowerCase()} in crisp focus while the background falls softly out of focus.`;

  const goalSentence = goal
    ? `The image should be optimized for ${goal.toLowerCase().replace(/-/g, " ")}, feeling intentional and on-brief for that objective.`
    : "";

  const brandSentence = brandContextSentence(brand);

  const compositionSentence =
    mode === "viral"
      ? `The composition should feel unmissable and shareable, with strong contrast, a clear focal point, and instant visual impact within the first half-second of a scroll.`
      : mode === "creative"
      ? `The composition should feel editorial and expressive, inspired by high-fashion campaigns, while leaving room for artistic interpretation in framing and styling.`
      : `The composition should feel premium and editorial, inspired by luxury jewelry campaigns from brands like Cartier and Tiffany while maintaining a warm, artisan aesthetic.`;

  const paletteSentence = `Color palette consists of ${paletteText}. Use realistic textures, natural reflections, and avoid clutter or distracting background elements.`;

  const modeSentence = modeDirective(mode);

  const aspect =
    platform.id === "gemini" || platform.id === "chatgpt" || platform.id === "claude"
      ? "Compose for a vertical 4:5 aspect ratio, optimized for Instagram feed and Stories."
      : "";

  return [
    opening,
    lightingSentence,
    cameraSentence,
    compositionSentence,
    paletteSentence,
    goalSentence,
    brandSentence,
    modeSentence,
    aspect,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildKeyword(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const platform = ctx.platform!;
  const subject = selectedLabel(findGroup("subject"), selections) || "jewelry";
  const styles = selectedLabels(findGroup("style"), selections);
  const lighting = selectedLabel(findGroup("lighting"), selections);
  const palette = selectedLabels(findGroup("palette"), selections);
  const camera = selectedLabel(findGroup("camera"), selections);

  const keywords = [
    `handcrafted ${subject.toLowerCase()}`,
    ...styles.map((s) => s.toLowerCase()),
    camera ? `${camera.toLowerCase()} shot` : "product shot",
    lighting ? `${lighting.toLowerCase()} lighting` : "soft natural lighting",
    ...palette.map((p) => `${p.toLowerCase()} color palette`),
    ...brandKeywords(brand).map((k) => k.toLowerCase()),
    modeKeyword(mode),
    "professional product photography",
    "shallow depth of field",
    "ultra-detailed",
    "8k",
  ];

  const suffix = platformSuffix(platform);
  return joinKeywords(keywords) + (suffix ? `, ${suffix}` : "");
}

export const imageBlueprint: GeneratorBlueprint = {
  slug: "image",
  selectionGroups: imageGroups,
  platformGroupId: "platform",
  compose: (ctx) => {
    const isKeyword = ctx.platform?.promptStyle === "keyword";
    const build = isKeyword ? buildKeyword : buildInstructional;
    return {
      reliable: build(ctx, "reliable"),
      creative: build(ctx, "creative"),
      viral: build(ctx, "viral"),
    };
  },
};
