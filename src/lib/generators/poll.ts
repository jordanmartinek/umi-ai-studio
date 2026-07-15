import { ComposeContext, FilterGroup, GeneratorBlueprint, Locale } from "@/lib/types";
import { brandContextSentence, modeDirective, selectedLabelLocalized } from "@/lib/prompt-engine";

const SLUG = "poll";

export const pollGroups: FilterGroup[] = [
  {
    id: "product",
    label: "Product or collection",
    allowCustom: true,
    customPlaceholder: "e.g. New Moonstone bracelet collection",
    options: [
      { id: "bracelet", label: "Bracelet" },
      { id: "necklace", label: "Necklace" },
      { id: "earrings", label: "Earrings" },
      { id: "new-collection", label: "New collection" },
    ],
  },
  {
    id: "goal",
    label: "Goal",
    options: [
      { id: "engagement", label: "Engagement" },
      { id: "feedback", label: "Feedback" },
      { id: "product-discovery", label: "Product discovery" },
      { id: "entertainment", label: "Entertainment" },
      { id: "pre-launch-buzz", label: "Pre-launch buzz" },
    ],
  },
  {
    id: "audience",
    label: "Audience",
    options: [
      { id: "new-followers", label: "New followers" },
      { id: "returning-customers", label: "Returning customers" },
      { id: "gift-buyers", label: "Gift buyers" },
      { id: "jewelry-lovers", label: "Jewelry lovers" },
    ],
  },
  {
    id: "format",
    label: "Poll format",
    options: [
      { id: "this-or-that", label: "This or that" },
      { id: "yes-no", label: "Yes / No" },
      { id: "rating-scale", label: "Rating scale" },
      { id: "quiz-style", label: "Quiz-style" },
    ],
  },
];

function findGroup(id: string) {
  return pollGroups.find((g) => g.id === id)!;
}

function label(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelLocalized(findGroup(id), selections, SLUG, locale);
}

const FORMAT_TEXT_EN: Record<string, string> = {
  "this-or-that": "using simple two-option \"this or that\" comparisons",
  "yes-no": "using quick yes/no questions",
  "rating-scale": "using rating-scale or slider-style questions",
  "quiz-style": "using playful quiz-style questions with a reveal",
};

const FORMAT_TEXT_ES: Record<string, string> = {
  "this-or-that": "usando comparaciones sencillas de dos opciones tipo \"esto o aquello\"",
  "yes-no": "usando preguntas rápidas de sí o no",
  "rating-scale": "usando preguntas con escala de calificación o tipo deslizador",
  "quiz-style": "usando preguntas divertidas tipo cuestionario con una revelación",
};

function buildEs(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const product = label("product", selections, "es") || "colección";
  const goal = label("goal", selections, "es");
  const audience = label("audience", selections, "es");
  const formatKey = selections.format?.[0];

  const brandName = brand.brandName || "la marca";
  const goalText = goal ? goal.toLowerCase().replace(/-/g, " ") : "interacción";
  const audienceText = audience ? audience.toLowerCase() : "los seguidores";
  const formatText = formatKey ? FORMAT_TEXT_ES[formatKey] ?? "" : "";

  const count = mode === "viral" ? "12" : mode === "creative" ? "8" : "5";

  const opening =
    mode === "viral"
      ? `Genera ${count} encuestas de Historias de Instagram audaces y muy compartibles para ${product.toLowerCase()} de ${brandName}, diseñadas para maximizar respuestas, compartidos y visualizaciones repetidas.`
      : mode === "creative"
      ? `Genera ${count} encuestas de Historias de Instagram imaginativas para ${product.toLowerCase()} de ${brandName}, explorando ángulos divertidos o inesperados que sigan siendo fieles a la marca.`
      : `Genera ${count} encuestas de Historias de Instagram confiables para ${product.toLowerCase()} de ${brandName}.`;

  const purposeSentence = `El objetivo principal es ${goalText}, dirigido a ${audienceText}.`;

  const formatSentence = formatText
    ? `Escribe las encuestas ${formatText}, con cada pregunta lo bastante corta para leerse en menos de 3 segundos.`
    : "Mantén cada pregunta lo bastante corta para leerse en menos de 3 segundos.";

  const outputSentence =
    "Para cada encuesta, incluye el texto de la pregunta y las dos opciones de respuesta, en formato de lista numerada.";

  const brandSentence = brandContextSentence(brand, "es");

  return [opening, purposeSentence, formatSentence, outputSentence, brandSentence, modeDirective(mode, "es")]
    .filter(Boolean)
    .join(" ");
}

function buildEn(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const product = label("product", selections, "en") || "collection";
  const goal = label("goal", selections, "en");
  const audience = label("audience", selections, "en");
  const formatKey = selections.format?.[0];

  const brandName = brand.brandName || "the brand";
  const goalText = goal ? goal.toLowerCase().replace(/-/g, " ") : "engagement";
  const audienceText = audience ? audience.toLowerCase() : "followers";
  const formatText = formatKey ? FORMAT_TEXT_EN[formatKey] ?? "" : "";

  const count = mode === "viral" ? "12" : mode === "creative" ? "8" : "5";

  const opening =
    mode === "viral"
      ? `Generate ${count} bold, highly shareable Instagram Story polls for ${brandName}'s ${product.toLowerCase()}, designed to maximize replies, shares, and repeat views.`
      : mode === "creative"
      ? `Generate ${count} imaginative Instagram Story polls for ${brandName}'s ${product.toLowerCase()}, exploring playful or unexpected angles that still feel on-brand.`
      : `Generate ${count} reliable Instagram Story polls for ${brandName}'s ${product.toLowerCase()}.`;

  const purposeSentence = `The primary goal is ${goalText}, aimed at ${audienceText}.`;

  const formatSentence = formatText
    ? `Write the polls ${formatText}, with each question being short enough to read in under 3 seconds.`
    : "Keep each question short enough to read in under 3 seconds.";

  const outputSentence =
    "For each poll, provide the question text and both answer options, formatted as a numbered list.";

  const brandSentence = brandContextSentence(brand, "en");

  return [opening, purposeSentence, formatSentence, outputSentence, brandSentence, modeDirective(mode, "en")]
    .filter(Boolean)
    .join(" ");
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  return (ctx.locale ?? "en") === "es" ? buildEs(ctx, mode) : buildEn(ctx, mode);
}

export const pollBlueprint: GeneratorBlueprint = {
  slug: "poll",
  selectionGroups: pollGroups,
  compose: (ctx) => ({
    reliable: build(ctx, "reliable"),
    creative: build(ctx, "creative"),
    viral: build(ctx, "viral"),
  }),
};
