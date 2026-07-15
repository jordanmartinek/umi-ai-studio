import { Locale } from "@/lib/types";
import { BraceletDifficulty } from "@/lib/bracelet/types";

/**
 * Maps each "Bracelet Style" filter option to sensible manufacturing
 * defaults (metal type, cord type, difficulty, build time) so generated
 * concepts stay realistic and internally consistent — a "Macramé" bracelet
 * won't accidentally get a "Cuban chain" metal type, for instance.
 */

export interface StyleProfile {
  metalType: { en: string; es: string };
  cordType?: { en: string; es: string };
  difficulty: BraceletDifficulty;
  buildTimeMinutes: [number, number];
  /** True if this style is primarily a thread/cord piece rather than metal/beaded. */
  isCordBased: boolean;
}

const DEFAULT_PROFILE: StyleProfile = {
  metalType: { en: "Gold-filled accents", es: "Detalles en gold-filled" },
  difficulty: "beginner",
  buildTimeMinutes: [20, 40],
  isCordBased: false,
};

export const STYLE_PROFILES: Record<string, StyleProfile> = {
  // Beaded
  "gemstone-beaded": {
    metalType: { en: "Gold-filled spacer beads", es: "Cuentas espaciadoras en gold-filled" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: false,
  },
  "seed-bead": {
    metalType: { en: "Sterling silver clasp", es: "Broche de plata esterlina" },
    difficulty: "intermediate",
    buildTimeMinutes: [45, 75],
    isCordBased: false,
  },
  "czech-glass": {
    metalType: { en: "Gold-filled findings", es: "Herrajes en gold-filled" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: false,
  },
  "pearl-beaded": {
    metalType: { en: "Sterling silver clasp", es: "Broche de plata esterlina" },
    difficulty: "beginner",
    buildTimeMinutes: [25, 40],
    isCordBased: false,
  },
  "crystal-beaded": {
    metalType: { en: "Gold-filled spacer beads", es: "Cuentas espaciadoras en gold-filled" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: false,
  },
  "mixed-beads": {
    metalType: { en: "Mixed gold-filled and silver accents", es: "Detalles mixtos en gold-filled y plata" },
    difficulty: "intermediate",
    buildTimeMinutes: [35, 60],
    isCordBased: false,
  },

  // Thread
  friendship: {
    metalType: { en: "Simple metal accent bead", es: "Cuenta metálica simple" },
    cordType: { en: "Embroidery floss", es: "Hilo de bordado" },
    difficulty: "beginner",
    buildTimeMinutes: [30, 60],
    isCordBased: true,
  },
  macrame: {
    metalType: { en: "Small brass or gold-filled accent bead", es: "Pequeña cuenta de latón o gold-filled" },
    cordType: { en: "Waxed macramé cord", es: "Cordón encerado para macramé" },
    difficulty: "intermediate",
    buildTimeMinutes: [45, 90],
    isCordBased: true,
  },
  braided: {
    metalType: { en: "Gold-filled end caps", es: "Terminales en gold-filled" },
    cordType: { en: "Braided leather or silk cord", es: "Cordón trenzado de cuero o seda" },
    difficulty: "intermediate",
    buildTimeMinutes: [30, 50],
    isCordBased: true,
  },
  "silk-thread": {
    metalType: { en: "Gold-filled clasp", es: "Broche en gold-filled" },
    cordType: { en: "Silk cord", es: "Cordón de seda" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: true,
  },
  "waxed-cord": {
    metalType: { en: "Small gold-filled accent bead", es: "Pequeña cuenta en gold-filled" },
    cordType: { en: "Waxed cotton cord", es: "Cordón de algodón encerado" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: true,
  },
  "adjustable-knot": {
    metalType: { en: "Sterling silver accent bead", es: "Cuenta acento en plata esterlina" },
    cordType: { en: "Waxed cord with sliding knot closure", es: "Cordón encerado con cierre de nudo corredizo" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 30],
    isCordBased: true,
  },

  // Metal
  chain: {
    metalType: { en: "Gold-filled chain", es: "Cadena en gold-filled" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 30],
    isCordBased: false,
  },
  paperclip: {
    metalType: { en: "Gold-filled paperclip chain", es: "Cadena tipo clip en gold-filled" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 25],
    isCordBased: false,
  },
  cuban: {
    metalType: { en: "Sterling silver Cuban chain", es: "Cadena cubana en plata esterlina" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 25],
    isCordBased: false,
  },
  figaro: {
    metalType: { en: "Gold-filled figaro chain", es: "Cadena figaro en gold-filled" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 25],
    isCordBased: false,
  },
  bangle: {
    metalType: { en: "Solid brass or sterling silver bangle", es: "Brazalete rígido de latón o plata esterlina" },
    difficulty: "advanced",
    buildTimeMinutes: [60, 120],
    isCordBased: false,
  },
  cuff: {
    metalType: { en: "Hammered brass or sterling silver cuff", es: "Brazalete martillado de latón o plata esterlina" },
    difficulty: "advanced",
    buildTimeMinutes: [60, 120],
    isCordBased: false,
  },
  "wire-wrapped": {
    metalType: { en: "Gold-filled wire-wrapped frame", es: "Estructura envuelta en alambre de gold-filled" },
    difficulty: "advanced",
    buildTimeMinutes: [50, 90],
    isCordBased: false,
  },

  // Natural
  "wood-style": {
    metalType: { en: "Small gold-filled accent bead", es: "Pequeña cuenta en gold-filled" },
    cordType: { en: "Elastic cord", es: "Cordón elástico" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 25],
    isCordBased: false,
  },
  "lava-stone": {
    metalType: { en: "Sterling silver accent bead", es: "Cuenta acento en plata esterlina" },
    cordType: { en: "Elastic cord", es: "Cordón elástico" },
    difficulty: "beginner",
    buildTimeMinutes: [15, 25],
    isCordBased: false,
  },
  shell: {
    metalType: { en: "Gold-filled accent beads", es: "Cuentas acento en gold-filled" },
    cordType: { en: "Waxed cotton cord", es: "Cordón de algodón encerado" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: false,
  },
  "mother-of-pearl": {
    metalType: { en: "Sterling silver findings", es: "Herrajes de plata esterlina" },
    difficulty: "intermediate",
    buildTimeMinutes: [30, 50],
    isCordBased: false,
  },
  "leather-style": {
    metalType: { en: "Gold-filled magnetic clasp", es: "Broche magnético en gold-filled" },
    cordType: { en: "Genuine leather cord", es: "Cordón de cuero genuino" },
    difficulty: "beginner",
    buildTimeMinutes: [20, 35],
    isCordBased: true,
  },
  "hemp-style": {
    metalType: { en: "Small brass accent bead", es: "Pequeña cuenta de latón" },
    cordType: { en: "Natural hemp cord", es: "Cordón de cáñamo natural" },
    difficulty: "beginner",
    buildTimeMinutes: [25, 45],
    isCordBased: true,
  },
};

export function getStyleProfile(styleId?: string): StyleProfile {
  if (styleId && STYLE_PROFILES[styleId]) return STYLE_PROFILES[styleId];
  return DEFAULT_PROFILE;
}

export function formatBuildTime(minutesRange: [number, number], locale: Locale): string {
  const [min, max] = minutesRange;
  if (locale === "es") {
    return `${min}–${max} minutos`;
  }
  return `${min}–${max} minutes`;
}

export function difficultyLabel(difficulty: BraceletDifficulty, locale: Locale): string {
  const labels: Record<Locale, Record<BraceletDifficulty, string>> = {
    en: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    es: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" },
  };
  return labels[locale][difficulty];
}
