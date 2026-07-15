import {
  ComposeContext,
  FilterCategoryDef,
  FilterGroup,
  GeneratorBlueprint,
  IMAGE_PLATFORMS,
  Locale,
} from "@/lib/types";
import {
  brandContextSentence,
  brandKeywords,
  joinKeywords,
  joinNatural,
  modeDirective,
  modeKeyword,
  platformSuffix,
  selectedLabelLocalized,
  selectedLabelsLocalized,
} from "@/lib/prompt-engine";

const SLUG = "image";

/**
 * The Image generator is the flagship "Creative Director" experience: a rich,
 * categorized set of filters (visual style, mood & lighting, color, camera &
 * composition, texture & environment, emotion & audience, and typography)
 * that compose into a single fluent, expert-level prompt.
 *
 * Only `subject` and `platform` are required — every other category is
 * optional, so the panel stays approachable even though it's deep. Every
 * group is intentionally kept under its own FilterCategoryDef so the UI can
 * render them as collapsible, searchable sections (see FilterPanel).
 */

export const imageCategories: FilterCategoryDef[] = [
  {
    id: "visual-style",
    label: "Visual Style",
    helper: "The overall creative and artistic direction of the image.",
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
    id: "camera",
    label: "Camera & Composition",
    helper: "Angle, lens, and how the frame is arranged.",
  },
  {
    id: "texture-environment",
    label: "Texture & Environment",
    helper: "Surface qualities and the setting or backdrop.",
  },
  {
    id: "emotion-audience",
    label: "Emotion & Audience",
    helper: "The feeling you want to evoke, and who it's for.",
  },
  {
    id: "typography",
    label: "Typography",
    helper: "Optional on-image text styling, for prompts that include copy.",
  },
];

