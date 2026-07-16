import { BrandProfile, Locale } from "@/lib/types";
import { article, joinNatural } from "@/lib/prompt-engine";
import {
  BraceletConcept,
  LaunchPackage,
  LaunchPackageBranding,
  LaunchPackageMarketing,
  LaunchPackagePhotography,
  LaunchPackageProduct,
  LaunchPackageVideo,
} from "@/lib/bracelet/types";

/**
 * The one-click Launch Package generator: takes a single BraceletConcept
 * and produces every asset needed to actually launch it — finished product
 * copy, finished marketing copy, AI image/video generation prompts, and
 * finished branding copy — in one call.
 *
 * Design choice: Product/Marketing/Branding sections produce *finished,
 * ready-to-use copy* (consistent with how Caption/Story/Product Description
 * already work elsewhere in the app), while Photography/Video sections
 * produce *AI image/video generation prompts* (consistent with the
 * Image/Video generators) — since a launch package needs both "copy to
 * paste into your storefront" and "prompts to paste into Midjourney/Runway".
 */

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function gemstoneText(concept: BraceletConcept, locale: Locale): string {
  return concept.gemstones.length
    ? joinNatural(concept.gemstones, locale)
    : locale === "es"
    ? "piedras naturales"
    : "natural gemstones";
}

/** English mood phrase, e.g. "a peaceful feeling" / "an elegant feeling", with correct a/an agreement. */
function moodFeelingEn(concept: BraceletConcept): string {
  const mood = concept.mood.join(" and ").toLowerCase() || "elegant";
  return `${article(mood)} ${mood} feeling`;
}

/** Spanish mood phrase, e.g. "una sensación romántica". Mood labels in the bracelet
 *  dictionary are stored as feminine adjectives (to agree with "sensación"), so this
 *  deliberately avoids pairing them with a masculine noun like "ambiente". */
function moodFeelingEs(concept: BraceletConcept): string {
  const mood = concept.mood.join(" y ").toLowerCase() || "elegante";
  return `una sensación ${mood}`;
}

/**
 * Materials text for copy that already mentions gemstones separately (e.g.
 * "Made with {gems} and {materials}"). Excludes anything already listed in
 * concept.gemstones so a selection like "Japanese Seed Beads" doesn't get
 * named twice in the same sentence — concept.materials is every material
 * sub-group flattened together, which includes the same bead/gemstone picks
 * that concept.gemstones is built from.
 */
function materialsText(concept: BraceletConcept, locale: Locale): string {
  const gemSet = new Set(concept.gemstones.map((g) => g.toLowerCase()));
  const rest = concept.materials.filter((m) => !gemSet.has(m.toLowerCase()));
  if (rest.length) return joinNatural(rest, locale);
  // Every material was already covered by gemstones (e.g. the user only
  // picked beads/gemstones and nothing else) — fall back to the metal type
  // so the sentence still reads naturally instead of repeating the gems.
  return concept.metalType;
}

/**
 * Every non-gemstone material selected for this concept (cord/thread,
 * findings, decorative extras, etc.) — same exclusion logic as
 * materialsText() but returned as an array instead of a joined string, so
 * callers can combine it with gemstones in a single joinNatural() list
 * rather than nesting two separately-joined phrases together.
 */
function extraMaterials(concept: BraceletConcept): string[] {
  const gemSet = new Set(concept.gemstones.map((g) => g.toLowerCase()));
  return concept.materials.filter((m) => !gemSet.has(m.toLowerCase()));
}

/**
 * A complete, natural-language description of what this piece is actually
 * made from — gemstones AND everything else (cord/thread, decorative
 * extras, findings) — for AI image/video generation prompts that need to
 * describe the piece's real materials and craft technique, not just its
 * gemstones. This is what fixes prompts that previously only mentioned
 * gemstones and silently dropped e.g. "embroidery floss" or "pressed
 * flowers" for a macramé/thread-based bracelet.
 *
 * Falls back to gemstones + metal type when nothing extra was selected, so
 * gemstone-only concepts still read naturally (e.g. "citrine and gold-
 * filled spacer beads" instead of just "citrine").
 */
