import { ComposeContext, FilterGroup, GeneratorBlueprint } from "@/lib/types";
import {
  article,
  brandContextSentence,
  joinNatural,
  modeDirective,
  selectedLabel,
  selectedLabels,
} from "@/lib/prompt-engine";

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
  {
    id: "voice",
    label: "Brand voice",
    options: [
      { id: "luxury", label: "Luxury" },
      { id: "friendly", label: "Friendly" },
      { id: "storytelling", label: "Storytelling" },
      { id: "educational", label: "Educational" },
      { id: "emotional", label: "Emotional" },
      { id: "elegant", label: "Elegant" },
    ],
  },
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
];

function findGroup(id: string) {
  return captionGroups.find((g) => g.id === id)!;
}

const CTA_TEXT: Record<string, string> = {
  "shop-now": "encouraging followers to shop the piece now",
  comment: "encouraging followers to comment below",
  share: "encouraging followers to share it with someone who'd love it",
  "tag-a-friend": "encouraging followers to tag a friend who needs this",
  "save-this-post": "encouraging followers to save the post for later",
};

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const subject = selectedLabel(findGroup("subject"), selections) || "piece";
  const voice = selectedLabel(findGroup("voice"), selections);
  const length = selectedLabel(findGroup("length"), selections) || "Medium";
  const audience = selectedLabels(findGroup("audience"), selections);
  const emotion = selectedLabels(findGroup("emotion"), selections);

  const brandName = brand.brandName || "the brand";
  const voiceText = voice ? voice.toLowerCase() : "warm, elegant";
  const audienceText = audience.length ? joinNatural(audience).toLowerCase() : "followers";
  const emotionText = emotion.length ? joinNatural(emotion).toLowerCase() : "confidence";
  const ctaKey = ctx.selections.cta?.[0];
  const ctaText = ctaKey ? CTA_TEXT[ctaKey] ?? "" : "";

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
      : `Write ${article(voiceText)} ${voiceText} Instagram caption for ${brandName}'s ${subject.toLowerCase()}.`;

  const audienceSentence = `Speak directly to ${audienceText} and aim to evoke a sense of ${emotionText}.`;

  const brandSentence = brandContextSentence(brand);

  const ctaSentence = ctaText
    ? `End with a clear call-to-action ${ctaText}.`
    : "End with a natural, low-pressure call-to-action.";

  return [opening, audienceSentence, lengthGuidance, brandSentence, ctaSentence, modeDirective(mode)]
    .filter(Boolean)
    .join(" ");
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