export const imageGroups: FilterGroup[] = [
  // --- Basics (always visible, no category) -----------------------------
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

  // --- Visual Style -------------------------------------------------------
  {
    id: "style",
    label: "Style",
    categoryId: "visual-style",
    multiple: true,
    searchable: true,
    optional: true,
    allowCustom: true,
    customPlaceholder: "e.g. Retro film photography...",
    options: [
      // Illustration & animation
      { id: "illustration", label: "Illustration" },
      { id: "anime-2d", label: "2D Anime" },
      { id: "chibi", label: "Chibi" },
      { id: "manga", label: "Manga" },
      { id: "comic-book", label: "Comic Book" },
      { id: "storybook", label: "Storybook" },
      { id: "watercolor", label: "Watercolor" },
      { id: "oil-painting", label: "Oil Painting" },
      { id: "digital-painting", label: "Digital Painting" },
      { id: "concept-art", label: "Concept Art" },
      { id: "disney-inspired", label: "Disney-inspired" },
      { id: "pixar-inspired", label: "Pixar-inspired" },
      { id: "ghibli-inspired", label: "Studio Ghibli-inspired" },
      // Photography
      { id: "luxury-product-photography", label: "Luxury Product Photography" },
      { id: "editorial-photography", label: "Editorial Photography" },
      { id: "fashion-photography", label: "Fashion Photography" },
      { id: "lifestyle-photography", label: "Lifestyle Photography" },
      { id: "jewelry-photography", label: "Jewelry Photography" },
      { id: "macro-photography", label: "Macro Photography" },
      { id: "flat-lay-style", label: "Flat Lay" },
      { id: "portrait-style", label: "Portrait" },
      { id: "fine-art-photography", label: "Fine Art Photography" },
      // Artistic / design movements
      { id: "minimalist", label: "Minimalist" },
      { id: "maximalist", label: "Maximalist" },
      { id: "scandinavian", label: "Scandinavian" },
      { id: "art-deco", label: "Art Deco" },
      { id: "art-nouveau", label: "Art Nouveau" },
      { id: "bauhaus", label: "Bauhaus" },
      { id: "brutalist", label: "Brutalist" },
      { id: "gothic", label: "Gothic" },
      { id: "baroque", label: "Baroque" },
      { id: "futuristic", label: "Futuristic" },
      { id: "cyberpunk", label: "Cyberpunk" },
      { id: "steampunk", label: "Steampunk" },
      { id: "vaporwave", label: "Vaporwave" },
      // Cinematic
      { id: "film-noir", label: "Film Noir" },
      { id: "hollywood-blockbuster", label: "Hollywood Blockbuster" },
      { id: "wes-anderson-inspired", label: "Wes Anderson-inspired" },
      { id: "fantasy-epic", label: "Fantasy Epic" },
      { id: "sci-fi-style", label: "Sci-Fi" },
      // Gaming
      { id: "aaa-game-art", label: "AAA Game Art" },
      { id: "pixel-art", label: "Pixel Art" },
      { id: "low-poly", label: "Low Poly" },
      { id: "isometric-style", label: "Isometric" },
      // Fantasy & historical
      { id: "high-fantasy", label: "High Fantasy" },
      { id: "dark-fantasy", label: "Dark Fantasy" },
      { id: "fairy-tale", label: "Fairy Tale" },
      { id: "mythological", label: "Mythological" },
      { id: "ancient-greece", label: "Ancient Greece" },
      { id: "medieval-europe", label: "Medieval Europe" },
      { id: "victorian-england", label: "Victorian England" },
      { id: "eighties", label: "1980s" },
    ],
  },

  // --- Mood & Lighting -----------------------------------------------------
  {
    id: "mood",
    label: "Mood",
    categoryId: "mood-lighting",
    multiple: true,
    searchable: true,
    optional: true,
    options: [
      { id: "cozy", label: "Cozy" },
      { id: "warm", label: "Warm" },
      { id: "elegant", label: "Elegant" },
      { id: "luxurious", label: "Luxurious" },
      { id: "romantic", label: "Romantic" },
      { id: "sophisticated", label: "Sophisticated" },
      { id: "dreamy", label: "Dreamy" },
      { id: "nostalgic", label: "Nostalgic" },
      { id: "peaceful", label: "Peaceful" },
      { id: "joyful", label: "Joyful" },
      { id: "hopeful", label: "Hopeful" },
      { id: "confident", label: "Confident" },
      { id: "dramatic", label: "Dramatic" },
      { id: "moody", label: "Moody" },
      { id: "dark", label: "Dark" },
      { id: "minimal-mood", label: "Minimal" },
      { id: "organic", label: "Organic" },
      { id: "earthy", label: "Earthy" },
      { id: "spiritual", label: "Spiritual" },
      { id: "adventurous", label: "Adventurous" },
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
      { id: "sunrise", label: "Sunrise" },
      { id: "sunset", label: "Sunset" },
      { id: "studio-softbox", label: "Studio Softbox" },
      { id: "soft-natural", label: "Soft Natural" },
      { id: "window-light", label: "Window Light" },
      { id: "candlelight", label: "Candlelight" },
      { id: "backlit", label: "Backlit" },
      { id: "rim-lighting", label: "Rim Lighting" },
      { id: "butterfly-lighting", label: "Butterfly Lighting" },
      { id: "rembrandt-lighting", label: "Rembrandt Lighting" },
      { id: "high-key", label: "High Key" },
      { id: "low-key", label: "Low Key" },
      { id: "neon", label: "Neon" },
      { id: "moonlight", label: "Moonlight" },
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
      { id: "beige", label: "Beige" },
      { id: "cream", label: "Cream" },
      { id: "white", label: "White" },
      { id: "black", label: "Black" },
      { id: "rose-gold", label: "Rose Gold" },
      { id: "gold", label: "Gold" },
      { id: "silver", label: "Silver" },
      { id: "bronze", label: "Bronze" },
      { id: "emerald", label: "Emerald" },
      { id: "sapphire", label: "Sapphire" },
      { id: "ruby", label: "Ruby" },
      { id: "jewel-tones", label: "Jewel Tones" },
      { id: "pastels", label: "Pastels" },
      { id: "vibrant", label: "Vibrant" },
      { id: "muted", label: "Muted" },
      { id: "autumn", label: "Autumn" },
      { id: "ocean", label: "Ocean" },
      { id: "desert", label: "Desert" },
      { id: "forest", label: "Forest" },
    ],
  },

  // --- Camera & Composition -------------------------------------------------
  {
    id: "camera",
    label: "Camera Angle",
    categoryId: "camera",
    searchable: true,
    optional: true,
    options: [
      { id: "eye-level", label: "Eye Level" },
      { id: "birds-eye", label: "Bird's Eye" },
      { id: "worms-eye", label: "Worm's Eye" },
      { id: "overhead", label: "Overhead" },
      { id: "close-up", label: "Close-up" },
      { id: "extreme-close-up", label: "Extreme Close-up" },
      { id: "medium-shot", label: "Medium Shot" },
      { id: "wide-shot", label: "Wide Shot" },
      { id: "macro", label: "Macro" },
      { id: "front-view", label: "Front View" },
      { id: "side-view", label: "Side View" },
      { id: "dutch-angle", label: "Dutch Angle" },
      { id: "isometric-angle", label: "Isometric" },
      { id: "top-down", label: "Top Down" },
    ],
  },
  {
    id: "lens",
    label: "Lens",
    categoryId: "camera",
    optional: true,
    options: [
      { id: "24mm", label: "24mm" },
      { id: "35mm", label: "35mm" },
      { id: "50mm", label: "50mm" },
      { id: "85mm", label: "85mm" },
      { id: "100mm-macro", label: "100mm Macro" },
      { id: "telephoto", label: "Telephoto" },
      { id: "fisheye", label: "Fisheye" },
      { id: "wide-angle-lens", label: "Wide Angle" },
      { id: "tilt-shift", label: "Tilt Shift" },
      { id: "cinema-lens", label: "Cinema Lens" },
    ],
  },
  {
    id: "composition",
    label: "Composition",
    categoryId: "camera",
    multiple: true,
    optional: true,
    options: [
      { id: "rule-of-thirds", label: "Rule of Thirds" },
      { id: "centered", label: "Centered" },
      { id: "symmetrical", label: "Symmetrical" },
      { id: "asymmetrical", label: "Asymmetrical" },
      { id: "negative-space", label: "Negative Space" },
      { id: "leading-lines", label: "Leading Lines" },
      { id: "golden-ratio", label: "Golden Ratio" },
      { id: "frame-within-frame", label: "Frame Within Frame" },
      { id: "dynamic-composition", label: "Dynamic" },
      { id: "layered", label: "Layered" },
    ],
  },

  // --- Texture & Environment -------------------------------------------------
  {
    id: "texture",
    label: "Texture",
    categoryId: "texture-environment",
    multiple: true,
    searchable: true,
    optional: true,
    options: [
      { id: "matte", label: "Matte" },
      { id: "glossy", label: "Glossy" },
      { id: "metallic-texture", label: "Metallic" },
      { id: "glass", label: "Glass" },
      { id: "marble", label: "Marble" },
      { id: "stone", label: "Stone" },
      { id: "wood", label: "Wood" },
      { id: "linen", label: "Linen" },
      { id: "velvet", label: "Velvet" },
      { id: "silk", label: "Silk" },
      { id: "satin", label: "Satin" },
      { id: "concrete", label: "Concrete" },
      { id: "ceramic", label: "Ceramic" },
      { id: "handmade-paper", label: "Handmade Paper" },
    ],
  },
  {
    id: "environment",
    label: "Environment",
    categoryId: "texture-environment",
    searchable: true,
    optional: true,
    allowCustom: true,
    customPlaceholder: "e.g. A sunlit atelier workshop...",
    options: [
      { id: "studio-env", label: "Studio" },
      { id: "beach", label: "Beach" },
      { id: "forest-env", label: "Forest" },
      { id: "mountain", label: "Mountain" },
      { id: "desert-env", label: "Desert" },
      { id: "luxury-home", label: "Luxury Home" },
      { id: "boutique", label: "Boutique" },
      { id: "coffee-shop", label: "Coffee Shop" },
      { id: "paris-street", label: "Paris Street" },
      { id: "japanese-garden", label: "Japanese Garden" },
      { id: "greenhouse", label: "Greenhouse" },
      { id: "modern-apartment", label: "Modern Apartment" },
      { id: "cottage", label: "Cottage" },
      { id: "castle", label: "Castle" },
      { id: "museum", label: "Museum" },
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
      { id: "gratitude", label: "Gratitude" },
      { id: "joy", label: "Joy" },
      { id: "wonder", label: "Wonder" },
      { id: "curiosity", label: "Curiosity" },
      { id: "excitement", label: "Excitement" },
      { id: "confidence-emotion", label: "Confidence" },
      { id: "inspiration-emotion", label: "Inspiration" },
      { id: "serenity", label: "Serenity" },
      { id: "passion", label: "Passion" },
      { id: "comfort", label: "Comfort" },
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
      { id: "professionals", label: "Professionals" },
      { id: "brides", label: "Brides" },
      { id: "mothers", label: "Mothers" },
      { id: "couples", label: "Couples" },
      { id: "luxury-buyers", label: "Luxury Buyers" },
      { id: "budget-buyers", label: "Budget Buyers" },
      { id: "jewelry-enthusiasts", label: "Jewelry Enthusiasts" },
      { id: "fashion-lovers", label: "Fashion Lovers" },
      { id: "gift-shoppers", label: "Gift Shoppers" },
    ],
  },

  // --- Typography (optional, for prompts that include on-image text) ---------
  {
    id: "fontStyle",
    label: "Font Style",
    categoryId: "typography",
    searchable: true,
    optional: true,
    options: [
      { id: "serif", label: "Serif" },
      { id: "modern-serif", label: "Modern Serif" },
      { id: "classic-serif", label: "Classic Serif" },
      { id: "sans-serif", label: "Sans Serif" },
      { id: "geometric-sans", label: "Geometric Sans" },
      { id: "humanist-sans", label: "Humanist Sans" },
      { id: "monospace", label: "Monospace" },
      { id: "script", label: "Script" },
      { id: "handwritten", label: "Handwritten" },
      { id: "brush-script", label: "Brush Script" },
      { id: "calligraphy", label: "Calligraphy" },
      { id: "luxury-fashion-font", label: "Luxury Fashion" },
      { id: "editorial-magazine-font", label: "Editorial Magazine" },
      { id: "high-end-brand-font", label: "High-End Brand" },
      { id: "art-deco-font", label: "Art Deco" },
      { id: "vintage-font", label: "Vintage" },
      { id: "typewriter", label: "Typewriter" },
      { id: "minimalist-font", label: "Minimalist" },
      { id: "bold-display", label: "Bold Display" },
      { id: "elegant-thin", label: "Elegant Thin" },
    ],
  },
  {
    id: "fontWeight",
    label: "Font Weight",
    categoryId: "typography",
    optional: true,
    options: [
      { id: "thin", label: "Thin" },
      { id: "light", label: "Light" },
      { id: "regular", label: "Regular" },
      { id: "medium-weight", label: "Medium" },
      { id: "semi-bold", label: "Semi Bold" },
      { id: "bold", label: "Bold" },
      { id: "black-weight", label: "Black" },
    ],
  },
  {
    id: "textEffects",
    label: "Text Effects",
    categoryId: "typography",
    multiple: true,
    optional: true,
    options: [
      { id: "gold-foil", label: "Gold Foil" },
      { id: "silver-foil", label: "Silver Foil" },
      { id: "rose-gold-foil", label: "Rose Gold Foil" },
      { id: "embossed", label: "Embossed" },
      { id: "debossed", label: "Debossed" },
      { id: "metallic-text", label: "Metallic" },
      { id: "glass-text", label: "Glass" },
      { id: "neon-glow", label: "Neon Glow" },
      { id: "shadow-text", label: "Shadow" },
      { id: "outline-text", label: "Outline" },
      { id: "marble-text", label: "Marble" },
      { id: "watercolor-text", label: "Watercolor" },
      { id: "letterpress", label: "Letterpress" },
    ],
  },
  {
    id: "textPlacement",
    label: "Text Placement",
    categoryId: "typography",
    optional: true,
    options: [
      { id: "top", label: "Top" },
      { id: "bottom", label: "Bottom" },
      { id: "center", label: "Center" },
      { id: "left", label: "Left" },
      { id: "right", label: "Right" },
      { id: "overlay", label: "Overlay" },
      { id: "banner", label: "Banner" },
      { id: "floating", label: "Floating" },
      { id: "circular", label: "Circular" },
      { id: "vertical", label: "Vertical" },
    ],
  },

  // --- AI Model (basics) -------------------------------------------------
  {
    id: "platform",
    label: "AI Model",
    helper: "Different models need different prompt styles.",
    options: IMAGE_PLATFORMS.map((p) => ({ id: p.id, label: p.label })),
  },
];