function visualMaterialsText(concept: BraceletConcept, locale: Locale): string {
  const extras = extraMaterials(concept);
  const all = [...concept.gemstones, ...extras];
  if (all.length) return joinNatural(all, locale);
  return concept.metalType;
}

/**
 * A "{style} bracelet" / "pulsera de estilo {style}" phrase for prompts
 * that need to name the piece's construction technique (macramé, seed
 * bead, chain, etc.), not just its color/mood — important for AI image
 * generation, since "macramé" vs. "chain" produces very different visuals
 * even with identical gemstones. Guards against doubling the word
 * "bracelet"/"pulsera" when concept.style is already a full phrase like
 * the "Handcrafted bracelet" / "Pulsera artesanal" fallback.
 */
function stylePhrase(concept: BraceletConcept, locale: Locale): string {
  const styleLower = concept.style.toLowerCase();
  const braceletWord = locale === "es" ? "pulsera" : "bracelet";
  if (styleLower.includes(braceletWord)) return styleLower;
  return locale === "es" ? `pulsera de estilo ${styleLower}` : `${styleLower} bracelet`;
}

// --- Product ---------------------------------------------------------------

function buildProduct(concept: BraceletConcept, brand: BrandProfile, locale: Locale): LaunchPackageProduct {
  const brandName = brand.brandName || (locale === "es" ? "la marca" : "the brand");
  const gems = gemstoneText(concept, locale);
  const materials = materialsText(concept, locale);

  if (locale === "es") {
    return {
      productName: concept.name,
      collectionName: concept.collectionName,
      description: `${concept.name} es una pulsera artesanal de la colección ${concept.collectionName}, inspirada en ${concept.theme.toLowerCase()}. Elaborada con ${gems} y ${materials.toLowerCase()}, esta pieza captura ${moodFeelingEs(concept)} pensada para ${concept.occasion.toLowerCase()}. ${concept.whyCustomersLoveIt}`,
      shortDescription: `Pulsera de ${gems} inspirada en ${concept.theme.toLowerCase()}, perfecta para ${concept.occasion.toLowerCase()}.`,
      productStory: `${concept.story} Cada pieza de ${brandName} está hecha a mano en pequeños lotes, pensada para quien valora la artesanía y el significado detrás de cada detalle.`,
    };
  }

  return {
    productName: concept.name,
    collectionName: concept.collectionName,
    description: `${concept.name} is a handcrafted bracelet from the ${concept.collectionName} collection, inspired by ${concept.theme.toLowerCase()}. Made with ${gems} and ${materials.toLowerCase()}, this piece captures ${moodFeelingEn(concept)} designed for ${concept.occasion.toLowerCase()}. ${concept.whyCustomersLoveIt}`,
    shortDescription: `A ${gems} bracelet inspired by ${concept.theme.toLowerCase()}, perfect for ${concept.occasion.toLowerCase()}.`,
    productStory: `${concept.story} Every ${brandName} piece is handmade in small batches, designed for those who value the craftsmanship and meaning behind every detail.`,
  };
}

// --- Marketing ---------------------------------------------------------------

