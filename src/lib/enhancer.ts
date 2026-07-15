import { BrandProfile, Locale } from "@/lib/types";
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
  // Spanish equivalents, so the auto-detect heuristic works when the user
  // pastes a prompt idea while the site is set to Spanish.
  "foto",
  "imagen",
  "toma",
  "dibujo",
  "pintura",
  "ilustración",
  "escena",
];

/** Best-effort guess at whether a pasted prompt is describing an image vs. text content. */
export function guessContentType(raw: string): EnhancerContentType {
  const lower = raw.toLowerCase();
  return IMAGE_HINT_WORDS.some((w) => lower.includes(w)) ? "image" : "text";
}

function cleanInput(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").replace(/\.+$/, "");
}

const IMAGE_BOOSTERS_EN: Record<"reliable" | "creative" | "viral", string[]> = {
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

const TEXT_BOOSTERS_EN: Record<"reliable" | "creative" | "viral", string[]> = {
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

const IMAGE_BOOSTERS_ES: Record<"reliable" | "creative" | "viral", string[]> = {
  reliable: [
    "fotografía de producto profesional",
    "luz natural suave y favorecedora",
    "profundidad de campo reducida",
    "composición limpia y ordenada",
    "precisión de color fiel a la realidad",
    "alta resolución, ultra detallada",
  ],
  creative: [
    "dirección artística editorial",
    "un ángulo de cámara inesperado pero elegante",
    "una iluminación rica y evocadora con profundidad",
    "una paleta de color cuidadosamente elegida",
    "una textura y un ambiente cinematográficos",
    "alta resolución, ultra detallada",
  ],
  viral: [
    "una composición audaz que detiene el scroll",
    "alto contraste y color vibrante",
    "un único punto focal inconfundible",
    "impacto visual inmediato en el primer medio segundo",
    "un encuadre pensado para las tendencias de redes sociales",
    "alta resolución, ultra detallada",
  ],
};

const TEXT_BOOSTERS_ES: Record<"reliable" | "creative" | "viral", string[]> = {
  reliable: [
    "una estructura clara y confiable",
    "un lenguaje pulido y fiel a la marca",
    "un llamado a la acción específico y natural",
    "un tono que sea consistente con la marca",
  ],
  creative: [
    "un ángulo imaginativo o un gancho narrativo",
    "un lenguaje vívido y sensorial",
    "un giro inesperado pero fiel a la marca",
    "una frase de cierre memorable",
  ],
  viral: [
    "una línea de apertura que capte la atención",
    "un lenguaje diseñado para generar comentarios, compartidos o guardados",
    "un gancho contundente en la primera frase",
    "un llamado a la acción fuerte y específico",
  ],
};

function buildImageEnhancement(
  input: string,
  mode: "reliable" | "creative" | "viral",
  brand: BrandProfile,
  locale: Locale
): string {
  if (locale === "es") {
    const boosters = IMAGE_BOOSTERS_ES[mode];
    const brandSentence = brandContextSentence(brand, "es");
    return [
      `Crea una imagen de alta calidad y muy detallada de: ${input}.`,
      `Incorpora ${boosters.slice(0, 3).join(", ")} y ${boosters[3]}.`,
      `Renderiza con ${boosters[4]} y ${boosters[5]}.`,
      brandSentence,
      modeDirective(mode, "es"),
      "Especifica una proporción de aspecto adecuada para la plataforma de destino (por ejemplo, 4:5 para el feed de Instagram, 9:16 para Historias/Reels).",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const boosters = IMAGE_BOOSTERS_EN[mode];
  const brandSentence = brandContextSentence(brand, "en");

  return [
    `Create a highly detailed, professional-quality image of: ${input}.`,
    `Incorporate ${boosters.slice(0, 3).join(", ")}, and ${boosters[3]}.`,
    `Render with ${boosters[4]} and ${boosters[5]}.`,
    brandSentence,
    modeDirective(mode, "en"),
    "Specify an aspect ratio appropriate for the intended platform (e.g. 4:5 for Instagram feed, 9:16 for Stories/Reels).",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildTextEnhancement(
  input: string,
  mode: "reliable" | "creative" | "viral",
  brand: BrandProfile,
  locale: Locale
): string {
  if (locale === "es") {
    const boosters = TEXT_BOOSTERS_ES[mode];
    const brandSentence = brandContextSentence(brand, "es");
    return [
      `Reescribe y expande la siguiente idea en un texto de marketing pulido y profesional: "${input}".`,
      `Dale ${boosters[0]}, ${boosters[1]} y ${boosters[2]}.`,
      `Termina con ${boosters[3]}.`,
      brandSentence,
      modeDirective(mode, "es"),
      "Mantén el lenguaje natural y conversacional en lugar de corporativo o genérico.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const boosters = TEXT_BOOSTERS_EN[mode];
  const brandSentence = brandContextSentence(brand, "en");

  return [
    `Rewrite and expand the following idea into a polished, professional piece of marketing copy: "${input}".`,
    `Give it ${boosters[0]}, ${boosters[1]}, and ${boosters[2]}.`,
    `End with ${boosters[3]}.`,
    brandSentence,
    modeDirective(mode, "en"),
    "Keep the language natural and conversational rather than corporate or generic.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function enhancePrompt(
  rawInput: string,
  contentType: EnhancerContentType,
  brand: BrandProfile,
  locale: Locale = "en"
): Record<"reliable" | "creative" | "viral", string> {
  const input = cleanInput(rawInput);
  const build = contentType === "image" ? buildImageEnhancement : buildTextEnhancement;
  return {
    reliable: build(input, "reliable", brand, locale),
    creative: build(input, "creative", brand, locale),
    viral: build(input, "viral", brand, locale),
  };
}
