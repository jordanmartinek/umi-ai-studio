import { ComposeContext, FilterGroup, GeneratorBlueprint, Locale } from "@/lib/types";
import { brandContextSentence, modeDirective, selectedLabelLocalized } from "@/lib/prompt-engine";
import { personalityGroup, resolvePersonalityPhrase } from "@/lib/generators/shared";

const SLUG = "reply";

export const replyGroups: FilterGroup[] = [
  {
    id: "comment",
    label: "Paste the customer's comment",
    freeText: true,
    customPlaceholder: "e.g. Will this fit a small wrist?",
    options: [],
  },
  personalityGroup(),
  {
    id: "goal",
    label: "Goal",
    options: [
      { id: "answer-question", label: "Answer a question" },
      { id: "handle-concern", label: "Handle a concern" },
      { id: "thank-customer", label: "Thank the customer" },
      { id: "drive-sale", label: "Drive a sale" },
    ],
  },
];

function findGroup(id: string) {
  return replyGroups.find((g) => g.id === id)!;
}

function label(id: string, selections: ComposeContext["selections"], locale: Locale) {
  return selectedLabelLocalized(findGroup(id), selections, SLUG, locale);
}

function extractFreeText(selections: ComposeContext["selections"], groupId: string): string {
  const raw = selections[groupId]?.[0] ?? "";
  return raw.startsWith("custom:") ? raw.slice("custom:".length).trim() : raw.trim();
}

const GOAL_TEXT_ES: Record<string, string> = {
  "answer-question": "responder la pregunta con claridad",
  "handle-concern": "resolver la duda con claridad",
  "thank-customer": "agradecer a la clienta con claridad",
  "drive-sale": "impulsar una venta con claridad",
};

function buildEs(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const comment = extractFreeText(selections, "comment") || "una pregunta sobre el producto";
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections, SLUG, "es");
  const goalKey = selections.goal?.[0];

  const brandName = brand.brandName || "la marca";
  const goalText = goalKey ? GOAL_TEXT_ES[goalKey] ?? "responder la pregunta con claridad" : "responder la pregunta con claridad";

  const opening =
    mode === "viral"
      ? `Escribe una respuesta ingeniosa y muy compartible de ${brandName} a este comentario de Instagram: "${comment}", una respuesta tan buena que otros seguidores querrían capturarla o citarla.`
      : mode === "creative"
      ? `Escribe una respuesta encantadora y llena de personalidad de ${brandName} a este comentario de Instagram: "${comment}".`
      : `Escribe una respuesta de ${brandName} a este comentario de Instagram: "${comment}", usando ${personalityText || "un tono cálido"}.`;

  const goalSentence = `El objetivo principal de la respuesta es ${goalText}.`;

  const guidelines =
    "Mantén la respuesta en menos de 3 frases, usa un tono conversacional natural (no corporativo), incluye como máximo un emoji relevante y evita que suene guionizada o robótica.";

  const brandSentence = brandContextSentence(brand, "es");

  return [opening, goalSentence, guidelines, brandSentence, modeDirective(mode, "es")]
    .filter(Boolean)
    .join(" ");
}

function buildEn(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const comment = extractFreeText(selections, "comment") || "a question about the product";
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections, SLUG, "en");
  const goal = label("goal", selections, "en");

  const brandName = brand.brandName || "the brand";
  const goalText = goal ? goal.toLowerCase() : "answer the question clearly";

  const opening =
    mode === "viral"
      ? `Write a witty, highly shareable reply from ${brandName} to this Instagram comment: "${comment}" — a reply so good other followers would want to screenshot or quote it.`
      : mode === "creative"
      ? `Write a charming, personality-filled reply from ${brandName} to this Instagram comment: "${comment}".`
      : `Write a reply from ${brandName} to this Instagram comment: "${comment}", using ${personalityText || "a warm tone"}.`;

  const goalSentence = `The main goal of the reply is to ${goalText}.`;

  const guidelines =
    "Keep the reply under 3 sentences, use a natural conversational tone (not corporate), include at most one relevant emoji, and avoid sounding scripted or robotic.";

  const brandSentence = brandContextSentence(brand, "en");

  return [opening, goalSentence, guidelines, brandSentence, modeDirective(mode, "en")]
    .filter(Boolean)
    .join(" ");
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  return (ctx.locale ?? "en") === "es" ? buildEs(ctx, mode) : buildEn(ctx, mode);
}

export const replyBlueprint: GeneratorBlueprint = {
  slug: "reply",
  selectionGroups: replyGroups,
  compose: (ctx) => ({
    reliable: build(ctx, "reliable"),
    creative: build(ctx, "creative"),
    viral: build(ctx, "viral"),
  }),
};
