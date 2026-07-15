import { Selections } from "@/lib/types";

export type TemplateCategory =
  | "photography"
  | "captions"
  | "stories"
  | "ecommerce"
  | "customerCare"
  | "engagement";

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "photography",
  "captions",
  "stories",
  "ecommerce",
  "customerCare",
  "engagement",
];

export interface PromptTemplate {
  /** camelCase id, also used as the key into dict.templateGallery.items */
  id: string;
  /** Must match a key in GENERATOR_REGISTRY (src/lib/generators/index.ts) */
  generatorSlug: string;
  category: TemplateCategory;
  /** Pre-filled selections using each generator's canonical group/option ids. */
  selections: Selections;
}

export const TEMPLATES: PromptTemplate[] = [
  // --- Photography (image generator) ---------------------------------
  {
    id: "luxuryProductPhotography",
    generatorSlug: "image",
    category: "photography",
    selections: {
      subject: ["bracelet"],
      goal: ["luxury-branding"],
      style: ["luxury", "editorial"],
      lighting: ["studio"],
      palette: ["gold", "warm-neutrals"],
      camera: ["product-shot"],
      platform: ["midjourney"],
    },
  },
  {
    id: "lifestylePhotography",
    generatorSlug: "image",
    category: "photography",
    selections: {
      subject: ["lifestyle"],
      goal: ["inspire"],
      style: ["cozy", "elegant"],
      lighting: ["golden-hour"],
      palette: ["earth-tones"],
      camera: ["lifestyle-shot"],
      platform: ["chatgpt"],
    },
  },
  {
    id: "flatLay",
    generatorSlug: "image",
    category: "photography",
    selections: {
      subject: ["collection"],
      goal: ["product-showcase"],
      style: ["minimalist", "modern"],
      lighting: ["soft-natural"],
      palette: ["warm-neutrals", "white"],
      camera: ["flat-lay"],
      platform: ["flux"],
    },
  },
  {
    id: "editorialCampaign",
    generatorSlug: "image",
    category: "photography",
    selections: {
      subject: ["brand"],
      goal: ["luxury-branding"],
      style: ["high-fashion", "dark-luxury"],
      lighting: ["dramatic"],
      palette: ["black", "gold"],
      camera: ["cinematic"],
      platform: ["midjourney"],
    },
  },
  {
    id: "pinterestPin",
    generatorSlug: "image",
    category: "photography",
    selections: {
      subject: ["necklace"],
      goal: ["engagement"],
      style: ["dreamy", "elegant"],
      lighting: ["soft-natural"],
      palette: ["pastels", "rose-gold"],
      camera: ["overhead"],
      platform: ["ideogram"],
    },
  },

  // --- Captions (caption generator) -----------------------------------
  {
    id: "holidaySaleCaption",
    generatorSlug: "caption",
    category: "captions",
    selections: {
      subject: ["collection"],
      voice: ["luxury"],
      length: ["medium"],
      cta: ["shop-now"],
      audience: ["existing-customers"],
      emotion: ["gratitude"],
    },
  },
  {
    id: "mothersDayCaption",
    generatorSlug: "caption",
    category: "captions",
    selections: {
      subject: ["necklace"],
      voice: ["emotional"],
      length: ["medium"],
      cta: ["tag-a-friend"],
      audience: ["gift-buyers"],
      emotion: ["gratitude"],
    },
  },
  {
    id: "valentinesDayCaption",
    generatorSlug: "caption",
    category: "captions",
    selections: {
      subject: ["bracelet"],
      voice: ["elegant"],
      length: ["short"],
      cta: ["shop-now"],
      audience: ["couples"],
      emotion: ["romance"],
    },
  },
  {
    id: "inspirationalQuoteCaption",
    generatorSlug: "caption",
    category: "captions",
    selections: {
      subject: ["brand"],
      voice: ["emotional"],
      length: ["short"],
      cta: ["save-this-post"],
      audience: ["women"],
      emotion: ["inspiration"],
    },
  },
  {
    id: "facebookAnnouncement",
    generatorSlug: "caption",
    category: "captions",
    selections: {
      subject: ["collection"],
      voice: ["friendly"],
      length: ["medium"],
      cta: ["comment"],
      audience: ["existing-customers"],
      emotion: ["confidence"],
    },
  },

  // --- Stories (story generator) ---------------------------------------
  {
    id: "newCollectionLaunch",
    generatorSlug: "story",
    category: "stories",
    selections: {
      occasion: ["new-launch"],
      theme: ["celebration"],
      personality: ["warm", "luxury"],
      length: ["5-slides"],
    },
  },
  {
    id: "behindTheScenes",
    generatorSlug: "story",
    category: "stories",
    selections: {
      occasion: ["behind-the-scenes"],
      theme: ["nostalgia"],
      personality: ["warm"],
      length: ["5-slides"],
    },
  },
  {
    id: "tiktokHook",
    generatorSlug: "story",
    category: "stories",
    selections: {
      occasion: ["day-in-the-life"],
      theme: ["adventure"],
      personality: ["playful"],
      length: ["3-slides"],
    },
  },

  // --- Ecommerce (product-description generator) -----------------------
  {
    id: "giftGuideDescription",
    generatorSlug: "product-description",
    category: "ecommerce",
    selections: {
      stone: ["moonstone"],
      productType: ["bracelet"],
      style: ["elegant"],
      seo: ["yes"],
      platform: ["shopify"],
    },
  },

  // --- Customer care (reply generator) ----------------------------------
  {
    id: "jewelryCareFaq",
    generatorSlug: "reply",
    category: "customerCare",
    selections: {
      comment: ["custom:How do I take care of my gemstone jewelry?"],
      tone: ["professional"],
      goal: ["answer-question"],
    },
  },
  {
    id: "sizingQuestionFaq",
    generatorSlug: "reply",
    category: "customerCare",
    selections: {
      comment: ["custom:Will this fit a small wrist?"],
      tone: ["reassuring"],
      goal: ["answer-question"],
    },
  },

  // --- Engagement (poll generator) ---------------------------------------
  {
    id: "giveawayPoll",
    generatorSlug: "poll",
    category: "engagement",
    selections: {
      product: ["new-collection"],
      goal: ["pre-launch-buzz"],
      audience: ["new-followers"],
      format: ["quiz-style"],
    },
  },
  {
    id: "feedbackPoll",
    generatorSlug: "poll",
    category: "engagement",
    selections: {
      product: ["bracelet"],
      goal: ["feedback"],
      audience: ["returning-customers"],
      format: ["rating-scale"],
    },
  },
];

export function getTemplate(id: string): PromptTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory | "all"): PromptTemplate[] {
  if (category === "all") return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}
