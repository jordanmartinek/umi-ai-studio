import { ComposeContext, FilterGroup, GeneratorBlueprint } from "@/lib/types";
import { brandContextSentence, modeDirective, selectedLabel } from "@/lib/prompt-engine";

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

const FORMAT_TEXT: Record<string, string> = {
  "this-or-that": "using simple two-option \"this or that\" comparisons",
  "yes-no": "using quick yes/no questions",
  "rating-scale": "using rating-scale or slider-style questions",
  "quiz-style": "using playful quiz-style questions with a reveal",
};

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const product = selectedLabel(findGroup("product"), selections) || "collection";
  const goal = selectedLabel(findGroup("goal"), selections);
  const audience = selectedLabel(findGroup("audience"), selections);
  const formatKey = selections.format?.[0];

  const brandName = brand.brandName || "the brand";
  const goalText = goal ? goal.toLowerCase().replace(/-/g, " ") : "engagement";
  const audienceText = audience ? audience.toLowerCase() : "followers";
  const formatText = formatKey ? FORMAT_TEXT[formatKey] ?? "" : "";

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

  const brandSentence = brandContextSentence(brand);

  return [opening, purposeSentence, formatSentence, outputSentence, brandSentence, modeDirective(mode)]
    .filter(Boolean)
    .join(" ");
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
