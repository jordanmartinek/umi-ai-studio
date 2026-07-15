import { FilterCategoryDef, FilterGroup } from "@/lib/types";

/**
 * The Creative Filters taxonomy for the Bracelet Idea Generator. Structured
 * as FilterGroup[]/FilterCategoryDef[] so it can reuse the existing
 * FilterPanel/Chip/CategorySection UI components, even though bracelet
 * concepts aren't produced via GeneratorBlueprint.compose().
 */

export const braceletCategories: FilterCategoryDef[] = [
  {
    id: "creative-direction",
    label: "Theme & Style",
    helper: "The creative world this bracelet lives in.",
    defaultOpen: true,
  },
  {
    id: "feeling",
    label: "Aesthetic & Emotion",
    helper: "The vibe and feeling the piece should evoke.",
    defaultOpen: true,
  },
  {
    id: "occasion-color",
    label: "Occasion & Color",
    helper: "Who it's for and the palette it should live in.",
  },
  {
    id: "materials",
    label: "Materials",
    helper: "What it should actually be made from.",
  },
];

export const braceletGroups: FilterGroup[] = [
  // --- Theme & Style --------------------------------------------------
  {
    id: "theme",
    label: "Theme",
    categoryId: "creative-direction",
    searchable: true,
    optional: true,
    allowCustom: true,
    customPlaceholder: "e.g. Northern lights, coral reef...",
    options: [
      { id: "flowers", label: "Flowers" },
      { id: "ocean", label: "Ocean" },
      { id: "forest", label: "Forest" },
      { id: "mountains", label: "Mountains" },
      { id: "desert", label: "Desert" },
      { id: "moon", label: "Moon" },
      { id: "stars", label: "Stars" },
      { id: "zodiac", label: "Zodiac" },
      { id: "butterflies", label: "Butterflies" },
      { id: "bees", label: "Bees" },
      { id: "autumn", label: "Autumn" },
      { id: "spring", label: "Spring" },
      { id: "winter", label: "Winter" },
      { id: "summer", label: "Summer" },
      { id: "japanese", label: "Japanese" },
      { id: "scandinavian-theme", label: "Scandinavian" },
      { id: "vintage-theme", label: "Vintage" },
      { id: "botanical", label: "Botanical" },
      { id: "celestial", label: "Celestial" },
      { id: "woodland", label: "Woodland" },
      { id: "tropical", label: "Tropical" },
    ],
  },
  {
    id: "style",
    label: "Bracelet Style",
    categoryId: "creative-direction",
    searchable: true,
    optional: true,
    options: [
      // Beaded
      { id: "gemstone-beaded", label: "Gemstone Beaded" },
      { id: "seed-bead", label: "Seed Bead" },
      { id: "czech-glass", label: "Czech Glass" },
      { id: "pearl-beaded", label: "Pearl" },
      { id: "crystal-beaded", label: "Crystal" },
      { id: "mixed-beads", label: "Mixed Beads" },
      // Thread
      { id: "friendship", label: "Friendship" },
      { id: "macrame", label: "Macramé" },
      { id: "braided", label: "Braided" },
      { id: "silk-thread", label: "Silk" },
      { id: "waxed-cord", label: "Waxed Cord" },
      { id: "adjustable-knot", label: "Adjustable Knot" },
      // Metal
      { id: "chain", label: "Chain" },
      { id: "paperclip", label: "Paperclip" },
      { id: "cuban", label: "Cuban" },
      { id: "figaro", label: "Figaro" },
      { id: "bangle", label: "Bangle" },
      { id: "cuff", label: "Cuff" },
      { id: "wire-wrapped", label: "Wire Wrapped" },
      // Natural
      { id: "wood-style", label: "Wood" },
      { id: "lava-stone", label: "Lava Stone" },
      { id: "shell", label: "Shell" },
      { id: "mother-of-pearl", label: "Mother of Pearl" },
      { id: "leather-style", label: "Leather" },
      { id: "hemp-style", label: "Hemp" },
    ],
  },

  // --- Aesthetic & Emotion --------------------------------------------
  {
    id: "aesthetic",
    label: "Aesthetic",
    categoryId: "feeling",
    multiple: true,
    searchable: true,
    optional: true,
    options: [
      { id: "quiet-luxury", label: "Quiet Luxury" },
      { id: "old-money", label: "Old Money" },
      { id: "minimalist-aesthetic", label: "Minimalist" },
      { id: "modern-organic", label: "Modern Organic" },
      { id: "cottagecore", label: "Cottagecore" },
      { id: "fairycore", label: "Fairycore" },
      { id: "boho", label: "Boho" },
      { id: "romantic-aesthetic", label: "Romantic" },
      { id: "editorial-aesthetic", label: "Editorial" },
      { id: "vintage-aesthetic", label: "Vintage" },
      { id: "coastal", label: "Coastal" },
      { id: "rustic", label: "Rustic" },
      { id: "scandinavian-aesthetic", label: "Scandinavian" },
      { id: "parisian", label: "Parisian" },
      { id: "art-deco-aesthetic", label: "Art Deco" },
      { id: "gothic-aesthetic", label: "Gothic" },
      { id: "steampunk-aesthetic", label: "Steampunk" },
      { id: "cyberpunk-aesthetic", label: "Cyberpunk" },
      { id: "fantasy-aesthetic", label: "Fantasy" },
      { id: "ethereal", label: "Ethereal" },
    ],
  },
  {
    id: "emotion",
    label: "Emotion",
    categoryId: "feeling",
    multiple: true,
    optional: true,
    options: [
      { id: "peaceful", label: "Peaceful" },
      { id: "confident", label: "Confident" },
      { id: "romantic-emotion", label: "Romantic" },
      { id: "feminine", label: "Feminine" },
      { id: "powerful", label: "Powerful" },
      { id: "cozy", label: "Cozy" },
      { id: "joyful", label: "Joyful" },
      { id: "delicate", label: "Delicate" },
      { id: "adventurous", label: "Adventurous" },
      { id: "elegant", label: "Elegant" },
      { id: "nostalgic", label: "Nostalgic" },
      { id: "hopeful", label: "Hopeful" },
    ],
  },

  // --- Occasion & Color --------------------------------------------------
  {
    id: "occasion",
    label: "Occasion",
    categoryId: "occasion-color",
    optional: true,
    options: [
      { id: "everyday-wear", label: "Everyday Wear" },
      { id: "birthday", label: "Birthday" },
      { id: "wedding", label: "Wedding" },
      { id: "bridesmaid", label: "Bridesmaid" },
      { id: "anniversary", label: "Anniversary" },
      { id: "mothers-day", label: "Mother's Day" },
      { id: "christmas", label: "Christmas" },
      { id: "valentines-day", label: "Valentine's Day" },
      { id: "graduation", label: "Graduation" },
      { id: "friendship-occasion", label: "Friendship" },
      { id: "self-love", label: "Self Love" },
    ],
  },
  {
    id: "colorPalette",
    label: "Color Palette",
    categoryId: "occasion-color",
    searchable: true,
    optional: true,
    options: [
      { id: "cream-gold", label: "Cream & Gold" },
      { id: "earth-tones", label: "Earth Tones" },
      { id: "sage-green", label: "Sage Green" },
      { id: "ocean-blues", label: "Ocean Blues" },
      { id: "sunset", label: "Sunset" },
      { id: "autumn-palette", label: "Autumn" },
      { id: "monochrome", label: "Monochrome" },
      { id: "jewel-tones", label: "Jewel Tones" },
      { id: "pastel", label: "Pastel" },
      { id: "black-gold", label: "Black & Gold" },
      { id: "rose-gold-palette", label: "Rose Gold" },
      { id: "neutral-luxury", label: "Neutral Luxury" },
    ],
  },

  // --- Materials -----------------------------------------------------------
  {
    id: "materials",
    label: "Materials",
    categoryId: "materials",
    multiple: true,
    searchable: true,
    optional: true,
    options: [
      { id: "gold-filled", label: "Gold Filled" },
      { id: "sterling-silver", label: "Sterling Silver" },
      { id: "copper", label: "Copper" },
      { id: "brass", label: "Brass" },
      { id: "pearls", label: "Pearls" },
      { id: "natural-gemstones", label: "Natural Gemstones" },
      { id: "czech-glass-material", label: "Czech Glass" },
      { id: "miyuki-beads", label: "Miyuki Beads" },
      { id: "seed-beads-material", label: "Seed Beads" },
      { id: "leather-material", label: "Leather" },
      { id: "silk-material", label: "Silk" },
      { id: "hemp-material", label: "Hemp" },
    ],
  },
];

export function findBraceletGroup(id: string): FilterGroup {
  const group = braceletGroups.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown bracelet filter group: ${id}`);
  return group;
}
