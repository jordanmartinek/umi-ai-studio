import { ComposeContext, FilterGroup, GeneratorBlueprint, Locale } from "@/lib/types";
import {
  brandContextSentence,
  joinNatural,
  modeDirective,
  selectedLabelLocalized,
  selectedLabelsLocalized,
} from "@/lib/prompt-engine";
import { goalGroup, personalityGroup, resolvePersonalityPhrase } from "@/lib/generators/shared";

const SLUG = "caption";

export const captionGroups: FilterGroup[] = [
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
  personalityGroup(),
  {
    id: "length",
    label: "Length",
    options: [
      { id: "short", label: "Short" },
      { id: "medium", label: "Medium" },
      { id: "long", label: "Long" },
    ],
  },
  {
    id: "cta",
    label: "Call to action",
    options: [
      { id: "shop-now", label: "Shop now" },
      { id: "comment", label: "Comment" },
      { id: "share", label: "Share" },
      { id: "tag-a-friend", label: "Tag a friend" },
      { id: "save-this-post", label: "Save this post" },
    ],
  },
  {
    id: "audience",
    label: "Audience",
    options: [
      { id: "women", label: "Women" },
      { id: "couples", label: "Couples" },
      { id: "gift-buyers", label: "Gift buyers" },
      { id: "jewelry-lovers", label: "Jewelry lovers" },
      { id: "existing-customers", label: "Existing customers" },
    ],
  },
  {
    id: "emotion",
    label: "Emotion",
    options: [
      { id: "inspiration", label: "Inspiration" },
      { id: "gratitude", label: "Gratitude" },
      { id: "confidence", label: "Confidence" },
      { id: "self-love", label: "Self-love" },
      { id: "romance", label: "Romance" },
    ],
  },
  goalGroup(),
];

function findGroup(id: string) {
  return captionGroups.find((g) => g.id === id)!;
}

function label(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelLocalized(findGroup(id), selections, SLUG, locale);
}

function labels(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelsLocalized(findGroup(id), selections, SLUG, locale);
}

const CTA_TEXT_EN: Record<string, string> = {
  "shop-now": "encouraging followers to shop the piece now",
  comment: "encouraging followers to comment below",
  share: "encouraging followers to share it with someone who'd love it",
  "tag-a-friend": "encouraging followers to tag a friend who needs this",
  "save-this-post": "encouraging followers to save the post for later",
};

const CTA_TEXT_ES: Record<string, string> = {
  "shop-now": "animando a los seguidores a comprar la pieza ahora",
  comment: "animando a los seguidores a comentar abajo",
  share: "animando a los seguidores a compartirla con alguien a quien le encantaría",
  "tag-a-friend": "animando a los seguidores a etiquetar a una amiga que la necesite",
  "save-this-post": "animando a los seguidores a guardar la publicación para más tarde",
};

