import { ComposeContext, FilterGroup, GeneratorBlueprint, Locale } from "@/lib/types";
import { article, brandContextSentence, modeDirective, selectedLabelLocalized } from "@/lib/prompt-engine";
import { goalGroup, resolvePersonalityPhrase, personalityGroup } from "@/lib/generators/shared";

const SLUG = "story";

export const storyGroups: FilterGroup[] = [
  {
    id: "occasion",
    label: "What are you announcing?",
    allowCustom: true,
    customPlaceholder: "e.g. Launching a new bracelet",
    options: [
      { id: "new-launch", label: "New launch" },
      { id: "restock", label: "Restock" },
      { id: "sale", label: "Sale" },
      { id: "behind-the-scenes", label: "Behind the scenes" },
      { id: "day-in-the-life", label: "Day in the life" },
    ],
  },
  {
    id: "theme",
    label: "Theme",
    options: [
      { id: "adventure", label: "Adventure" },
      { id: "romance", label: "Romance" },
      { id: "celebration", label: "Celebration" },
      { id: "calm", label: "Calm" },
      { id: "nostalgia", label: "Nostalgia" },
    ],
  },
  personalityGroup(),
  {
    id: "length",
    label: "Sequence length",
    options: [
      { id: "3-slides", label: "3 slides" },
      { id: "5-slides", label: "5 slides" },
      { id: "7-slides", label: "7 slides" },
    ],
  },
  goalGroup(),
];

function findGroup(id: string) {
  return storyGroups.find((g) => g.id === id)!;
}

function label(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelLocalized(findGroup(id), selections, SLUG, locale);
}

function buildEs(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const occasion = label("occasion", selections, "es") || "un anuncio";
  const theme = label("theme", selections, "es");
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections, SLUG, "es");
  const length = selections.length?.[0] || "5-slides";
  const slideCount = length.split("-")[0];
  const goal = label("contentGoal", selections, "es");

  const brandName = brand.brandName || "la marca";
  const themeText = theme ? theme.toLowerCase() : "narrativa";

  const opening =
    mode === "viral"
      ? `Escribe una secuencia de Historia de Instagram de ${slideCount} diapositivas audaz y muy atractiva para el momento "${occasion.toLowerCase()}" de ${brandName}, diseñada para mantener a los espectadores tocando hasta el final y compartiendo en su propia historia.`
      : mode === "creative"
      ? `Escribe una secuencia de Historia de Instagram de ${slideCount} diapositivas imaginativa para el momento "${occasion.toLowerCase()}" de ${brandName}, construida alrededor de un arco narrativo de ${themeText} con un giro creativo inesperado.`
      : `Escribe una secuencia de Historia de Instagram de ${slideCount} diapositivas confiable para el momento "${occasion.toLowerCase()}" de ${brandName}, construida alrededor de un arco narrativo de ${themeText}.`;

  const structureSentence =
    "Estructúrala con un inicio claro (gancho), un desarrollo (genera interés / muestra el producto o el momento) y un cierre (un único llamado a la acción claro). Para cada diapositiva, incluye el texto en pantalla y una descripción breve de la imagen.";

  const personalitySentence = personalityText
    ? `Escríbela con ${personalityText} durante toda la secuencia.`
    : "Escríbela con un tono cálido y elegante durante toda la secuencia.";

  const goalSentence = goal
    ? `El objetivo principal de la secuencia es ${goal.toLowerCase().replace(/-/g, " ")}.`
    : "";

  const brandSentence = brandContextSentence(brand, "es");

  return [
    opening,
    structureSentence,
    personalitySentence,
    goalSentence,
    brandSentence,
    modeDirective(mode, "es"),
  ]
    .filter(Boolean)
    .join(" ");
}

function buildEn(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const occasion = label("occasion", selections, "en") || "an announcement";
  const theme = label("theme", selections, "en");
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections, SLUG, "en");
  const length = selections.length?.[0] || "5-slides";
  const slideCount = length.split("-")[0];
  const goal = label("contentGoal", selections, "en");

  const brandName = brand.brandName || "the brand";
  const themeText = theme ? theme.toLowerCase() : "storytelling";
  const themeArticle = article(themeText);

  const opening =
    mode === "viral"
      ? `Write a bold, highly engaging ${slideCount}-slide Instagram Story sequence for ${brandName}'s "${occasion.toLowerCase()}" moment, designed to keep viewers tapping through to the very end and sharing to their own story.`
      : mode === "creative"
      ? `Write an imaginative ${slideCount}-slide Instagram Story sequence for ${brandName}'s "${occasion.toLowerCase()}" moment, built around ${themeArticle} ${themeText} narrative arc with an unexpected creative twist.`
      : `Write a reliable ${slideCount}-slide Instagram Story sequence for ${brandName}'s "${occasion.toLowerCase()}" moment, built around ${themeArticle} ${themeText} narrative arc.`;

  const structureSentence =
    "Structure it with a clear beginning (hook), middle (build interest / show the product or moment), and end (a single clear call-to-action). For each slide, provide the on-screen text and a one-line description of the visual.";

  const personalitySentence = personalityText
    ? `Write it with ${personalityText} throughout.`
    : "Write it with a warm, elegant tone throughout.";

  const goalSentence = goal
    ? `The sequence's primary objective is to ${goal.toLowerCase().replace(/-/g, " ")}.`
    : "";

  const brandSentence = brandContextSentence(brand, "en");

  return [
    opening,
    structureSentence,
    personalitySentence,
    goalSentence,
    brandSentence,
    modeDirective(mode, "en"),
  ]
    .filter(Boolean)
    .join(" ");
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  return (ctx.locale ?? "en") === "es" ? buildEs(ctx, mode) : buildEn(ctx, mode);
}

export const storyBlueprint: GeneratorBlueprint = {
  slug: "story",
  selectionGroups: storyGroups,
  compose: (ctx) => ({
    reliable: build(ctx, "reliable"),
    creative: build(ctx, "creative"),
    viral: build(ctx, "viral"),
  }),
};
