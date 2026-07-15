"use client";

import { BrandProfile, EMPTY_BRAND_PROFILE, Locale } from "@/lib/types";

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

// A Spanish equivalent seed profile, so a user who has never filled in their
// own Brand Profile still gets a fully Spanish-language generated prompt
// when the site is set to Spanish, rather than English seed text leaking
// into an otherwise-translated result.
const DEFAULT_UMI_PROFILE_ES: BrandProfile = {
  brandName: "Umi Accessories",
  tagline: "Joyería artesanal con significado",
  voice: "Lujo cálido, elegante, narrativo",
  audience: "Mujeres de 25 a 45 años que valoran la artesanía y la expresión personal",
  products: "Pulseras, collares y aretes de piedras naturales",
  materials: "Piedras naturales, detalles en gold-filled y plata esterlina",
  colorPalette: "Crema, dorado cálido, oro rosa y tonos tierra",
  mission: "Crear joyería artesanal con significado que cuenta una historia",
  usp: "Piedras naturales seleccionadas a mano, producción en pequeños lotes y una voz de marca cálida y personal",
};

/** Note: `BrandProfile` fields (voice, audience, mission, etc.) are free text
 *  the user types into the Brand Profile page, so they can't be
 *  auto-translated once customized — only this seed/placeholder data has a
 *  Spanish counterpart. Once a user saves their own profile, whatever
 *  language they typed it in is what appears in every generated prompt. */
export function loadOrSeedBrandProfile(locale: Locale = "en"): BrandProfile {
  const current = loadBrandProfile();
  const hasAny = Object.values(current).some((v) => v && v.trim().length > 0);
  if (hasAny) return current;
  return locale === "es" ? DEFAULT_UMI_PROFILE_ES : DEFAULT_UMI_PROFILE;
}

export { DEFAULT_UMI_PROFILE, DEFAULT_UMI_PROFILE_ES };
