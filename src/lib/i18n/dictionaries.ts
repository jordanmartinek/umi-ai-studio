// English + Spanish UI dictionaries for Umi AI Studio.
// Shape must stay identical between `en` and `es` so lookups never break.

export const en = {
  nav: {
    studio: "Studio",
    library: "Library",
    templates: "Templates",
    enhancer: "Enhancer",
    brand: "Brand Profile",
    language: "Language",
  },
  home: {
    eyebrow: "Umi Accessories · Creative Assistant",
    title: "What do you want to create today?",
    subtitle:
      "Pick a content type and answer a few quick questions. Umi AI Studio turns your choices into a professional, brand-aware prompt—ready to paste into ChatGPT, Claude, Gemini, Midjourney, Ideogram, Flux, or Stable Diffusion.",
    create: "Create",
    comingSoon: "Coming soon",
  },
  contentTypes: {
    image: { title: "Image", description: "Prompts for AI-generated product & lifestyle photography." },
    video: { title: "Video", description: "Prompts for short-form AI video and motion content." },
    caption: { title: "Caption", description: "On-brand Instagram & social captions with a clear CTA." },
    poll: { title: "Poll", description: "Interactive Story polls designed to drive engagement." },
    carousel: { title: "Instagram Carousel", description: "Multi-slide carousel concepts and copy prompts." },
    email: { title: "Email", description: "Marketing email prompts for launches & campaigns." },
    productDescription: {
      title: "Product Description",
      description: "SEO-ready ecommerce copy prompts for your storefront.",
    },
    promotion: { title: "Promotion", description: "Sales, holiday campaigns and limited-time offers." },
    story: { title: "Story", description: "Full Instagram Story sequences with a narrative arc." },
    reply: {
      title: "Reply to Comments",
      description: "Friendly, brand-consistent replies to customer comments.",
    },
  },
  brandPage: {
    eyebrow: "Brand Memory",
    title: "Brand Profile",
    subtitle:
      "Store permanent information about your brand once. Every prompt generated across Umi AI Studio automatically incorporates this context—no need to repeat yourself.",
    save: "Save brand profile",
    saved: "Saved",
    fields: {
      brandName: { label: "Brand name", placeholder: "Umi Accessories" },
      tagline: { label: "Tagline", placeholder: "Meaningful handmade jewelry" },
      voice: { label: "Brand voice", placeholder: "Warm luxury, elegant, storytelling" },
      audience: {
        label: "Target audience",
        placeholder: "Women 25-45 who value craftsmanship",
      },
      products: {
        label: "Products",
        placeholder: "Natural gemstone bracelets, necklaces and earrings",
      },
      materials: { label: "Materials", placeholder: "Natural gemstones, gold-filled accents" },
      colorPalette: {
        label: "Color palette",
        placeholder: "Cream, warm gold, rose gold, earth tones",
      },
      mission: {
        label: "Mission",
        placeholder: "Creating meaningful handmade jewelry that tells a story",
      },
      usp: {
        label: "Unique selling points",
        placeholder: "Hand-selected stones, small-batch craftsmanship...",
      },
    },
  },
  comingSoon: {
    templates: {
      eyebrow: "Coming in a future slice",
      title: "Template Gallery",
      description:
        "Dozens of professionally designed prompt templates for launches, holidays, testimonials, and more—coming soon.",
    },
  },
  generatorPage: {
    back: "Back to Studio",
    promptGeneratorSuffix: "Prompt Generator",
    generate: "Generate Prompt",
    selectAllHint: "Select at least one option in every section above to generate.",
    customLabel: "Custom",
    customPlaceholderDefault: "Describe what you have in mind...",
    notBuiltTitle: "Coming soon",
    notBuiltDescription:
      "This generator isn't built yet. Check back soon, or try Image generation.",
  },
  promptOutput: {
    emptyHint:
      "Make your selections and generate to see three prompt variants appear here—Reliable, Creative, and Viral.",
    copy: "Copy prompt",
    copied: "Copied to clipboard",
    save: "Save to Library",
    saved: "Saved to Library",
    export: "Export",
    exportMarkdown: "Markdown (.md)",
    exportTxt: "Plain text (.txt)",
    exportJson: "JSON (.json)",
  },
  library: {
    eyebrow: "Prompt Library",
    title: "Your saved prompts",
    subtitle:
      "Every prompt you save from a generator or the Enhancer lives here. Search, favorite, duplicate, edit, and export anytime.",
    searchPlaceholder: "Search your saved prompts...",
    filterAll: "All",
    filterFavorites: "Favorites",
    empty: "You haven't saved any prompts yet. Generate one and click \"Save to Library\".",
    emptyFiltered: "No saved prompts match your search or filter.",
    copy: "Copy",
    copied: "Copied",
    favorite: "Favorite",
    unfavorite: "Unfavorite",
    duplicate: "Duplicate",
    edit: "Edit",
    save: "Save changes",
    cancel: "Cancel",
    delete: "Delete",
    export: "Export",
    savedOn: "Saved",
  },
  enhance: {
    eyebrow: "Prompt Enhancer",
    title: "Turn a simple idea into a professional prompt",
    subtitle:
      "Paste a rough prompt or idea below. Umi AI Studio will rewrite it into three dramatically improved, brand-aware versions.",
    contentTypeLabel: "What kind of content is this for?",
    contentTypeImage: "Image / visual",
    contentTypeText: "Text / copy",
    inputLabel: "Your simple prompt",
    inputPlaceholder: "e.g. Make me a nice picture of a bracelet",
    enhanceButton: "Enhance Prompt",
    inputRequired: "Paste a prompt above to enhance it.",
  },
  templateGallery: {
    eyebrow: "Template Gallery",
    title: "Start from a professionally designed template",
    subtitle:
      "Every template pre-fills a generator with a proven combination of settings. Tweak anything before you generate.",
    categoryAll: "All",
    categories: {
      photography: "Photography",
      captions: "Captions",
      stories: "Stories",
      ecommerce: "Ecommerce",
      customerCare: "Customer care",
      engagement: "Engagement",
    },
    useTemplate: "Use this template",
    opensIn: "Opens in {generator}",
    items: {
      luxuryProductPhotography: {
        title: "Luxury Product Photography",
        description: "Studio-lit, gold-toned hero shots for your best pieces.",
      },
      lifestylePhotography: {
        title: "Lifestyle Photography",
        description: "Warm, golden-hour shots that show jewelry being worn and loved.",
      },
      flatLay: {
        title: "Flat Lay",
        description: "Clean, minimalist overhead shots for a full collection.",
      },
      editorialCampaign: {
        title: "Editorial Campaign",
        description: "Dramatic, high-fashion imagery for a bold brand moment.",
      },
      pinterestPin: {
        title: "Pinterest Pins",
        description: "Dreamy, pastel-toned pins built to get saved and repinned.",
      },
      holidaySaleCaption: {
        title: "Holiday Sale",
        description: "A luxury-toned caption that drives shoppers to a seasonal sale.",
      },
      mothersDayCaption: {
        title: "Mother's Day",
        description: "An emotional caption aimed at gift buyers shopping for mom.",
      },
      valentinesDayCaption: {
        title: "Valentine's Day",
        description: "A short, romantic caption for couples-focused gifting.",
      },
      inspirationalQuoteCaption: {
        title: "Inspirational Quote",
        description: "A short, save-worthy caption built around self-expression.",
      },
      facebookAnnouncement: {
        title: "Facebook Post",
        description: "A friendly announcement caption that invites comments.",
      },
      newCollectionLaunch: {
        title: "New Collection Launch",
        description: "A 5-slide Story sequence to build hype for a new drop.",
      },
      behindTheScenes: {
        title: "Behind the Scenes",
        description: "A warm, nostalgic Story sequence showing your process.",
      },
      tiktokHook: {
        title: "TikTok Hook",
        description: "A playful, fast-paced Story concept built for short-form video.",
      },
      giftGuideDescription: {
        title: "Gift Guide",
        description: "An SEO-ready Shopify product description for gift shoppers.",
      },
      jewelryCareFaq: {
        title: "Jewelry Care Tips",
        description: "A professional reply explaining how to care for gemstone jewelry.",
      },
      sizingQuestionFaq: {
        title: "FAQ Reply",
        description: "A reassuring reply to a common sizing question.",
      },
      giveawayPoll: {
        title: "Giveaway",
        description: "Quiz-style Story polls that build pre-launch buzz with new followers.",
      },
      feedbackPoll: {
        title: "Customer Feedback Poll",
        description: "Rating-scale Story polls that gather feedback from returning customers.",
      },
    },
  },
  modes: {
    reliable: { label: "Reliable", description: "Safe, consistent, and predictable results." },
    creative: { label: "Creative", description: "More artistic, imaginative, and expressive." },
    viral: { label: "Viral", description: "Optimized for attention and social engagement." },
  },
  platforms: {
    chatgpt: "ChatGPT",
    claude: "Claude",
    gemini: "Gemini",
    midjourney: "Midjourney",
    flux: "Flux",
    ideogram: "Ideogram",
    "stable-diffusion": "Stable Diffusion",
  },
  generators: {
    image: {
      groups: {
        subject: {
          label: "What are you promoting?",
          customPlaceholder: "e.g. Anklet, ring stack, gift set...",
          options: {
            bracelet: "Bracelet",
            necklace: "Necklace",
            earrings: "Earrings",
            collection: "Collection",
            brand: "Brand",
            lifestyle: "Lifestyle",
          },
        },
        goal: {
          label: "Goal",
          options: {
            sell: "Sell",
            inspire: "Inspire",
            "luxury-branding": "Luxury branding",
            engagement: "Engagement",
            storytelling: "Storytelling",
            "product-showcase": "Product showcase",
            "holiday-campaign": "Holiday campaign",
          },
        },
        style: {
          label: "Style",
          options: {
            luxury: "Luxury",
            minimalist: "Minimalist",
            editorial: "Editorial",
            "fashion-magazine": "Fashion magazine",
            cozy: "Cozy",
            bohemian: "Bohemian",
            elegant: "Elegant",
            modern: "Modern",
            scandinavian: "Scandinavian",
            "dark-luxury": "Dark luxury",
            "high-fashion": "High fashion",
            dreamy: "Dreamy",
            organic: "Organic",
          },
        },
        lighting: {
          label: "Lighting",
          options: {
            "golden-hour": "Golden hour",
            studio: "Studio",
            "soft-natural": "Soft natural",
            dramatic: "Dramatic",
            moody: "Moody",
            sunset: "Sunset",
            "window-light": "Window light",
            backlit: "Backlit",
            candlelight: "Candlelight",
          },
        },
        palette: {
          label: "Color Palette",
          options: {
            "warm-neutrals": "Warm neutrals",
            "earth-tones": "Earth tones",
            gold: "Gold",
            "rose-gold": "Rose gold",
            black: "Black",
            white: "White",
            emerald: "Emerald",
            pastels: "Pastels",
            vibrant: "Vibrant",
          },
        },
        camera: {
          label: "Camera",
          options: {
            macro: "Macro",
            "close-up": "Close-up",
            "product-shot": "Product shot",
            "flat-lay": "Flat lay",
            "lifestyle-shot": "Lifestyle",
            portrait: "Portrait",
            overhead: "Overhead",
            cinematic: "Cinematic",
          },
        },
        platform: {
          label: "Platform",
          helper: "Different models need different prompt styles.",
          options: {
            chatgpt: "ChatGPT",
            claude: "Claude",
            midjourney: "Midjourney",
            flux: "Flux",
            ideogram: "Ideogram",
            "stable-diffusion": "Stable Diffusion",
            gemini: "Gemini",
          },
        },
      },
    },
    caption: {
      groups: {
        subject: {
          label: "What are you promoting?",
          customPlaceholder: "e.g. Anklet, ring stack, gift set...",
          options: {
            bracelet: "Bracelet",
            necklace: "Necklace",
            earrings: "Earrings",
            collection: "Collection",
            brand: "Brand",
            lifestyle: "Lifestyle",
          },
        },
        voice: {
          label: "Brand voice",
          options: {
            luxury: "Luxury",
            friendly: "Friendly",
            storytelling: "Storytelling",
            educational: "Educational",
            emotional: "Emotional",
            elegant: "Elegant",
          },
        },
        length: {
          label: "Length",
          options: {
            short: "Short",
            medium: "Medium",
            long: "Long",
          },
        },
        cta: {
          label: "Call to action",
          options: {
            "shop-now": "Shop now",
            comment: "Comment",
            share: "Share",
            "tag-a-friend": "Tag a friend",
            "save-this-post": "Save this post",
          },
        },
        audience: {
          label: "Audience",
          options: {
            women: "Women",
            couples: "Couples",
            "gift-buyers": "Gift buyers",
            "jewelry-lovers": "Jewelry lovers",
            "existing-customers": "Existing customers",
          },
        },
        emotion: {
          label: "Emotion",
          options: {
            inspiration: "Inspiration",
            gratitude: "Gratitude",
            confidence: "Confidence",
            "self-love": "Self-love",
            romance: "Romance",
          },
        },
      },
    },
    poll: {
      groups: {
        product: {
          label: "Product or collection",
          allowCustom: true,
          customPlaceholder: "e.g. New Moonstone bracelet collection",
          options: {
            bracelet: "Bracelet",
            necklace: "Necklace",
            earrings: "Earrings",
            "new-collection": "New collection",
          },
        },
        goal: {
          label: "Goal",
          options: {
            engagement: "Engagement",
            feedback: "Feedback",
            "product-discovery": "Product discovery",
            entertainment: "Entertainment",
            "pre-launch-buzz": "Pre-launch buzz",
          },
        },
        audience: {
          label: "Audience",
          options: {
            "new-followers": "New followers",
            "returning-customers": "Returning customers",
            "gift-buyers": "Gift buyers",
            "jewelry-lovers": "Jewelry lovers",
          },
        },
        format: {
          label: "Poll format",
          options: {
            "this-or-that": "This or that",
            "yes-no": "Yes / No",
            "rating-scale": "Rating scale",
            "quiz-style": "Quiz-style",
          },
        },
      },
    },
    story: {
      groups: {
        occasion: {
          label: "What are you announcing?",
          allowCustom: true,
          customPlaceholder: "e.g. Launching a new bracelet",
          options: {
            "new-launch": "New launch",
            restock: "Restock",
            sale: "Sale",
            "behind-the-scenes": "Behind the scenes",
            "day-in-the-life": "Day in the life",
          },
        },
        theme: {
          label: "Theme",
          options: {
            adventure: "Adventure",
            romance: "Romance",
            celebration: "Celebration",
            calm: "Calm",
            nostalgia: "Nostalgia",
          },
        },
        personality: {
          label: "Brand personality",
          options: {
            warm: "Warm",
            luxury: "Luxury",
            playful: "Playful",
            minimal: "Minimal",
          },
        },
        length: {
          label: "Sequence length",
          options: {
            "3-slides": "3 slides",
            "5-slides": "5 slides",
            "7-slides": "7 slides",
          },
        },
      },
    },
    reply: {
      groups: {
        comment: {
          label: "Paste the customer's comment",
          freeText: true,
          customPlaceholder: "e.g. Will this fit a small wrist?",
        },
        tone: {
          label: "Reply tone",
          options: {
            warm: "Warm",
            professional: "Professional",
            playful: "Playful",
            reassuring: "Reassuring",
          },
        },
        goal: {
          label: "Goal",
          options: {
            "answer-question": "Answer a question",
            "handle-concern": "Handle a concern",
            "thank-customer": "Thank the customer",
            "drive-sale": "Drive a sale",
          },
        },
      },
    },
    productDescription: {
      groups: {
        stone: {
          label: "Stone or material",
          allowCustom: true,
          customPlaceholder: "e.g. Amazonite, moonstone, labradorite...",
          options: {
            moonstone: "Moonstone",
            amazonite: "Amazonite",
            labradorite: "Labradorite",
            "rose-quartz": "Rose quartz",
            turquoise: "Turquoise",
            "tigers-eye": "Tiger's eye",
          },
        },
        productType: {
          label: "Product type",
          options: {
            bracelet: "Bracelet",
            necklace: "Necklace",
            earrings: "Earrings",
            ring: "Ring",
          },
        },
        style: {
          label: "Style",
          options: {
            elegant: "Elegant",
            minimalist: "Minimalist",
            bohemian: "Bohemian",
            luxury: "Luxury",
          },
        },
        seo: {
          label: "SEO optimized",
          options: {
            yes: "Yes",
            no: "No",
          },
        },
        platform: {
          label: "Platform",
          options: {
            shopify: "Shopify",
            etsy: "Etsy",
            instagram: "Instagram Shop",
            generic: "Generic storefront",
          },
        },
      },
    },
  },
};