function findGroup(id: string) {
  return imageGroups.find((g) => g.id === id)!;
}

function label(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelLocalized(findGroup(id), selections, SLUG, locale);
}

function labels(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelsLocalized(findGroup(id), selections, SLUG, locale);
}

function typographySentence(ctx: ComposeContext, locale: Locale): string {
  const { selections } = ctx;
  const fontStyle = label("fontStyle", selections, locale);
  const fontWeight = label("fontWeight", selections, locale);
  const effects = labels("textEffects", selections, locale);
  const placement = label("textPlacement", selections, locale);

  if (!fontStyle && !fontWeight && effects.length === 0 && !placement) return "";

  if (locale === "es") {
    const parts: string[] = [];
    if (fontStyle) {
      parts.push(`tipografía ${fontStyle.toLowerCase()}${fontWeight ? ` de peso ${fontWeight.toLowerCase()}` : ""}`);
    } else if (fontWeight) {
      parts.push(`tipografía de peso ${fontWeight.toLowerCase()}`);
    }
    if (effects.length) parts.push(`un efecto de texto ${joinNatural(effects, "es").toLowerCase()}`);
    if (placement) parts.push(`el texto ubicado en ${placement.toLowerCase()}`);
    return `Si la composición incluye texto sobre la imagen, represéntalo usando ${joinNatural(parts, "es")}.`;
  }

  const parts: string[] = [];
  if (fontStyle) {
    parts.push(`${fontWeight ? fontWeight.toLowerCase() + " " : ""}${fontStyle.toLowerCase()} typography`);
  } else if (fontWeight) {
    parts.push(`${fontWeight.toLowerCase()}-weight typography`);
  }
  if (effects.length) parts.push(`a ${joinNatural(effects).toLowerCase()} text effect`);
  if (placement) parts.push(`text placed at the ${placement.toLowerCase()}`);

  return `If the composition includes on-image text, render it using ${joinNatural(parts)}.`;
}