function buildMarketing(concept: BraceletConcept, brand: BrandProfile, locale: Locale): LaunchPackageMarketing {
  const brandName = brand.brandName || (locale === "es" ? "la marca" : "the brand");
  const gems = gemstoneText(concept, locale);

  const hashtagBaseEn = ["handmadejewelry", "bracelet", "smallbusiness", "giftideas"];
  const hashtagBaseEs = ["joyeriaartesanal", "pulsera", "negociopequeno", "ideasderegalo"];

  const themeHashtag = concept.theme
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (é -> e) instead of dropping the whole letter
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .join("");

  if (locale === "es") {
    return {
      instagramCaption: `✨ Presentamos ${concept.name} ✨ Inspirada en ${concept.theme.toLowerCase()}, esta pieza combina ${gems} con ${moodFeelingEs(concept)}. Perfecta para ${concept.occasion.toLowerCase()} o para regalarte algo especial. 💛 Disponible ahora en ${brandName}.`,
      facebookCaption: `Conoce ${concept.name}, la nueva pieza de nuestra colección ${concept.collectionName}. Elaborada a mano con ${gems}, esta pulsera está inspirada en ${concept.theme.toLowerCase()} y pensada para quienes buscan algo con verdadero significado. Ideal para ${concept.occasion.toLowerCase()}.`,
      pinterestDescription: `${concept.name} — pulsera artesanal de ${gems} inspirada en ${concept.theme.toLowerCase()}. Perfecta idea de regalo para ${concept.occasion.toLowerCase()}. #${themeHashtag}`,
      etsyDescription: `${concept.name} de la colección ${concept.collectionName}. Hecha a mano con ${gems} y ${materialsText(concept, locale).toLowerCase()}. Tiempo de elaboración: ${concept.buildTime}. Cada pieza es única y se hace en pequeños lotes.`,
      shopifyDescription: `Descubre ${concept.name}, una pulsera artesanal de ${gems} inspirada en ${concept.theme.toLowerCase()}. Parte de la colección ${concept.collectionName} de ${brandName}.`,
      seoTitle: `${concept.name} - Pulsera Artesanal de ${gems} | ${brandName}`,
      metaDescription: `Descubre ${concept.name}, una pulsera artesanal de ${gems} inspirada en ${concept.theme.toLowerCase()}. Perfecta para ${concept.occasion.toLowerCase()}.`.slice(0, 155),
      seoKeywords: [
        `pulsera de ${gems.toLowerCase()}`,
        `joyería ${concept.theme.toLowerCase()}`,
        "pulsera artesanal",
        `regalo para ${concept.occasion.toLowerCase()}`,
      ],
      hashtags: [...hashtagBaseEs, themeHashtag].map((h) => `#${h}`),
    };
  }

  return {
    instagramCaption: `✨ Introducing ${concept.name} ✨ Inspired by ${concept.theme.toLowerCase()}, this piece pairs ${gems} with ${moodFeelingEn(concept)}. Perfect for ${concept.occasion.toLowerCase()} or treating yourself to something special. 💛 Available now at ${brandName}.`,
    facebookCaption: `Meet ${concept.name}, the newest piece from our ${concept.collectionName} collection. Handcrafted with ${gems}, this bracelet is inspired by ${concept.theme.toLowerCase()} and made for anyone looking for something with real meaning. Perfect for ${concept.occasion.toLowerCase()}.`,
    pinterestDescription: `${concept.name} — a handcrafted ${gems} bracelet inspired by ${concept.theme.toLowerCase()}. The perfect gift idea for ${concept.occasion.toLowerCase()}. #${themeHashtag}`,
    etsyDescription: `${concept.name} from the ${concept.collectionName} collection. Handmade with ${gems} and ${materialsText(concept, locale).toLowerCase()}. Build time: ${concept.buildTime}. Every piece is unique and made in small batches.`,
    shopifyDescription: `Discover ${concept.name}, a handcrafted ${gems} bracelet inspired by ${concept.theme.toLowerCase()}. Part of ${brandName}'s ${concept.collectionName} collection.`,
    seoTitle: `${concept.name} - Handmade ${gems} Bracelet | ${brandName}`,
    metaDescription: `Discover ${concept.name}, a handcrafted ${gems} bracelet inspired by ${concept.theme.toLowerCase()}. Perfect for ${concept.occasion.toLowerCase()}.`.slice(0, 155),
    seoKeywords: [
      `${gems.toLowerCase()} bracelet`,
      `${concept.theme.toLowerCase()} jewelry`,
      "handmade bracelet",
      `gift for ${concept.occasion.toLowerCase()}`,
    ],
    hashtags: [...hashtagBaseEn, themeHashtag].map((h) => `#${h}`),
  };
}

