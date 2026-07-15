import {
  ComposeContext,
  FilterCategoryDef,
  FilterGroup,
  GeneratorBlueprint,
  Locale,
  VIDEO_PLATFORMS,
} from "@/lib/types";
import {
  brandContextSentence,
  joinNatural,
  modeDirective,
  selectedLabelLocalized,
  selectedLabelsLocalized,
  videoPlatformDirective,
} from "@/lib/prompt-engine";

const SLUG = "video";

/**
 * The Video generator mirrors the Image generator's "Creative Director"
 * approach but is tuned for short-form AI video (Runway, Veo, Kling AI, Luma
 * Dream Machine): camera movement and pacing replace static camera angle,
 * and every video platform is instructional (there's no keyword-style video
 * model the way Midjourney/FLUX are for images).
 */

export const videoCategories: FilterCategoryDef[] = [
  {
    id: "visual-style",
    label: "Visual Style",
    helper: "The overall creative and artistic direction of the video.",
    defaultOpen: true,
  },
  {
    id: "motion",
    label: "Motion & Camera Movement",
    helper: "How the camera and subject move over the course of the clip.",
    defaultOpen: true,
  },
  {
    id: "mood-lighting",
    label: "Mood & Lighting",
    helper: "The emotional atmosphere and how the scene is lit.",
  },
  {
    id: "color",
    label: "Color Palette",
    helper: "The dominant colors and tonal range.",
  },
  {
    id: "environment",
    label: "Environment",
    helper: "The setting or backdrop for the scene.",
  },
  {
    id: "emotion-audience",
    label: "Emotion & Audience",
    helper: "The feeling you want to evoke, and who it's for.",
  },
];