function buildEs(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const subject = label("subject", selections, "es") || "la pieza";
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections, SLUG, "es");
  const length = selections.length?.[0] || "medium";
  const audience = labels("audience", selections, "es");
  const emotion = labels("emotion", selections, "es");
  const goal = label("contentGoal", selections, "es");

  const brandName = brand.brandName || "la marca";
  const audienceText = audience.length ? joinNatural(audience, "es").toLowerCase() : "los seguidores";
  const emotionText = emotion.length ? joinNatural(emotion, "es").toLowerCase() : "confianza";
  const ctaKey = selections.cta?.[0];
  const ctaText = ctaKey ? CTA_TEXT_ES[ctaKey] ?? "" : "";

  const lengthGuidance =
    length === "short"
      ? "Manténla en 1-2 frases contundentes."
      : length === "long"
      ? "Escribe 4-6 frases con espacio para una pequeña historia o un detalle que ambiente la escena."
      : "Escribe 2-4 frases que equilibren la brevedad con personalidad.";

  const opening =
    mode === "viral"
      ? `Escribe una descripción de Instagram audaz y llamativa para ${subject.toLowerCase()} de ${brandName}, diseñada para generar comentarios, compartidos y guardados.`
      : mode === "creative"
      ? `Escribe una descripción de Instagram imaginativa y narrativa para ${subject.toLowerCase()} de ${brandName}, con un ángulo fresco sin perder la esencia de la marca.`
      : `Escribe una descripción de Instagram para ${subject.toLowerCase()} de ${brandName}, usando ${personalityText || "un tono cálido y elegante"}.`;

  const audienceSentence = `Dirígete directamente a ${audienceText} y busca transmitir una sensación de ${emotionText}.`;

  const goalSentence = goal
    ? `El objetivo principal de la descripción es ${goal.toLowerCase().replace(/-/g, " ")}.`
    : "";

  const brandSentence = brandContextSentence(brand, "es");

  const ctaSentence = ctaText
    ? `Termina con un llamado a la acción claro, ${ctaText}.`
    : "Termina con un llamado a la acción natural y sin presión.";

  return [
    opening,
    audienceSentence,
    lengthGuidance,
    goalSentence,
    brandSentence,
    ctaSentence,
    modeDirective(mode, "es"),
  ]
    .filter(Boolean)
    .join(" ");
}

function buildEn(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const subject = label("subject", selections, "en") || "piece";
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections, SLUG, "en");
  const length = selections.length?.[0] || "medium";
  const audience = labels("audience", selections, "en");
  const emotion = labels("emotion", selections, "en");
  const goal = label("contentGoal", selections, "en");

  const brandName = brand.brandName || "the brand";
  const audienceText = audience.length ? joinNatural(audience).toLowerCase() : "followers";
  const emotionText = emotion.length ? joinNatural(emotion).toLowerCase() : "confidence";
  const ctaKey = selections.cta?.[0];
  const ctaText = ctaKey ? CTA_TEXT_EN[ctaKey] ?? "" : "";

  const lengthGuidance =
    length === "short"
      ? "Keep it to 1-2 punchy sentences."
      : length === "long"
      ? "Write 4-6 sentences with room for a short story or scene-setting detail."
      : "Write 2-4 sentences that balance brevity with personality.";

  const opening =
    mode === "viral"
      ? `Write a bold, scroll-stopping Instagram caption for ${brandName}'s ${subject.toLowerCase()}, written to spark comments, shares, and saves.`
      : mode === "creative"
      ? `Write an imaginative, story-driven Instagram caption for ${brandName}'s ${subject.toLowerCase()}, taking a fresh angle while staying true to the brand.`
      : `Write an Instagram caption for ${brandName}'s ${subject.toLowerCase()}, using ${personalityText || "a warm, elegant tone"}.`;

  const audienceSentence = `Speak directly to ${audienceText} and aim to evoke a sense of ${emotionText}.`;

  const goalSentence = goal
    ? `The caption's primary objective is to ${goal.toLowerCase().replace(/-/g, " ")}.`
    : "";

  const brandSentence = brandContextSentence(brand, "en");

  const ctaSentence = ctaText
    ? `End with a clear call-to-action ${ctaText}.`
    : "End with a natural, low-pressure call-to-action.";

  return [
    opening,
    audienceSentence,
    lengthGuidance,
    goalSentence,
    brandSentence,
    ctaSentence,
    modeDirective(mode, "en"),
  ]
    .filter(Boolean)
    .join(" ");
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  return (ctx.locale ?? "en") === "es" ? buildEs(ctx, mode) : buildEn(ctx, mode);
}

export const captionBlueprint: GeneratorBlueprint = {
  slug: "caption",
  selectionGroups: captionGroups,
  compose: (ctx) => ({
    reliable: build(ctx, "reliable"),
    creative: build(ctx, "creative"),
    viral: build(ctx, "viral"),
  }),
};