// --- Photography (AI image-generation prompts) --------------------------------

function buildPhotography(concept: BraceletConcept, brand: BrandProfile, locale: Locale): LaunchPackagePhotography {
  const brandName = brand.brandName || (locale === "es" ? "la marca" : "the brand");
  // Use the full materials description (gemstones + cord/thread + any other
  // selected materials) and the actual construction style/technique, not
  // just gemstones — otherwise a macramé bracelet made with embroidery
  // floss and pressed flowers gets described as if it were plain gemstone
  // beads, which produces a visually wrong AI image.
  const visualMaterials = visualMaterialsText(concept, locale);
  const style = stylePhrase(concept, locale);
  const palette = concept.colorPalette.toLowerCase();
  const mood = concept.mood.length ? joinNatural(concept.mood.map((m) => m.toLowerCase()), locale) : "";

  if (locale === "es") {
    return {
      studioProductPhoto: `Fotografía de producto profesional de ${concept.name}, una ${style} hecha con ${visualMaterials}, sobre un fondo de estudio limpio. Iluminación suave con softbox, paleta de colores en ${palette}, enfoque nítido en la textura de los materiales, profundidad de campo reducida. Formato 4:5.`,
      lifestylePhoto: `Fotografía de estilo de vida de una persona usando ${concept.name} en su muñeca, en un entorno cálido e iluminado naturalmente. Sensación ${mood || "cálida y elegante"}, tonos ${palette}, con una estética auténtica y editorial.`,
      flatLay: `Flat lay minimalista de ${concept.name} junto a elementos que evocan ${concept.theme.toLowerCase()} (por ejemplo, textiles suaves, hojas secas o piedras a juego), sobre una superficie neutra en tonos ${palette}. Vista cenital, composición ordenada.`,
      editorialCampaign: `Fotografía editorial de alta gama de ${concept.name}, con dirección artística inspirada en campañas de joyería de lujo. Iluminación dramática, paleta ${palette}, sensación ${mood || "sofisticada"}, para la colección ${concept.collectionName} de ${brandName}.`,
      holidayVersion: `Versión de temporada de la fotografía de producto de ${concept.name}, incorporando elementos festivos sutiles (luces cálidas, envoltorio elegante) sin dejar de mantener la paleta ${palette} y la sensación ${mood || "elegante"} de la marca.`,
      macroDetailShot: `Toma macro extrema de ${concept.name}, mostrando la textura y el detalle de ${visualMaterials}. Enfoque nítido, iluminación suave que resalta la calidad artesanal de esta ${style}.`,
      packagingShot: `Fotografía de producto de ${concept.name} presentada en su empaque de ${brandName}, con una composición limpia que resalte tanto la pieza como la experiencia de unboxing. Paleta ${palette}.`,
      onWristLifestyle: `Fotografía de estilo de vida en primer plano de ${concept.name} en la muñeca, con un gesto natural (sosteniendo una taza, tocando el cabello), luz natural suave, sensación ${mood || "cálida"}.`,
      pinterestImage: `Imagen vertical optimizada para Pinterest de ${concept.name}, con una composición onírica inspirada en ${concept.theme.toLowerCase()}, paleta ${palette}, pensada para guardarse y repinearse.`,
      instagramCarousel: `Serie de 3-5 imágenes para carrusel de Instagram mostrando ${concept.name} desde distintos ángulos (detalle, en la muñeca, flat lay, empaque), manteniendo una paleta ${palette} consistente en todo el carrusel.`,
    };
  }

  return {
    studioProductPhoto: `Professional product photograph of ${concept.name}, a ${style} made with ${visualMaterials}, against a clean studio background. Soft softbox lighting, ${palette} color palette, sharp focus on material texture, shallow depth of field. 4:5 aspect ratio.`,
    lifestylePhoto: `Lifestyle photograph of someone wearing ${concept.name} on their wrist, in a warm, naturally lit setting. ${
      mood ? `${capitalize(mood)} mood, ${palette} tones` : `${capitalize(palette)} tones`
    }, authentic editorial feeling.`,
    flatLay: `Minimalist flat lay of ${concept.name} alongside elements that evoke ${concept.theme.toLowerCase()} (e.g. soft textiles, dried leaves, or matching stones), on a neutral surface in ${palette} tones. Overhead view, tidy composition.`,
    editorialCampaign: `High-end editorial photograph of ${concept.name}, with art direction inspired by luxury jewelry campaigns. Dramatic lighting, ${palette} palette, ${mood || "sophisticated"} mood, for ${brandName}'s ${concept.collectionName} collection.`,
    holidayVersion: `A seasonal version of the ${concept.name} product photograph, incorporating subtle festive elements (warm lights, elegant wrapping) while keeping the brand's ${palette} palette and ${mood || "elegant"} mood.`,
    macroDetailShot: `Extreme macro shot of ${concept.name}, showing the texture and detail of ${visualMaterials}. Sharp focus, soft lighting that highlights the handmade quality of this ${style}.`,
    packagingShot: `Product photograph of ${concept.name} presented in its ${brandName} packaging, with a clean composition that highlights both the piece and the unboxing experience. ${capitalize(palette)} palette.`,
    onWristLifestyle: `Close-up lifestyle photograph of ${concept.name} on the wrist, with a natural gesture (holding a cup, touching hair), soft natural light, ${mood || "warm"} mood.`,
    pinterestImage: `Vertical Pinterest-optimized image of ${concept.name}, with a dreamy composition inspired by ${concept.theme.toLowerCase()}, ${palette} palette, designed to be saved and repinned.`,
    instagramCarousel: `A 3-5 image Instagram carousel series showing ${concept.name} from different angles (detail shot, on the wrist, flat lay, packaging), keeping a consistent ${palette} palette throughout the carousel.`,
  };
}