function cameraSentence(ctx: ComposeContext, subject: string, locale: Locale): string {
  const { selections } = ctx;
  const angle = label("camera", selections, locale);
  const lens = label("lens", selections, locale);
  const composition = labels("composition", selections, locale);

  if (locale === "es") {
    const bits: string[] = [];
    if (angle) bits.push(`un ángulo de cámara ${angle.toLowerCase()}`);
    if (lens) bits.push(`un lente ${lens}`);
    if (bits.length === 0) bits.push("una profundidad de campo reducida");

    const compositionText = composition.length
      ? ` Organiza la composición siguiendo principios de ${joinNatural(composition, "es").toLowerCase()}.`
      : "";

    return `Captura usando ${joinNatural(bits, "es")}, manteniendo ${addSpanishArticle(subject)} en foco nítido mientras el fondo queda suavemente desenfocado.${compositionText}`;
  }

  const bits: string[] = [];
  if (angle) bits.push(`a ${angle.toLowerCase()} camera angle`);
  if (lens) bits.push(`a ${lens} lens`);
  if (bits.length === 0) {
    bits.push("a shallow depth of field");
  }

  const compositionText = composition.length
    ? ` Arrange the composition using ${joinNatural(composition).toLowerCase()} principles.`
    : "";

  return `Capture using ${joinNatural(bits)}, keeping the ${subject.toLowerCase()} in crisp focus while the background falls softly out of focus.${compositionText}`;
}

