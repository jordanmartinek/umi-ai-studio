import { ComposeContext, FilterGroup, GeneratorBlueprint } from "@/lib/types";
import { brandContextSentence, modeDirective, selectedLabel } from "@/lib/prompt-engine";
import { personalityGroup, resolvePersonalityPhrase } from "@/lib/generators/shared";

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

function extractFreeText(selections: ComposeContext["selections"], groupId: string): string {
  const raw = selections[groupId]?.[0] ?? "";
  return raw.startsWith("custom:") ? raw.slice("custom:".length).trim() : raw.trim();
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const comment = extractFreeText(selections, "comment") || "a question about the product";
  const personalityText = resolvePersonalityPhrase(findGroup("personality"), selections);
  const goal = selectedLabel(findGroup("goal"), selections);

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

  const brandSentence = brandContextSentence(brand);

  return [opening, goalSentence, guidelines, brandSentence, modeDirective(mode)]
    .filter(Boolean)
    .join(" ");
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