// --- Video (AI video-generation prompts) --------------------------------------

function buildVideo(concept: BraceletConcept, brand: BrandProfile, locale: Locale): LaunchPackageVideo {
  const brandName = brand.brandName || (locale === "es" ? "la marca" : "the brand");
  const gems = gemstoneText(concept, locale);
  const visualMaterials = visualMaterialsText(concept, locale);
  const palette = concept.colorPalette.toLowerCase();

  if (locale === "es") {
    return {
      instagramReel: `Video de 6-8 segundos para Reel de Instagram mostrando ${concept.name} con un acercamiento lento de cámara, destellos de luz sobre ${gems}, y un texto en pantalla breve. Paleta ${palette}, ritmo relajado y elegante.`,
      tiktok: `Video corto y dinámico para TikTok mostrando el proceso de empaquetado o revelación de ${concept.name}, con cortes rápidos, música de tendencia y un gancho visual en el primer segundo.`,
      youtubeShorts: `Video vertical corto para YouTube Shorts mostrando ${concept.name} en detalle, con una narración breve sobre la inspiración detrás de la pieza (${concept.theme.toLowerCase()}).`,
      behindTheScenes: `Video detrás de cámaras mostrando el espacio de trabajo de ${brandName} mientras se elabora ${concept.name}, con tomas cálidas y auténticas del proceso artesanal.`,
      braceletMakingProcess: `Video del proceso de elaboración de ${concept.name}, mostrando manos trabajando con ${visualMaterials} paso a paso, con una toma cenital fija y buena iluminación natural.`,
      packagingVideo: `Video del empaquetado de ${concept.name}, mostrando el detalle del envoltorio de ${brandName}, con música suave y un ritmo pausado que transmita cuidado y atención al detalle.`,
    };
  }

  return {
    instagramReel: `A 6-8 second Instagram Reel showing ${concept.name} with a slow camera push-in, light catching on the ${gems}, and a brief on-screen text overlay. ${capitalize(palette)} palette, relaxed and elegant pacing.`,
    tiktok: `A short, dynamic TikTok showing the unboxing or reveal of ${concept.name}, with quick cuts, trending audio, and a visual hook within the first second.`,
    youtubeShorts: `A short vertical YouTube Short showing ${concept.name} in detail, with a brief voiceover about the inspiration behind the piece (${concept.theme.toLowerCase()}).`,
    behindTheScenes: `A behind-the-scenes video showing ${brandName}'s workspace while making ${concept.name}, with warm, authentic shots of the handmade process.`,
    braceletMakingProcess: `A process video of making ${concept.name}, showing hands working with ${visualMaterials} step by step, with a locked-off overhead shot and good natural light.`,
    packagingVideo: `A packaging video for ${concept.name}, showing the detail of ${brandName}'s wrapping, with soft music and an unhurried pace that conveys care and attention to detail.`,
  };
}

