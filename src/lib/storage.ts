"use client";

import { BrandProfile, EMPTY_BRAND_PROFILE } from "@/lib/types";

const BRAND_KEY = "umi.brandProfile.v1";

export function loadBrandProfile(): BrandProfile {
  if (typeof window === "undefined") return EMPTY_BRAND_PROFILE;
  try {
    const raw = window.localStorage.getItem(BRAND_KEY);
    if (!raw) return EMPTY_BRAND_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_BRAND_PROFILE, ...parsed };
  } catch {
    return EMPTY_BRAND_PROFILE;
  }
}

export function saveBrandProfile(profile: BrandProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BRAND_KEY, JSON.stringify(profile));
}

const DEFAULT_UMI_PROFILE: BrandProfile = {
  brandName: "Umi Accessories",
  tagline: "Meaningful handmade jewelry",
  voice: "Warm luxury, elegant, storytelling",
  audience: "Women 25-45 who value craftsmanship and self-expression",
  products: "Natural gemstone bracelets, necklaces and earrings",
  materials: "Natural gemstones, gold-filled and sterling silver accents",
  colorPalette: "Cream, warm gold, rose gold, and earth tones",
  mission: "Creating meaningful handmade jewelry that tells a story",
  usp: "Hand-selected natural stones, small-batch craftsmanship, and a warm, personal brand voice",
};

export function loadOrSeedBrandProfile(): BrandProfile {
  const current = loadBrandProfile();
  const hasAny = Object.values(current).some((v) => v && v.trim().length > 0);
  return hasAny ? current : DEFAULT_UMI_PROFILE;
}

export { DEFAULT_UMI_PROFILE };