function textureEnvironmentSentence(ctx: ComposeContext, locale: Locale): string {
  const { selections } = ctx;
  const textures = labels("texture", selections, locale);
  const environment = label("environment", selections, locale);

  if (locale === "es") {
    const parts: string[] = [];
    if (textures.length) parts.push(`texturas ${joinNatural(textures, "es").toLowerCase()}`);
    if (environment) parts.push(`ambientada en un entorno de ${environment.toLowerCase()}`);
    if (parts.length === 0) return "";
    return capitalizeFirst(`Incluye ${joinNatural(parts, "es")}.`);
  }

  const parts: string[] = [];
  if (textures.length) parts.push(`${joinNatural(textures).toLowerCase()} textures`);
  if (environment) parts.push(`set in ${article(environment)} ${environment.toLowerCase()} environment`);
  if (parts.length === 0) return "";
  return capitalizeFirst(`Feature ${joinNatural(parts)}.`);
}

function emotionAudienceSentence(ctx: ComposeContext, locale: Locale): string {
  const { selections } = ctx;
  const emotions = labels("emotion", selections, locale);
  const audience = label("audience", selections, locale);

  if (locale === "es") {
    const parts: string[] = [];
    if (emotions.length) parts.push(`una sensación de ${joinNatural(emotions, "es").toLowerCase()}`);
    if (audience) parts.push(`conecte con ${audience.toLowerCase()}`);
    if (parts.length === 0) return "";
    return capitalizeFirst(`La imagen debe transmitir ${joinNatural(parts, "es")}.`);
  }

  const parts: string[] = [];
  if (emotions.length) parts.push(`a feeling of ${joinNatural(emotions).toLowerCase()}`);
  if (audience) parts.push(`resonates with ${audience.toLowerCase()}`);
  if (parts.length === 0) return "";
  return capitalizeFirst(`The image should evoke ${joinNatural(parts)}.`);
}