// --- Branding -----------------------------------------------------------------

function buildBranding(concept: BraceletConcept, brand: BrandProfile, locale: Locale): LaunchPackageBranding {
  const brandName = brand.brandName || (locale === "es" ? "la marca" : "the brand");

  if (locale === "es") {
    return {
      packagingCardMessage: `Gracias por elegir ${concept.name}. Cada pieza de ${brandName} está hecha a mano con cuidado, pensando en ti.`,
      thankYouCard: `¡Gracias por tu compra! Esperamos que ${concept.name} te acompañe en tus momentos más especiales. Con cariño, el equipo de ${brandName}.`,
      collectionIntroduction: `Presentamos ${concept.collectionName}: una colección inspirada en ${concept.theme.toLowerCase()}, hecha para quienes buscan joyería con verdadero significado.`,
      websiteBannerCopy: `Nuevo: ${concept.collectionName} ya está disponible. Descubre ${concept.name} y el resto de la colección.`,
      emailLaunchAnnouncement: `Asunto: Presentamos ${concept.name} ✨\n\nHola,\n\nEstamos emocionados de compartir nuestra nueva pieza: ${concept.name}, parte de la colección ${concept.collectionName}. Inspirada en ${concept.theme.toLowerCase()}, esta pulsera combina ${gemstoneText(concept, "es")} con ${moodFeelingEs(concept)}.\n\nDescúbrela ahora en ${brandName}.`,
    };
  }

  return {
    packagingCardMessage: `Thank you for choosing ${concept.name}. Every ${brandName} piece is handmade with care, made with you in mind.`,
    thankYouCard: `Thank you for your purchase! We hope ${concept.name} joins you for your most special moments. With love, the ${brandName} team.`,
    collectionIntroduction: `Introducing ${concept.collectionName}: a collection inspired by ${concept.theme.toLowerCase()}, made for those who want jewelry with real meaning.`,
    websiteBannerCopy: `New: ${concept.collectionName} is here. Discover ${concept.name} and the rest of the collection.`,
    emailLaunchAnnouncement: `Subject: Introducing ${concept.name} ✨\n\nHi there,\n\nWe're excited to share our newest piece: ${concept.name}, part of the ${concept.collectionName} collection. Inspired by ${concept.theme.toLowerCase()}, this bracelet pairs ${gemstoneText(concept, "en")} with ${moodFeelingEn(concept)}.\n\nDiscover it now at ${brandName}.`,
  };
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Generates a complete Launch Package (Product, Marketing, Photography, Video, Branding) for a bracelet concept. */
export function generateLaunchPackage(concept: BraceletConcept, brand: BrandProfile): LaunchPackage {
  const locale = concept.locale;
  return {
    id: makeId(),
    conceptId: concept.id,
    conceptName: concept.name,
    product: buildProduct(concept, brand, locale),
    marketing: buildMarketing(concept, brand, locale),
    photography: buildPhotography(concept, brand, locale),
    video: buildVideo(concept, brand, locale),
    branding: buildBranding(concept, brand, locale),
    locale,
    createdAt: new Date().toISOString(),
  };
}
