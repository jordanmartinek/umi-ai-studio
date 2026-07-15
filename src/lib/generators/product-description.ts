import { ComposeContext, FilterGroup, GeneratorBlueprint } from "@/lib/types";
import { brandContextSentence, modeDirective, selectedLabel } from "@/lib/prompt-engine";

export const productDescriptionGroups: FilterGroup[] = [
  {
    id: "stone",
    label: "Stone or material",
    allowCustom: true,
    customPlaceholder: "e.g. Amazonite, moonstone, labradorite...",
    options: [
      { id: "moonstone", label: "Moonstone" },
      { id: "amazonite", label: "Amazonite" },
      { id: "labradorite", label: "Labradorite" },
      { id: "rose-quartz", label: "Rose quartz" },
      { id: "turquoise", label: "Turquoise" },
      { id: "tigers-eye", label: "Tiger's eye" },
    ],
  },
  {
    id: "productType",
    label: "Product type",
    options: [
      { id: "bracelet", label: "Bracelet" },
      { id: "necklace", label: "Necklace" },
      { id: "earrings", label: "Earrings" },
      { id: "ring", label: "Ring" },
    ],
  },
  {
    id: "style",
    label: "Style",
    options: [
      { id: "elegant", label: "Elegant" },
      { id: "minimalist", label: "Minimalist" },
      { id: "bohemian", label: "Bohemian" },
      { id: "luxury", label: "Luxury" },
    ],
  },
  {
    id: "seo",
    label: "SEO optimized",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    options: [
      { id: "shopify", label: "Shopify" },
      { id: "etsy", label: "Etsy" },
      { id: "instagram", label: "Instagram Shop" },
      { id: "generic", label: "Generic storefront" },
    ],
  },
];

function findGroup(id: string) {
  return productDescriptionGroups.find((g) => g.id === id)!;
}

function build(ctx: ComposeContext, mode: "reliable" | "creative" | "viral") {
  const { selections, brand } = ctx;
  const stone = selectedLabel(findGroup("stone"), selections) || "natural gemstone";
  const productType = selectedLabel(findGroup("productType"), selections) || "piece";
  const style = selectedLabel(findGroup("style"), selections);
  const seo = selections.seo?.[0] === "yes";
  const platform = selectedLabel(findGroup("platform"), selections);

  const brandName = brand.brandName || "the brand";
  const styleText = style ? style.toLowerCase() : "elegant";
  const platformText = platform ? platform : "an ecommerce storefront";

  const opening =
    mode === "viral"
      ? `Write a bold, benefit-driven ${platformText} product description for ${brandName}'s ${stone.toLowerCase()} ${productType.toLowerCase()}, written to convert scrollers into buyers with strong emotional hooks.`
      : mode === "creative"
      ? `Write an evocative, story-driven ${platformText} product description for ${brandName}'s ${stone.toLowerCase()} ${productType.toLowerCase()}, weaving in the meaning or lore of the ${stone.toLowerCase()} stone.`
      : `Write a polished, ${styleText} ${platformText} product description for ${brandName}'s ${stone.toLowerCase()} ${productType.toLowerCase()}.`;

  const structureSentence =
    "Include a short attention-grabbing headline, 2-3 sentences of persuasive body copy covering materials, craftsmanship, and how it feels to wear, and a bullet list of 3-4 key details (materials, sizing, care instructions).";

  const seoSentence = seo
    ? "Naturally incorporate relevant SEO keywords for handmade gemstone jewelry shoppers without keyword-stuffing, and suggest a concise meta description under 155 characters."
    : "";

  const brandSentence = brandContextSentence(brand);

  return [opening, structureSentence, seoSentence, brandSentence, modeDirective(mode)]
    .filter(Boolean)
    .join(" ");
}

export const productDescriptionBlueprint: GeneratorBlueprint = {
  slug: "product-description",
  selectionGroups: productDescriptionGroups,
  compose: (ctx) => ({
    reliable: build(ctx, "reliable"),
    creative: build(ctx, "creative"),
    viral: build(ctx, "viral"),
  }),
};