export type Dictionary = typeof en;

// Spanish translation. Structure intentionally mirrors `en` exactly.
export const es: Dictionary = {
  nav: {
    studio: "Estudio",
    library: "Biblioteca",
    templates: "Plantillas",
    enhancer: "Potenciador",
    brand: "Perfil de marca",
    language: "Idioma",
  },
  home: {
    eyebrow: "Umi Accessories · Asistente creativo",
    title: "¿Qué quieres crear hoy?",
    subtitle:
      "Elige un tipo de contenido y responde algunas preguntas rápidas. Umi AI Studio convierte tus elecciones en un prompt profesional y fiel a tu marca, listo para pegar en ChatGPT, Claude, Gemini, Midjourney, Ideogram, Flux o Stable Diffusion.",
    create: "Crear",
    comingSoon: "Próximamente",
  },
  contentTypes: {
    image: {
      title: "Imagen",
      description: "Prompts para fotografía de producto y estilo de vida generada con IA.",
    },
    video: {
      title: "Video",
      description: "Prompts para video corto y contenido en movimiento generado con IA.",
    },
    caption: {
      title: "Descripción",
      description: "Descripciones de Instagram y redes sociales fieles a tu marca con un CTA claro.",
    },
    poll: {
      title: "Encuesta",
      description: "Encuestas interactivas en Historias diseñadas para generar interacción.",
    },
    carousel: {
      title: "Carrusel de Instagram",
      description: "Conceptos y prompts de texto para carruseles de varias diapositivas.",
    },
    email: {
      title: "Correo",
      description: "Prompts de correo de marketing para lanzamientos y campañas.",
    },
    productDescription: {
      title: "Descripción de producto",
      description: "Prompts de texto para ecommerce optimizados para SEO en tu tienda.",
    },
    promotion: {
      title: "Promoción",
      description: "Rebajas, campañas de temporada y ofertas por tiempo limitado.",
    },
    story: {
      title: "Historia",
      description: "Secuencias completas de Historias de Instagram con un arco narrativo.",
    },
    reply: {
      title: "Responder comentarios",
      description: "Respuestas cercanas y fieles a tu marca para los comentarios de clientes.",
    },
  },
  brandPage: {
    eyebrow: "Memoria de marca",
    title: "Perfil de marca",
    subtitle:
      "Guarda una vez la información permanente de tu marca. Cada prompt generado en Umi AI Studio incorporará automáticamente este contexto, sin repetirte.",
    save: "Guardar perfil de marca",
    saved: "Guardado",
    fields: {
      brandName: { label: "Nombre de la marca", placeholder: "Umi Accessories" },
      tagline: { label: "Eslogan", placeholder: "Joyería artesanal con significado" },
      voice: {
        label: "Voz de marca",
        placeholder: "Lujo cálido, elegante, narrativo",
      },
      audience: {
        label: "Público objetivo",
        placeholder: "Mujeres de 25 a 45 años que valoran la artesanía",
      },
      products: {
        label: "Productos",
        placeholder: "Pulseras, collares y aretes de piedras naturales",
      },
      materials: {
        label: "Materiales",
        placeholder: "Piedras naturales, detalles en gold-filled",
      },
      colorPalette: {
        label: "Paleta de colores",
        placeholder: "Crema, dorado cálido, oro rosa, tonos tierra",
      },
      mission: {
        label: "Misión",
        placeholder: "Crear joyería artesanal con significado que cuenta una historia",
      },
      usp: {
        label: "Puntos diferenciales",
        placeholder: "Piedras seleccionadas a mano, producción en pequeños lotes...",
      },
    },
  },
  comingSoon: {
    templates: {
      eyebrow: "Próximamente en una etapa futura",
      title: "Galería de plantillas",
      description:
        "Docenas de plantillas de prompts diseñadas profesionalmente para lanzamientos, festividades, testimonios y más. Muy pronto.",
    },
  },
  generatorPage: {
    back: "Volver al Estudio",
    promptGeneratorSuffix: "Generador de Prompts",
    generate: "Generar Prompt",
    selectAllHint: "Selecciona al menos una opción en cada sección para generar.",
    customLabel: "Personalizado",
    customPlaceholderDefault: "Describe lo que tienes en mente...",
    notBuiltTitle: "Próximamente",
    notBuiltDescription:
      "Este generador aún no está disponible. Vuelve pronto o prueba el generador de Imagen.",
  },
  promptOutput: {
    emptyHint:
      "Haz tus selecciones y genera para ver tres variantes de prompt aquí: Confiable, Creativo y Viral.",
    copy: "Copiar prompt",
    copied: "Copiado al portapapeles",
    save: "Guardar en la Biblioteca",
    saved: "Guardado en la Biblioteca",
    export: "Exportar",
    exportMarkdown: "Markdown (.md)",
    exportTxt: "Texto plano (.txt)",
    exportJson: "JSON (.json)",
  },
  library: {
    eyebrow: "Biblioteca de prompts",
    title: "Tus prompts guardados",
    subtitle:
      "Cada prompt que guardes desde un generador o el Potenciador vive aquí. Busca, marca como favorito, duplica, edita y exporta cuando quieras.",
    searchPlaceholder: "Busca en tus prompts guardados...",
    filterAll: "Todos",
    filterFavorites: "Favoritos",
    empty: "Aún no has guardado ningún prompt. Genera uno y haz clic en \"Guardar en la Biblioteca\".",
    emptyFiltered: "Ningún prompt guardado coincide con tu búsqueda o filtro.",
    copy: "Copiar",
    copied: "Copiado",
    favorite: "Marcar favorito",
    unfavorite: "Quitar favorito",
    duplicate: "Duplicar",
    edit: "Editar",
    save: "Guardar cambios",
    cancel: "Cancelar",
    delete: "Eliminar",
    export: "Exportar",
    savedOn: "Guardado",
  },
  enhance: {
    eyebrow: "Potenciador de prompts",
    title: "Convierte una idea simple en un prompt profesional",
    subtitle:
      "Pega un prompt o idea sencilla abajo. Umi AI Studio la reescribirá en tres versiones mucho más profesionales y fieles a tu marca.",
    contentTypeLabel: "¿Para qué tipo de contenido es esto?",
    contentTypeImage: "Imagen / visual",
    contentTypeText: "Texto / redacción",
    inputLabel: "Tu prompt simple",
    inputPlaceholder: "ej. Hazme una foto bonita de una pulsera",
    enhanceButton: "Potenciar Prompt",
    inputRequired: "Pega un prompt arriba para potenciarlo.",
  },
  templateGallery: {
    eyebrow: "Galería de plantillas",
    title: "Comienza con una plantilla diseñada profesionalmente",
    subtitle:
      "Cada plantilla precarga un generador con una combinación de ajustes probada. Puedes ajustar cualquier cosa antes de generar.",
    categoryAll: "Todas",
    categories: {
      photography: "Fotografía",
      captions: "Descripciones",
      stories: "Historias",
      ecommerce: "Ecommerce",
      customerCare: "Atención al cliente",
      engagement: "Interacción",
    },
    useTemplate: "Usar esta plantilla",
    opensIn: "Se abre en {generator}",
    items: {
      luxuryProductPhotography: {
        title: "Fotografía de producto de lujo",
        description: "Tomas heroicas iluminadas en estudio con tonos dorados para tus mejores piezas.",
      },
      lifestylePhotography: {
        title: "Fotografía de estilo de vida",
        description: "Tomas cálidas de hora dorada que muestran la joyería siendo usada y amada.",
      },
      flatLay: {
        title: "Flat Lay",
        description: "Tomas cenitales limpias y minimalistas para una colección completa.",
      },
      editorialCampaign: {
        title: "Campaña editorial",
        description: "Imágenes dramáticas de alta moda para un momento de marca audaz.",
      },
      pinterestPin: {
        title: "Pines de Pinterest",
        description: "Pines oníricos en tonos pastel diseñados para guardarse y repinearse.",
      },
      holidaySaleCaption: {
        title: "Rebaja de temporada",
        description: "Una descripción de tono lujoso que impulsa a comprar en una rebaja de temporada.",
      },
      mothersDayCaption: {
        title: "Día de las Madres",
        description: "Una descripción emotiva dirigida a quienes compran regalos para mamá.",
      },
      valentinesDayCaption: {
        title: "Día de San Valentín",
        description: "Una descripción corta y romántica para regalos entre parejas.",
      },
      inspirationalQuoteCaption: {
        title: "Cita inspiradora",
        description: "Una descripción corta y guardable centrada en la expresión personal.",
      },
      facebookAnnouncement: {
        title: "Publicación de Facebook",
        description: "Una descripción cercana de anuncio que invita a comentar.",
      },
      newCollectionLaunch: {
        title: "Lanzamiento de colección nueva",
        description: "Una secuencia de Historia de 5 diapositivas para generar expectativa por un lanzamiento.",
      },
      behindTheScenes: {
        title: "Detrás de cámaras",
        description: "Una secuencia de Historia cálida y nostálgica que muestra tu proceso.",
      },
      tiktokHook: {
        title: "Gancho para TikTok",
        description: "Un concepto de Historia divertido y ágil diseñado para video corto.",
      },
      giftGuideDescription: {
        title: "Guía de regalos",
        description: "Una descripción de producto para Shopify optimizada para SEO, pensada para compradores de regalos.",
      },
      jewelryCareFaq: {
        title: "Consejos de cuidado de joyería",
        description: "Una respuesta profesional que explica cómo cuidar la joyería con piedras naturales.",
      },
      sizingQuestionFaq: {
        title: "Respuesta a pregunta frecuente",
        description: "Una respuesta tranquilizadora a una pregunta común sobre tallas.",
      },
      giveawayPoll: {
        title: "Sorteo",
        description: "Encuestas de Historia tipo cuestionario que generan expectativa con nuevos seguidores.",
      },
      feedbackPoll: {
        title: "Encuesta de retroalimentación",
        description: "Encuestas de Historia con escala de calificación para recabar opiniones de clientas recurrentes.",
      },
    },
  },
  modes: {
    reliable: { label: "Confiable", description: "Resultados seguros, consistentes y predecibles." },
    creative: { label: "Creativo", description: "Más artístico, imaginativo y expresivo." },
    viral: { label: "Viral", description: "Optimizado para captar atención e interacción social." },
  },
  platforms: {
    chatgpt: "ChatGPT",
    claude: "Claude",
    gemini: "Gemini",
    midjourney: "Midjourney",
    flux: "Flux",
    ideogram: "Ideogram",
    "stable-diffusion": "Stable Diffusion",
  },
  generators: {
    image: {
      groups: {
        subject: {
          label: "¿Qué estás promocionando?",
          customPlaceholder: "ej. Tobillera, set de anillos, kit de regalo...",
          options: {
            bracelet: "Pulsera",
            necklace: "Collar",
            earrings: "Aretes",
            collection: "Colección",
            brand: "Marca",
            lifestyle: "Estilo de vida",
          },
        },
        goal: {
          label: "Objetivo",
          options: {
            sell: "Vender",
            inspire: "Inspirar",
            "luxury-branding": "Branding de lujo",
            engagement: "Interacción",
            storytelling: "Narrativa",
            "product-showcase": "Exhibición de producto",
            "holiday-campaign": "Campaña de temporada",
          },
        },
        style: {
          label: "Estilo",
          options: {
            luxury: "Lujo",
            minimalist: "Minimalista",
            editorial: "Editorial",
            "fashion-magazine": "Revista de moda",
            cozy: "Acogedor",
            bohemian: "Bohemio",
            elegant: "Elegante",
            modern: "Moderno",
            scandinavian: "Escandinavo",
            "dark-luxury": "Lujo oscuro",
            "high-fashion": "Alta moda",
            dreamy: "Onírico",
            organic: "Orgánico",
          },
        },
        lighting: {
          label: "Iluminación",
          options: {
            "golden-hour": "Hora dorada",
            studio: "Estudio",
            "soft-natural": "Natural suave",
            dramatic: "Dramática",
            moody: "Ambiental",
            sunset: "Atardecer",
            "window-light": "Luz de ventana",
            backlit: "Contraluz",
            candlelight: "Luz de vela",
          },
        },
        palette: {
          label: "Paleta de colores",
          options: {
            "warm-neutrals": "Neutros cálidos",
            "earth-tones": "Tonos tierra",
            gold: "Dorado",
            "rose-gold": "Oro rosa",
            black: "Negro",
            white: "Blanco",
            emerald: "Esmeralda",
            pastels: "Pastel",
            vibrant: "Vibrante",
          },
        },
        camera: {
          label: "Cámara",
          options: {
            macro: "Macro",
            "close-up": "Primer plano",
            "product-shot": "Toma de producto",
            "flat-lay": "Flat lay",
            "lifestyle-shot": "Estilo de vida",
            portrait: "Retrato",
            overhead: "Cenital",
            cinematic: "Cinematográfico",
          },
        },
        platform: {
          label: "Plataforma",
          helper: "Cada modelo necesita un estilo de prompt diferente.",
          options: {
            chatgpt: "ChatGPT",
            claude: "Claude",
            midjourney: "Midjourney",
            flux: "Flux",
            ideogram: "Ideogram",
            "stable-diffusion": "Stable Diffusion",
            gemini: "Gemini",
          },
        },
      },
    },
    caption: {
      groups: {
        subject: {
          label: "¿Qué estás promocionando?",
          customPlaceholder: "ej. Tobillera, set de anillos, kit de regalo...",
          options: {
            bracelet: "Pulsera",
            necklace: "Collar",
            earrings: "Aretes",
            collection: "Colección",
            brand: "Marca",
            lifestyle: "Estilo de vida",
          },
        },
        voice: {
          label: "Voz de marca",
          options: {
            luxury: "Lujo",
            friendly: "Cercana",
            storytelling: "Narrativa",
            educational: "Educativa",
            emotional: "Emotiva",
            elegant: "Elegante",
          },
        },
        length: {
          label: "Longitud",
          options: {
            short: "Corta",
            medium: "Media",
            long: "Larga",
          },
        },
        cta: {
          label: "Llamado a la acción",
          options: {
            "shop-now": "Compra ahora",
            comment: "Comenta",
            share: "Comparte",
            "tag-a-friend": "Etiqueta a una amiga",
            "save-this-post": "Guarda esta publicación",
          },
        },
        audience: {
          label: "Público",
          options: {
            women: "Mujeres",
            couples: "Parejas",
            "gift-buyers": "Compradores de regalos",
            "jewelry-lovers": "Amantes de la joyería",
            "existing-customers": "Clientas actuales",
          },
        },
        emotion: {
          label: "Emoción",
          options: {
            inspiration: "Inspiración",
            gratitude: "Gratitud",
            confidence: "Confianza",
            "self-love": "Amor propio",
            romance: "Romance",
          },
        },
      },
    },
    poll: {
      groups: {
        product: {
          label: "Producto o colección",
          allowCustom: true,
          customPlaceholder: "ej. Nueva colección de pulseras de piedra luna",
          options: {
            bracelet: "Pulsera",
            necklace: "Collar",
            earrings: "Aretes",
            "new-collection": "Colección nueva",
          },
        },
        goal: {
          label: "Objetivo",
          options: {
            engagement: "Interacción",
            feedback: "Retroalimentación",
            "product-discovery": "Descubrimiento de producto",
            entertainment: "Entretenimiento",
            "pre-launch-buzz": "Expectativa antes del lanzamiento",
          },
        },
        audience: {
          label: "Público",
          options: {
            "new-followers": "Nuevos seguidores",
            "returning-customers": "Clientas recurrentes",
            "gift-buyers": "Compradores de regalos",
            "jewelry-lovers": "Amantes de la joyería",
          },
        },
        format: {
          label: "Formato de encuesta",
          options: {
            "this-or-that": "Esto o aquello",
            "yes-no": "Sí / No",
            "rating-scale": "Escala de calificación",
            "quiz-style": "Tipo cuestionario",
          },
        },
      },
    },
    story: {
      groups: {
        occasion: {
          label: "¿Qué estás anunciando?",
          allowCustom: true,
          customPlaceholder: "ej. Lanzamiento de una pulsera nueva",
          options: {
            "new-launch": "Lanzamiento nuevo",
            restock: "Reabastecimiento",
            sale: "Rebaja",
            "behind-the-scenes": "Detrás de cámaras",
            "day-in-the-life": "Un día en la marca",
          },
        },
        theme: {
          label: "Tema",
          options: {
            adventure: "Aventura",
            romance: "Romance",
            celebration: "Celebración",
            calm: "Calma",
            nostalgia: "Nostalgia",
          },
        },
        personality: {
          label: "Personalidad de marca",
          options: {
            warm: "Cálida",
            luxury: "Lujosa",
            playful: "Divertida",
            minimal: "Minimalista",
          },
        },
        length: {
          label: "Duración de la secuencia",
          options: {
            "3-slides": "3 diapositivas",
            "5-slides": "5 diapositivas",
            "7-slides": "7 diapositivas",
          },
        },
      },
    },
    reply: {
      groups: {
        comment: {
          label: "Pega el comentario de la clienta",
          freeText: true,
          customPlaceholder: "ej. ¿Esto le queda bien a una muñeca pequeña?",
        },
        tone: {
          label: "Tono de la respuesta",
          options: {
            warm: "Cálido",
            professional: "Profesional",
            playful: "Divertido",
            reassuring: "Tranquilizador",
          },
        },
        goal: {
          label: "Objetivo",
          options: {
            "answer-question": "Responder una pregunta",
            "handle-concern": "Resolver una duda",
            "thank-customer": "Agradecer a la clienta",
            "drive-sale": "Impulsar una venta",
          },
        },
      },
    },
    productDescription: {
      groups: {
        stone: {
          label: "Piedra o material",
          allowCustom: true,
          customPlaceholder: "ej. Amazonita, piedra luna, labradorita...",
          options: {
            moonstone: "Piedra luna",
            amazonite: "Amazonita",
            labradorite: "Labradorita",
            "rose-quartz": "Cuarzo rosa",
            turquoise: "Turquesa",
            "tigers-eye": "Ojo de tigre",
          },
        },
        productType: {
          label: "Tipo de producto",
          options: {
            bracelet: "Pulsera",
            necklace: "Collar",
            earrings: "Aretes",
            ring: "Anillo",
          },
        },
        style: {
          label: "Estilo",
          options: {
            elegant: "Elegante",
            minimalist: "Minimalista",
            bohemian: "Bohemio",
            luxury: "Lujo",
          },
        },
        seo: {
          label: "Optimizado para SEO",
          options: {
            yes: "Sí",
            no: "No",
          },
        },
        platform: {
          label: "Plataforma",
          options: {
            shopify: "Shopify",
            etsy: "Etsy",
            instagram: "Tienda de Instagram",
            generic: "Tienda genérica",
          },
        },
      },
    },
  },
};