export const videoGroups: FilterGroup[] = [
  // --- Basics -------------------------------------------------------------
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
    optional: true,
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

  // --- Visual Style --------------------------------------------------------
  {
    id: "style",
    label: "Style",
    categoryId: "visual-style",
    multiple: true,
    searchable: true,
    optional: true,
    allowCustom: true,
    customPlaceholder: "e.g. Retro film look...",
    options: [
      { id: "luxury-product-photography", label: "Luxury Product Cinematography" },
      { id: "editorial-photography", label: "Editorial" },
      { id: "fashion-photography", label: "Fashion Film" },
      { id: "lifestyle-photography", label: "Lifestyle" },
      { id: "documentary", label: "Documentary" },
      { id: "hollywood-blockbuster", label: "Hollywood Blockbuster" },
      { id: "wes-anderson-inspired", label: "Wes Anderson-inspired" },
      { id: "ghibli-inspired", label: "Studio Ghibli-inspired" },
      { id: "dreamy-animation", label: "Dreamy Animation" },
      { id: "stop-motion", label: "Stop Motion" },
      { id: "minimalist", label: "Minimalist" },
      { id: "cyberpunk", label: "Cyberpunk" },
      { id: "vintage-film", label: "Vintage Film" },
    ],
  },

  // --- Motion & Camera Movement ----------------------------------------
  {
    id: "cameraMovement",
    label: "Camera Movement",
    categoryId: "motion",
    optional: true,
    options: [
      { id: "slow-push-in", label: "Slow Push-in" },
      { id: "slow-pull-out", label: "Slow Pull-out" },
      { id: "pan-left-right", label: "Pan Left to Right" },
      { id: "orbit", label: "Orbit / Rotate Around" },
      { id: "static-locked", label: "Static / Locked-off" },
      { id: "handheld", label: "Handheld" },
      { id: "crane-up", label: "Crane Up" },
      { id: "dolly-forward", label: "Dolly Forward" },
      { id: "tracking-shot", label: "Tracking Shot" },
      { id: "drone-aerial", label: "Drone / Aerial" },
    ],
  },
  {
    id: "motionType",
    label: "Subject Motion",
    categoryId: "motion",
    multiple: true,
    optional: true,
    options: [
      { id: "gentle-sway", label: "Gentle Sway" },
      { id: "slow-rotation", label: "Slow Rotation" },
      { id: "falling-particles", label: "Falling Particles / Sparkle" },
      { id: "fabric-flowing", label: "Flowing Fabric" },
      { id: "hair-in-motion", label: "Hair in Motion" },
      { id: "hand-movement", label: "Hand Movement" },
      { id: "light-flicker", label: "Flickering Light" },
      { id: "water-ripple", label: "Water Ripple" },
      { id: "wind-through-leaves", label: "Wind Through Leaves" },
    ],
  },
  {
    id: "pacing",
    label: "Pacing & Duration",
    categoryId: "motion",
    optional: true,
    options: [
      { id: "4-seconds", label: "4 seconds, slow" },
      { id: "6-seconds", label: "6 seconds, moderate" },
      { id: "8-seconds", label: "8 seconds, cinematic" },
      { id: "fast-cut", label: "Fast-paced / quick cuts" },
      { id: "single-continuous-take", label: "Single continuous take" },
    ],
  },

  // --- Mood & Lighting ------------------------------------------------------
  {
    id: "mood",
    label: "Mood",
    categoryId: "mood-lighting",
    multiple: true,
    searchable: true,
    optional: true,
    options: [
      { id: "cozy", label: "Cozy" },
      { id: "elegant", label: "Elegant" },
      { id: "luxurious", label: "Luxurious" },
      { id: "romantic", label: "Romantic" },
      { id: "dreamy", label: "Dreamy" },
      { id: "peaceful", label: "Peaceful" },
      { id: "joyful", label: "Joyful" },
      { id: "dramatic", label: "Dramatic" },
      { id: "moody", label: "Moody" },
      { id: "nostalgic", label: "Nostalgic" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    categoryId: "mood-lighting",
    searchable: true,
    optional: true,
    options: [
      { id: "golden-hour", label: "Golden Hour" },
      { id: "blue-hour", label: "Blue Hour" },
      { id: "studio-softbox", label: "Studio Softbox" },
      { id: "soft-natural", label: "Soft Natural" },
      { id: "backlit", label: "Backlit" },
      { id: "candlelight", label: "Candlelight" },
      { id: "neon", label: "Neon" },
      { id: "volumetric-rays", label: "Volumetric Rays" },
      { id: "overcast", label: "Overcast" },
    ],
  },

  // --- Color Palette --------------------------------------------------------
  {
    id: "palette",
    label: "Color Palette",
    categoryId: "color",
    multiple: true,
    searchable: true,
    optional: true,
    options: [
      { id: "warm-neutrals", label: "Warm Neutrals" },
      { id: "earth-tones", label: "Earth Tones" },
      { id: "gold", label: "Gold" },
      { id: "rose-gold", label: "Rose Gold" },
      { id: "black", label: "Black" },
      { id: "white", label: "White" },
      { id: "pastels", label: "Pastels" },
      { id: "vibrant", label: "Vibrant" },
      { id: "muted", label: "Muted" },
    ],
  },

  // --- Environment ----------------------------------------------------------
  {
    id: "environment",
    label: "Environment",
    categoryId: "environment",
    searchable: true,
    optional: true,
    allowCustom: true,
    customPlaceholder: "e.g. A sunlit atelier workshop...",
    options: [
      { id: "studio-env", label: "Studio" },
      { id: "beach", label: "Beach" },
      { id: "forest-env", label: "Forest" },
      { id: "luxury-home", label: "Luxury Home" },
      { id: "boutique", label: "Boutique" },
      { id: "coffee-shop", label: "Coffee Shop" },
      { id: "paris-street", label: "Paris Street" },
      { id: "japanese-garden", label: "Japanese Garden" },
      { id: "modern-apartment", label: "Modern Apartment" },
    ],
  },

  // --- Emotion & Audience -----------------------------------------------------
  {
    id: "emotion",
    label: "Emotion",
    categoryId: "emotion-audience",
    multiple: true,
    optional: true,
    options: [
      { id: "love", label: "Love" },
      { id: "joy", label: "Joy" },
      { id: "wonder", label: "Wonder" },
      { id: "excitement", label: "Excitement" },
      { id: "confidence-emotion", label: "Confidence" },
      { id: "serenity", label: "Serenity" },
      { id: "hope", label: "Hope" },
    ],
  },
  {
    id: "audience",
    label: "Target Audience",
    categoryId: "emotion-audience",
    optional: true,
    options: [
      { id: "women-18-24", label: "Women 18–24" },
      { id: "women-25-35", label: "Women 25–35" },
      { id: "women-35-50", label: "Women 35–50" },
      { id: "brides", label: "Brides" },
      { id: "gift-shoppers", label: "Gift Shoppers" },
      { id: "luxury-buyers", label: "Luxury Buyers" },
    ],
  },

  // --- AI Model (basics) -------------------------------------------------
  {
    id: "platform",
    label: "AI Model",
    helper: "Different models favor different camera moves and pacing.",
    options: VIDEO_PLATFORMS.map((p) => ({ id: p.id, label: p.label })),
  },
];

function findGroup(id: string) {
  return videoGroups.find((g) => g.id === id)!;
}

function label(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelLocalized(findGroup(id), selections, SLUG, locale);
}

function labels(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelsLocalized(findGroup(id), selections, SLUG, locale);
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildEs(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const platform = ctx.platform!;
  const subject = label("subject", selections, "es") || "la pieza de joyería";
  const goal = label("goal", selections, "es");
  const styles = labels("style", selections, "es");
  const cameraMovement = label("cameraMovement", selections, "es");
  const motionTypes = labels("motionType", selections, "es");
  const pacing = label("pacing", selections, "es");
  const moods = labels("mood", selections, "es");
  const lighting = label("lighting", selections, "es");
  const palette = labels("palette", selections, "es");
  const environment = label("environment", selections, "es");
  const emotions = labels("emotion", selections, "es");
  const audience = label("audience", selections, "es");

  const brandName = brand.brandName || "la marca";
  const styleText = styles.length ? joinNatural(styles, "es").toLowerCase() : "editorial premium";
  const paletteText = palette.length ? joinNatural(palette, "es").toLowerCase() : "tonos neutros cálidos";

  const opening =
    mode === "viral"
      ? `Crea un video ${styleText} audaz y llamativo de ${subject.toLowerCase()} artesanal para ${brandName}, diseñado para captar la atención en el primer segundo.`
      : mode === "creative"
      ? `Crea un video ${styleText} imaginativo y con dirección artística de ${subject.toLowerCase()} artesanal para ${brandName}, explorando un concepto visual inesperado pero elegante.`
      : `Crea un video ${styleText} de altísima gama de ${subject.toLowerCase()} artesanal para ${brandName}.`;

  const cameraSentence = cameraMovement
    ? `Usa un movimiento de cámara de ${cameraMovement.toLowerCase()}, manteniendo ${subject.toLowerCase()} claramente legible y en foco durante todo el clip.`
    : `Usa un movimiento de cámara lento y deliberado, manteniendo ${subject.toLowerCase()} claramente legible y en foco durante todo el clip.`;

  const motionSentence = motionTypes.length
    ? `Da vida a la escena con ${joinNatural(motionTypes, "es").toLowerCase()}.`
    : "";

  const pacingSentence = pacing ? `El clip debe durar ${pacing.toLowerCase()}.` : "";

  const moodSentence = moods.length
    ? `El ambiente general debe sentirse ${joinNatural(moods, "es").toLowerCase()}.`
    : "";

  const lightingSentence = lighting
    ? `Ilumina la escena con luz de ${lighting.toLowerCase()}, manteniendo la iluminación consistente en cada cuadro del clip.`
    : "Usa una iluminación suave, favorecedora y consistente en cada cuadro del clip.";

  const environmentSentence = environment
    ? `Ambienta la escena en un entorno de ${environment.toLowerCase()}.`
    : "";

  const paletteSentence = `La paleta de colores está compuesta por ${paletteText}, con texturas realistas y reflejos naturales a lo largo del movimiento.`;

  const emotionAudienceSentence =
    emotions.length || audience
      ? capitalizeFirst(
          [
            emotions.length ? `El video debe transmitir una sensación de ${joinNatural(emotions, "es").toLowerCase()}` : "",
            audience ? `conectar con ${audience.toLowerCase()}` : "",
          ]
            .filter(Boolean)
            .join(" y ") + "."
        )
      : "";

  const goalSentence = goal
    ? `El video debe estar optimizado para ${goal.toLowerCase().replace(/-/g, " ")}, sintiéndose intencional y fiel a ese objetivo.`
    : "";

  const brandSentence = brandContextSentence(brand, "es");
  const platformDirective = videoPlatformDirective(platform, "es");
  const modeSentence = modeDirective(mode, "es");

  return [
    opening,
    cameraSentence,
    motionSentence,
    pacingSentence,
    moodSentence,
    lightingSentence,
    environmentSentence,
    paletteSentence,
    emotionAudienceSentence,
    goalSentence,
    brandSentence,
    platformDirective,
    modeSentence,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildEn(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const platform = ctx.platform!;
  const subject = label("subject", selections, "en") || "jewelry piece";
  const goal = label("goal", selections, "en");
  const styles = labels("style", selections, "en");
  const cameraMovement = label("cameraMovement", selections, "en");
  const motionTypes = labels("motionType", selections, "en");
  const pacing = label("pacing", selections, "en");
  const moods = labels("mood", selections, "en");
  const lighting = label("lighting", selections, "en");
  const palette = labels("palette", selections, "en");
  const environment = label("environment", selections, "en");
  const emotions = labels("emotion", selections, "en");
  const audience = label("audience", selections, "en");

  const brandName = brand.brandName || "the brand";
  const styleText = styles.length ? joinNatural(styles).toLowerCase() : "premium editorial";
  const paletteText = palette.length ? joinNatural(palette).toLowerCase() : "warm neutral tones";

  const opening =
    mode === "viral"
      ? `Create a bold, scroll-stopping ${styleText} video of a handcrafted ${subject.toLowerCase()} for ${brandName}, engineered to stop the scroll within the first second.`
      : mode === "creative"
      ? `Create an imaginative, art-directed ${styleText} video of a handcrafted ${subject.toLowerCase()} for ${brandName}, exploring an unexpected but tasteful visual concept.`
      : `Create an ultra-high-end ${styleText} video of a handcrafted ${subject.toLowerCase()} for ${brandName}.`;

  const cameraSentence = cameraMovement
    ? `Use a ${cameraMovement.toLowerCase()} camera movement, keeping the ${subject.toLowerCase()} clearly readable and in focus throughout.`
    : `Use a slow, deliberate camera movement, keeping the ${subject.toLowerCase()} clearly readable and in focus throughout.`;

  const motionSentence = motionTypes.length
    ? `Bring the scene to life with ${joinNatural(motionTypes).toLowerCase()}.`
    : "";

  const pacingSentence = pacing
    ? `The clip should run ${pacing.toLowerCase().replace(/^(\d)/, "$1")}.`
    : "";

  const moodSentence = moods.length
    ? `The overall mood should feel ${joinNatural(moods).toLowerCase()}.`
    : "";

  const lightingSentence = lighting
    ? `Light the scene with ${lighting.toLowerCase()} light, keeping the lighting consistent across every frame of the clip.`
    : "Use soft, flattering, consistent lighting across every frame of the clip.";

  const environmentSentence = environment
    ? `Set the scene in ${/^[aeiou]/i.test(environment) ? "an" : "a"} ${environment.toLowerCase()} environment.`
    : "";

  const paletteSentence = `Color palette consists of ${paletteText}, with realistic textures and natural reflections throughout the motion.`;

  const emotionAudienceSentence =
    emotions.length || audience
      ? capitalizeFirst(
          [
            emotions.length ? `The video should evoke a feeling of ${joinNatural(emotions).toLowerCase()}` : "",
            audience ? `resonate with ${audience.toLowerCase()}` : "",
          ]
            .filter(Boolean)
            .join(" and ") + "."
        )
      : "";

  const goalSentence = goal
    ? `The video should be optimized for ${goal.toLowerCase().replace(/-/g, " ")}, feeling intentional and on-brief for that objective.`
    : "";

  const brandSentence = brandContextSentence(brand, "en");
  const platformDirective = videoPlatformDirective(platform, "en");
  const modeSentence = modeDirective(mode, "en");

  return [
    opening,
    cameraSentence,
    motionSentence,
    pacingSentence,
    moodSentence,
    lightingSentence,
    environmentSentence,
    paletteSentence,
    emotionAudienceSentence,
    goalSentence,
    brandSentence,
    platformDirective,
    modeSentence,
  ]
    .filter(Boolean)
    .join(" ");
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  return (ctx.locale ?? "en") === "es" ? buildEs(ctx, mode) : buildEn(ctx, mode);
}

export const videoBlueprint: GeneratorBlueprint = {
  slug: "video",
  selectionGroups: videoGroups,
  categories: videoCategories,
  platformGroupId: "platform",
  compose: (ctx) => ({
    reliable: build(ctx, "reliable"),
    creative: build(ctx, "creative"),
    viral: build(ctx, "viral"),
  }),
};
