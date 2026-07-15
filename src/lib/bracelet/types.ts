import { BrandProfile, Locale, Selections } from "@/lib/types";

/**
 * Domain types for the AI Jewelry Design Studio: the Bracelet Idea
 * Generator, the Collection Generator, and the one-click Launch Package.
 *
 * These are deliberately separate from GeneratorBlueprint/ComposeContext
 * (src/lib/types.ts) because their output isn't a single prompt string —
 * it's a structured, manufacturable design concept with many discrete
 * fields (materials, gemstones, build time, etc.).
 */

export type BraceletDifficulty = "beginner" | "intermediate" | "advanced";

export interface BraceletConcept {
  id: string;
  name: string;
  collectionName: string;
  theme: string;
  inspiration: string;
  story: string;
  targetCustomer: string;
  mood: string[];
  style: string;
  occasion: string;
  colorPalette: string;
  materials: string[];
  gemstones: string[];
  metalType: string;
  cordType?: string;
  charmSuggestions: string[];
  difficulty: BraceletDifficulty;
  buildTime: string;
  whyCustomersLoveIt: string;
  /** The filter selections that produced this concept, so it can be regenerated or edited. */
  selections: Selections;
  locale: Locale;
  createdAt: string;
}

export interface BraceletCollection {
  id: string;
  collectionName: string;
  theme: string;
  story: string;
  colorPalette: string;
  aesthetic: string;
  pieces: BraceletConcept[];
  selections: Selections;
  locale: Locale;
  createdAt: string;
}

export interface LaunchPackageProduct {
  productName: string;
  collectionName: string;
  description: string;
  shortDescription: string;
  productStory: string;
}

export interface LaunchPackageMarketing {
  instagramCaption: string;
  facebookCaption: string;
  pinterestDescription: string;
  etsyDescription: string;
  shopifyDescription: string;
  seoTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  hashtags: string[];
}

export interface LaunchPackagePhotography {
  studioProductPhoto: string;
  lifestylePhoto: string;
  flatLay: string;
  editorialCampaign: string;
  holidayVersion: string;
  macroDetailShot: string;
  packagingShot: string;
  onWristLifestyle: string;
  pinterestImage: string;
  instagramCarousel: string;
}

export interface LaunchPackageVideo {
  instagramReel: string;
  tiktok: string;
  youtubeShorts: string;
  behindTheScenes: string;
  braceletMakingProcess: string;
  packagingVideo: string;
}

export interface LaunchPackageBranding {
  packagingCardMessage: string;
  thankYouCard: string;
  collectionIntroduction: string;
  websiteBannerCopy: string;
  emailLaunchAnnouncement: string;
}

export interface LaunchPackage {
  id: string;
  conceptId: string;
  conceptName: string;
  product: LaunchPackageProduct;
  marketing: LaunchPackageMarketing;
  photography: LaunchPackagePhotography;
  video: LaunchPackageVideo;
  branding: LaunchPackageBranding;
  locale: Locale;
  createdAt: string;
}

export interface ConceptGenerationInput {
  selections: Selections;
  brand: BrandProfile;
  locale: Locale;
  /** A seed to vary output between "Regenerate" clicks with the same filters. */
  seed?: number;
}
