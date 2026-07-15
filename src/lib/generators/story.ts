import { ComposeContext, FilterGroup, GeneratorBlueprint } from "@/lib/types";
import { article, brandContextSentence, modeDirective, selectedLabel } from "@/lib/prompt-engine";

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
  {
    id: "personality",
    label: "Brand personality",
    multiple: true,
    options: [
      { id: "warm", label: "Warm" },
      { id: "luxury", label: "Luxury" },
      { id: "playful", label: "Playful" },
      { id: "minimal", label: "Minimal" },
    ],
  },
  {
    id: "length",
    label: "Sequence length",
    options: [
      { id: "3-slides", label: "3 slides" },
      { id: "5-slides", label: "5 slides" },
      { id: "7-slides", label: "7 slides" },
    ],
  },
];

function findGroup(id: string) {
  return storyGroups.find((g) => g.id === id)!;
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const occasion = selectedLabel(findGroup("occasion"), selections) || "an announcement";
  const theme = selectedLabel(findGroup("theme"), selections);
  const personality = findGroup("personality")
    .options.filter((o) => selections.personality?.includes(o.id))
    .map((o) => o.label.toLowerCase());
  const length = selectedLabel(findGroup("length"), selections) || "5 slides";
  const slideCount = length.split(" ")[0];

  const brandName = brand.brandName || "the brand";
  const themeText = theme ? theme.toLowerCase() : "storytelling";
  const personalityText = personality.length ? personality.join(", ") : "warm and elegant";
  const themeArticle = article(themeText);

  const opening =
    mode === "viral"
      ? `Write a bold, highly engaging ${slideCount}-slide Instagram Story sequence for ${brandName}'s "${occasion.toLowerCase()}" moment, designed to keep viewers tapping through to the very end and sharing to their own story.`
      : mode === "creative"
      ? `Write an imaginative ${slideCount}-slide Instagram Story sequence for ${brandName}'s "${occasion.toLowerCase()}" moment, built around ${themeArticle} ${themeText} narrative arc with an unexpected creative twist.`
      : `Write a reliable ${slideCount}-slide Instagram Story sequence for ${brandName}'s "${occasion.toLowerCase()}" moment, built around ${themeArticle} ${themeText} narrative arc.`;

  const structureSentence =
    "Structure it with a clear beginning (hook), middle (build interest / show the product or moment), and end (a single clear call-to-action). For each slide, provide the on-screen text and a one-line description of the visual.";

  const personalitySentence = `The tone throughout should feel ${personalityText}.`;

  const brandSentence = brandContextSentence(brand);

  return [opening, structureSentence, personalitySentence, brandSentence, modeDirective(mode)]
    .filter(Boolean)
    .join(" ");
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