function article(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? "an" : "a";
}

/** Best-effort "la {subject}" prefix for Spanish sentences referring back to the chosen subject.
 *  We don't track grammatical gender for custom/free-text subjects, so this always uses the
 *  feminine article, which is correct for every built-in subject option (pulsera, pieza, colección, etc.)
 *  and reads acceptably even for the rare masculine custom entry. */
function addSpanishArticle(subject: string): string {
  return `la ${subject.toLowerCase()}`;
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildInstructional(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const locale: Locale = ctx.locale ?? "en";
  const platform = ctx.platform!;
  const subject = label("subject", selections, locale) || (locale === "es" ? "la joya" : "jewelry piece");
  const goal = label("goal", selections, locale);
  const styles = labels("style", selections, locale);
  const moods = labels("mood", selections, locale);
  const lighting = label("lighting", selections, locale);
  const palette = labels("palette", selections, locale);

  const cameraSent = cameraSentence(ctx, subject, locale);
  const textureEnvSent = textureEnvironmentSentence(ctx, locale);
  const emotionAudienceSent = emotionAudienceSentence(ctx, locale);
  const typographySent = typographySentence(ctx, locale);
  const brandSentence = brandContextSentence(brand, locale);
  const modeSentence = modeDirective(mode, locale);

  if (locale === "es") {
    const brandName = brand.brandName || "la marca";
    const styleText = styles.length ? joinNatural(styles, "es").toLowerCase() : "editorial premium";
    const paletteText = palette.length ? joinNatural(palette, "es").toLowerCase() : "tonos neutros cálidos";

    const opening =
      mode === "viral"
        ? `Crea una fotografía de producto ${styleText} audaz y llamativa de ${subject.toLowerCase()} artesanal para ${brandName}, diseñada para captar la atención en un feed saturado de contenido.`
        : mode === "creative"
        ? `Crea una fotografía ${styleText} imaginativa y con dirección artística de ${subject.toLowerCase()} artesanal para ${brandName}, explorando un concepto visual inesperado pero elegante.`
        : `Crea una fotografía de producto ${styleText} de altísima gama de ${subject.toLowerCase()} artesanal para ${brandName}.`;

    const moodSentence = moods.length
      ? `El ambiente general debe sentirse ${joinNatural(moods, "es").toLowerCase()}.`
      : "";

    const lightingSentence = lighting
      ? `Ilumina la escena con luz de ${lighting.toLowerCase()}, creando reflejos suaves y favorecedores sobre la pieza y una sensación de profundidad.`
      : "Usa una luz suave y favorecedora que cree reflejos delicados y una sensación de profundidad.";

    const goalSentence = goal
      ? `La imagen debe estar optimizada para ${goal.toLowerCase().replace(/-/g, " ")}, sintiéndose intencional y fiel a ese objetivo.`
      : "";

    const compositionSentence =
      mode === "viral"
        ? "La composición debe sentirse inconfundible y fácil de compartir, con alto contraste, un punto focal claro y un impacto visual inmediato en el primer medio segundo de scroll."
        : mode === "creative"
        ? "La composición debe sentirse editorial y expresiva, inspirada en campañas de alta moda, dejando espacio para la interpretación artística en el encuadre y el estilismo."
        : "La composición debe sentirse premium y editorial, inspirada en campañas de joyería de lujo de marcas como Cartier y Tiffany, manteniendo una estética cálida y artesanal.";

    const paletteSentence = `La paleta de colores está compuesta por ${paletteText}. Usa texturas realistas, reflejos naturales y evita el desorden o elementos de fondo que distraigan.`;

    const aspect =
      platform.id === "gemini" || platform.id === "chatgpt" || platform.id === "claude"
        ? "Compón en formato vertical 4:5, optimizado para el feed y las Historias de Instagram."
        : "";

    return [
      opening,
      moodSentence,
      lightingSentence,
      cameraSent,
      compositionSentence,
      textureEnvSent,
      paletteSentence,
      emotionAudienceSent,
      typographySent,
      goalSentence,
      brandSentence,
      modeSentence,
      aspect,
    ]
      .filter(Boolean)
      .join(" ");
  }

  const brandName = brand.brandName || "the brand";
  const styleText = styles.length ? joinNatural(styles).toLowerCase() : "premium editorial";
  const paletteText = palette.length ? joinNatural(palette).toLowerCase() : "warm neutral tones";

  const opening =
    mode === "viral"
      ? `Create a bold, scroll-stopping ${styleText} product photograph of a handcrafted ${subject.toLowerCase()} for ${brandName}, engineered to grab attention in a crowded social feed.`
      : mode === "creative"
      ? `Create an imaginative, art-directed ${styleText} photograph of a handcrafted ${subject.toLowerCase()} for ${brandName}, exploring an unexpected but tasteful visual concept.`
      : `Create an ultra-high-end ${styleText} product photograph of a handcrafted ${subject.toLowerCase()} for ${brandName}.`;

  const moodSentence = moods.length
    ? `The overall mood should feel ${joinNatural(moods).toLowerCase()}.`
    : "";

  const lightingSentence = lighting
    ? `Light the scene with ${lighting.toLowerCase()} light, creating soft, flattering highlights across the piece and a sense of depth.`
    : `Use soft, flattering light that creates gentle highlights and a sense of depth.`;

  const goalSentence = goal
    ? `The image should be optimized for ${goal.toLowerCase().replace(/-/g, " ")}, feeling intentional and on-brief for that objective.`
    : "";

  const compositionSentence =
    mode === "viral"
      ? `The composition should feel unmissable and shareable, with strong contrast, a clear focal point, and instant visual impact within the first half-second of a scroll.`
      : mode === "creative"
      ? `The composition should feel editorial and expressive, inspired by high-fashion campaigns, while leaving room for artistic interpretation in framing and styling.`
      : `The composition should feel premium and editorial, inspired by luxury jewelry campaigns from brands like Cartier and Tiffany while maintaining a warm, artisan aesthetic.`;

  const paletteSentence = `Color palette consists of ${paletteText}. Use realistic textures, natural reflections, and avoid clutter or distracting background elements.`;

  const aspect =
    platform.id === "gemini" || platform.id === "chatgpt" || platform.id === "claude"
      ? "Compose for a vertical 4:5 aspect ratio, optimized for Instagram feed and Stories."
      : "";

  return [
    opening,
    moodSentence,
    lightingSentence,
    cameraSent,
    compositionSentence,
    textureEnvSent,
    paletteSentence,
    emotionAudienceSent,
    typographySent,
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
  const locale: Locale = ctx.locale ?? "en";
  const platform = ctx.platform!;
  const subject = label("subject", selections, locale) || (locale === "es" ? "joyería" : "jewelry");
  const styles = labels("style", selections, locale);
  const moods = labels("mood", selections, locale);
  const lighting = label("lighting", selections, locale);
  const palette = labels("palette", selections, locale);
  const camera = label("camera", selections, locale);
  const lens = label("lens", selections, locale);
  const composition = labels("composition", selections, locale);
  const texture = labels("texture", selections, locale);
  const environment = label("environment", selections, locale);
  const emotion = labels("emotion", selections, locale);
  const fontStyle = label("fontStyle", selections, locale);
  const textEffects = labels("textEffects", selections, locale);

  const suffix = platformSuffix(platform);

  if (locale === "es") {
    const keywords = [
      `${subject.toLowerCase()} artesanal`,
      ...styles.map((s) => s.toLowerCase()),
      ...moods.map((m) => `ambiente ${m.toLowerCase()}`),
      camera ? `toma ${camera.toLowerCase()}` : "toma de producto",
      lens ? `lente ${lens}` : "",
      lighting ? `iluminación de ${lighting.toLowerCase()}` : "iluminación natural suave",
      ...composition.map((c) => `composición ${c.toLowerCase()}`),
      ...palette.map((p) => `paleta de color ${p.toLowerCase()}`),
      ...texture.map((t) => `textura ${t.toLowerCase()}`),
      environment ? `ambientación de ${environment.toLowerCase()}` : "",
      ...emotion.map((e) => `evoca ${e.toLowerCase()}`),
      fontStyle ? `tipografía ${fontStyle.toLowerCase()}` : "",
      ...textEffects.map((t) => `efecto de texto ${t.toLowerCase()}`),
      ...brandKeywords(brand).map((k) => k.toLowerCase()),
      modeKeyword(mode, "es"),
      "fotografía de producto profesional",
      "profundidad de campo reducida",
      "ultra detallado",
      "8k",
    ];
    return joinKeywords(keywords) + (suffix ? `, ${suffix}` : "");
  }

  const keywords = [
    `handcrafted ${subject.toLowerCase()}`,
    ...styles.map((s) => s.toLowerCase()),
    ...moods.map((m) => `${m.toLowerCase()} mood`),
    camera ? `${camera.toLowerCase()} shot` : "product shot",
    lens ? `${lens} lens` : "",
    lighting ? `${lighting.toLowerCase()} lighting` : "soft natural lighting",
    ...composition.map((c) => `${c.toLowerCase()} composition`),
    ...palette.map((p) => `${p.toLowerCase()} color palette`),
    ...texture.map((t) => `${t.toLowerCase()} texture`),
    environment ? `${environment.toLowerCase()} setting` : "",
    ...emotion.map((e) => `evokes ${e.toLowerCase()}`),
    fontStyle ? `${fontStyle.toLowerCase()} typography` : "",
    ...textEffects.map((t) => `${t.toLowerCase()} text effect`),
    ...brandKeywords(brand).map((k) => k.toLowerCase()),
    modeKeyword(mode),
    "professional product photography",
    "shallow depth of field",
    "ultra-detailed",
    "8k",
  ];

  return joinKeywords(keywords) + (suffix ? `, ${suffix}` : "");
}

export const imageBlueprint: GeneratorBlueprint = {
  slug: "image",
  selectionGroups: imageGroups,
  categories: imageCategories,
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
