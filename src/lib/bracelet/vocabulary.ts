import { Locale } from "@/lib/types";

/**
 * Curated creative vocabulary banks that drive the Bracelet Idea Generator.
 * Each theme has its own small pool of evocative naming words, gemstone
 * associations, and imagery fragments, so generated concepts feel
 * thematically cohesive rather than randomly assembled. Themes without an
 * explicit entry fall back to GENERIC_VOCAB.
 *
 * Kept intentionally compact (a handful of items per field, per theme)
 * rather than exhaustive, so the bank stays maintainable while still
 * producing varied, on-theme results across "Regenerate" clicks.
 */

export interface ThemeVocab {
  /** Evocative single words or short phrases used to build bracelet names, e.g. "Morning Meadow". */
  nameWords: { en: string[]; es: string[] };
  /** Gemstones that suit this theme. */
  gemstones: { en: string[]; es: string[] };
  /** A short imagery fragment used inside the "Inspiration"/"Story" text. */
  imagery: { en: string[]; es: string[] };
  /** Small charm ideas that suit this theme. */
  charms: { en: string[]; es: string[] };
}

export const THEME_VOCAB: Record<string, ThemeVocab> = {
  flowers: {
    nameWords: {
      en: ["Meadow", "Bloom", "Petal", "Wildflower", "Blossom", "Garden"],
      es: ["Pradera", "Florecer", "Pétalo", "Flor Silvestre", "Capullo", "Jardín"],
    },
    gemstones: {
      en: ["Rose Quartz", "Moss Agate", "Pink Opal", "Peridot"],
      es: ["Cuarzo Rosa", "Ágata Musgo", "Ópalo Rosa", "Peridoto"],
    },
    imagery: {
      en: [
        "walking through a meadow just after sunrise, when the flowers are covered in morning dew",
        "the first wildflowers pushing through soft spring soil",
        "a sun-drenched garden path lined with blooming petals",
      ],
      es: [
        "caminar por una pradera justo después del amanecer, cuando las flores están cubiertas de rocío",
        "las primeras flores silvestres abriéndose paso en la tierra primaveral",
        "un sendero de jardín bañado de sol y bordeado de pétalos en flor",
      ],
    },
    charms: {
      en: ["tiny flower charm", "leaf charm", "dewdrop bead", "butterfly charm"],
      es: ["dije de flor pequeña", "dije de hoja", "cuenta de gota de rocío", "dije de mariposa"],
    },
  },
  ocean: {
    nameWords: {
      en: ["Tide", "Wave", "Shore", "Lagoon", "Seafoam", "Current"],
      es: ["Marea", "Ola", "Orilla", "Laguna", "Espuma de Mar", "Corriente"],
    },
    gemstones: {
      en: ["Aquamarine", "Larimar", "Blue Chalcedony", "Sea Glass"],
      es: ["Aguamarina", "Larimar", "Calcedonia Azul", "Vidrio de Mar"],
    },
    imagery: {
      en: [
        "standing at the shoreline as the tide rolls gently over bare feet",
        "sunlight scattering across turquoise water at low tide",
        "the quiet rhythm of waves at the edge of a hidden lagoon",
      ],
      es: [
        "estar en la orilla mientras la marea rueda suavemente sobre los pies descalzos",
        "la luz del sol dispersándose sobre aguas turquesas en marea baja",
        "el ritmo tranquilo de las olas en el borde de una laguna escondida",
      ],
    },
    charms: {
      en: ["tiny shell charm", "wave charm", "starfish bead", "sand dollar charm"],
      es: ["dije de concha pequeña", "dije de ola", "cuenta de estrella de mar", "dije de dólar de arena"],
    },
  },
  forest: {
    nameWords: {
      en: ["Woodland", "Fern", "Canopy", "Grove", "Moss", "Thicket"],
      es: ["Bosque", "Helecho", "Dosel", "Arboleda", "Musgo", "Espesura"],
    },
    gemstones: {
      en: ["Moss Agate", "Green Aventurine", "Smoky Quartz", "Jasper"],
      es: ["Ágata Musgo", "Aventurina Verde", "Cuarzo Ahumado", "Jaspe"],
    },
    imagery: {
      en: [
        "a quiet walk beneath a canopy of trees with sunlight filtering through the leaves",
        "the hush of a forest floor covered in soft moss after rain",
        "wandering a fern-lined path deep in an old-growth grove",
      ],
      es: [
        "una caminata tranquila bajo un dosel de árboles con la luz del sol filtrándose entre las hojas",
        "el silencio de un suelo de bosque cubierto de musgo suave después de la lluvia",
        "vagar por un sendero bordeado de helechos en una arboleda antigua",
      ],
    },
    charms: {
      en: ["tiny leaf charm", "acorn charm", "mushroom bead", "fox charm"],
      es: ["dije de hoja pequeña", "dije de bellota", "cuenta de hongo", "dije de zorro"],
    },
  },
  mountains: {
    nameWords: {
      en: ["Summit", "Ridge", "Alpine", "Peak", "Highland", "Cliffside"],
      es: ["Cumbre", "Cresta", "Alpino", "Pico", "Tierras Altas", "Acantilado"],
    },
    gemstones: {
      en: ["Labradorite", "Gray Agate", "Smoky Quartz", "Hematite"],
      es: ["Labradorita", "Ágata Gris", "Cuarzo Ahumado", "Hematita"],
    },
    imagery: {
      en: [
        "watching mist roll over a mountain ridge at first light",
        "the crisp stillness of standing above the clouds at a summit",
        "a quiet alpine trail lined with weathered stone",
      ],
      es: [
        "ver la niebla rodar sobre una cresta montañosa al amanecer",
        "la quietud fresca de estar por encima de las nubes en una cumbre",
        "un sendero alpino tranquilo bordeado de piedra desgastada",
      ],
    },
    charms: {
      en: ["tiny mountain charm", "compass charm", "pinecone bead", "arrow charm"],
      es: ["dije de montaña pequeña", "dije de brújula", "cuenta de piña", "dije de flecha"],
    },
  },
  desert: {
    nameWords: {
      en: ["Mirage", "Dune", "Mesa", "Sandstone", "Canyon", "Sagebrush"],
      es: ["Espejismo", "Duna", "Meseta", "Arenisca", "Cañón", "Artemisa"],
    },
    gemstones: {
      en: ["Tiger's Eye", "Carnelian", "Desert Jasper", "Sunstone"],
      es: ["Ojo de Tigre", "Cornalina", "Jaspe del Desierto", "Piedra del Sol"],
    },
    imagery: {
      en: [
        "golden dunes glowing warm under a low desert sun",
        "the quiet stillness of a canyon at dusk",
        "wind carving soft ripples into endless sand",
      ],
      es: [
        "dunas doradas resplandeciendo cálidas bajo un sol bajo del desierto",
        "la quietud tranquila de un cañón al anochecer",
        "el viento tallando suaves ondulaciones en arena infinita",
      ],
    },
    charms: {
      en: ["tiny cactus charm", "sun charm", "arrowhead bead", "moon charm"],
      es: ["dije de cactus pequeño", "dije de sol", "cuenta de punta de flecha", "dije de luna"],
    },
  },
  moon: {
    nameWords: {
      en: ["Moonlit", "Lunar", "Crescent", "Nightfall", "Silver Glow", "Eclipse"],
      es: ["Iluminado por la Luna", "Lunar", "Creciente", "Anochecer", "Resplandor Plateado", "Eclipse"],
    },
    gemstones: {
      en: ["Moonstone", "Labradorite", "White Opal", "Silver Quartz"],
      es: ["Piedra Luna", "Labradorita", "Ópalo Blanco", "Cuarzo Plateado"],
    },
    imagery: {
      en: [
        "moonlight pouring silver across a quiet night sky",
        "the soft glow of a crescent moon reflected on still water",
        "standing beneath a full moon on a clear, quiet night",
      ],
      es: [
        "la luz de la luna derramando plata sobre un cielo nocturno tranquilo",
        "el suave resplandor de una luna creciente reflejada en aguas quietas",
        "estar bajo una luna llena en una noche clara y tranquila",
      ],
    },
    charms: {
      en: ["tiny crescent moon charm", "star charm", "moon phase beads", "night sky charm"],
      es: ["dije de luna creciente pequeña", "dije de estrella", "cuentas de fases lunares", "dije de cielo nocturno"],
    },
  },
  stars: {
    nameWords: {
      en: ["Starlight", "Constellation", "Stardust", "Celestial Glow", "Nightsky", "Cosmos"],
      es: ["Luz de Estrella", "Constelación", "Polvo de Estrella", "Resplandor Celestial", "Cielo Nocturno", "Cosmos"],
    },
    gemstones: {
      en: ["Labradorite", "Iolite", "Blue Sapphire chips", "Star Diopside"],
      es: ["Labradorita", "Iolita", "Chips de Zafiro Azul", "Diópsido Estrella"],
    },
    imagery: {
      en: [
        "lying beneath a sky scattered with countless stars",
        "the quiet wonder of tracing constellations on a clear night",
        "starlight catching on a still, dark horizon",
      ],
      es: [
        "recostarse bajo un cielo salpicado de innumerables estrellas",
        "el asombro tranquilo de trazar constelaciones en una noche clara",
        "la luz de las estrellas reflejándose en un horizonte oscuro y quieto",
      ],
    },
    charms: {
      en: ["tiny star charm", "shooting star charm", "constellation bead", "moon charm"],
      es: ["dije de estrella pequeña", "dije de estrella fugaz", "cuenta de constelación", "dije de luna"],
    },
  },
  zodiac: {
    nameWords: {
      en: ["Celestial", "Zodiac", "Astral", "Starborn", "Cosmic", "Horizon"],
      es: ["Celestial", "Zodiaco", "Astral", "Nacido de las Estrellas", "Cósmico", "Horizonte"],
    },
    gemstones: {
      en: ["Birthstone crystals", "Labradorite", "Amethyst", "Citrine"],
      es: ["Cristales de piedra natal", "Labradorita", "Amatista", "Citrino"],
    },
    imagery: {
      en: [
        "the quiet certainty of reading the stars for guidance",
        "a personal talisman tied to one's own astral chart",
        "the sense of connection between the self and the cosmos",
      ],
      es: [
        "la certeza tranquila de leer las estrellas para encontrar guía",
        "un talismán personal ligado a la propia carta astral",
        "la sensación de conexión entre el ser y el cosmos",
      ],
    },
    charms: {
      en: ["zodiac symbol charm", "star charm", "moon charm", "birthstone bead"],
      es: ["dije de símbolo zodiacal", "dije de estrella", "dije de luna", "cuenta de piedra natal"],
    },
  },
  butterflies: {
    nameWords: {
      en: ["Monarch", "Flutter", "Wingspan", "Chrysalis", "Meadowlight", "Papillon"],
      es: ["Monarca", "Aleteo", "Envergadura", "Crisálida", "Luz de Pradera", "Papillon"],
    },
    gemstones: {
      en: ["Opal", "Amethyst", "Pink Tourmaline", "Citrine"],
      es: ["Ópalo", "Amatista", "Turmalina Rosa", "Citrino"],
    },
    imagery: {
      en: [
        "a monarch butterfly drifting slowly over a sunlit meadow",
        "the delicate stillness of wings catching the light",
        "the quiet transformation of a chrysalis becoming something new",
      ],
      es: [
        "una mariposa monarca flotando lentamente sobre una pradera soleada",
        "la quietud delicada de las alas atrapando la luz",
        "la transformación silenciosa de una crisálida convirtiéndose en algo nuevo",
      ],
    },
    charms: {
      en: ["tiny butterfly charm", "flower charm", "wing bead", "dragonfly charm"],
      es: ["dije de mariposa pequeña", "dije de flor", "cuenta de ala", "dije de libélula"],
    },
  },
  bees: {
    nameWords: {
      en: ["Honeycomb", "Meadow Buzz", "Golden Hive", "Nectar", "Pollinator", "Amber Wing"],
      es: ["Panal", "Zumbido de Pradera", "Colmena Dorada", "Néctar", "Polinizador", "Ala de Ámbar"],
    },
    gemstones: {
      en: ["Citrine", "Amber", "Yellow Jasper", "Golden Topaz"],
      es: ["Citrino", "Ámbar", "Jaspe Amarillo", "Topacio Dorado"],
    },
    imagery: {
      en: [
        "the warm hum of bees moving through a golden summer garden",
        "sunlight catching on honey-colored hives",
        "a quiet meadow alive with the gentle work of pollinators",
      ],
      es: [
        "el zumbido cálido de las abejas moviéndose por un jardín dorado de verano",
        "la luz del sol reflejándose en colmenas color miel",
        "una pradera tranquila llena de vida con el trabajo suave de los polinizadores",
      ],
    },
    charms: {
      en: ["tiny bee charm", "honeycomb bead", "flower charm", "hexagon bead"],
      es: ["dije de abeja pequeña", "cuenta de panal", "dije de flor", "cuenta hexagonal"],
    },
  },
  autumn: {
    nameWords: {
      en: ["Amber Leaf", "Harvest", "Maple", "Golden Fall", "Cinnamon", "Ember"],
      es: ["Hoja de Ámbar", "Cosecha", "Arce", "Otoño Dorado", "Canela", "Brasa"],
    },
    gemstones: {
      en: ["Carnelian", "Tiger's Eye", "Smoky Quartz", "Amber"],
      es: ["Cornalina", "Ojo de Tigre", "Cuarzo Ahumado", "Ámbar"],
    },
    imagery: {
      en: [
        "walking through fallen leaves on a crisp autumn afternoon",
        "the warm amber light of harvest season settling over the fields",
        "the smell of cinnamon and the first cold morning of fall",
      ],
      es: [
        "caminar entre hojas caídas en una tarde fresca de otoño",
        "la luz ámbar y cálida de la temporada de cosecha sobre los campos",
        "el aroma a canela y la primera mañana fría del otoño",
      ],
    },
    charms: {
      en: ["tiny leaf charm", "acorn charm", "pumpkin bead", "pinecone charm"],
      es: ["dije de hoja pequeña", "dije de bellota", "cuenta de calabaza", "dije de piña"],
    },
  },
  spring: {
    nameWords: {
      en: ["First Bloom", "Renewal", "Petal Rain", "New Growth", "Meadowlark", "Fresh Bud"],
      es: ["Primer Brote", "Renovación", "Lluvia de Pétalos", "Nuevo Crecimiento", "Alondra", "Brote Fresco"],
    },
    gemstones: {
      en: ["Peridot", "Rose Quartz", "Green Aventurine", "Moonstone"],
      es: ["Peridoto", "Cuarzo Rosa", "Aventurina Verde", "Piedra Luna"],
    },
    imagery: {
      en: [
        "the first warm rain waking a garden after winter",
        "soft new growth pushing through thawing soil",
        "a fresh morning full of birdsong and new blossoms",
      ],
      es: [
        "la primera lluvia cálida despertando un jardín después del invierno",
        "nuevos brotes suaves abriéndose paso en la tierra que se descongela",
        "una mañana fresca llena de canto de pájaros y flores nuevas",
      ],
    },
    charms: {
      en: ["tiny flower bud charm", "bird charm", "raindrop bead", "leaf charm"],
      es: ["dije de capullo pequeño", "dije de pájaro", "cuenta de gota de lluvia", "dije de hoja"],
    },
  },
  winter: {
    nameWords: {
      en: ["Frost", "Snowfall", "Winter Hush", "Icicle", "Pale Dawn", "Evergreen"],
      es: ["Escarcha", "Nevada", "Silencio de Invierno", "Carámbano", "Alba Pálida", "Siempreverde"],
    },
    gemstones: {
      en: ["Clear Quartz", "White Howlite", "Blue Lace Agate", "Silver Hematite"],
      es: ["Cuarzo Transparente", "Howlita Blanca", "Ágata Encaje Azul", "Hematita Plateada"],
    },
    imagery: {
      en: [
        "the quiet hush of snow falling over a still landscape",
        "frost catching the first pale light of a winter morning",
        "the crisp stillness of a forest under a blanket of snow",
      ],
      es: [
        "el silencio tranquilo de la nieve cayendo sobre un paisaje inmóvil",
        "la escarcha atrapando la primera luz pálida de una mañana de invierno",
        "la quietud fresca de un bosque bajo un manto de nieve",
      ],
    },
    charms: {
      en: ["tiny snowflake charm", "star charm", "pinecone bead", "icicle charm"],
      es: ["dije de copo de nieve pequeño", "dije de estrella", "cuenta de piña", "dije de carámbano"],
    },
  },
  summer: {
    nameWords: {
      en: ["Sunbeam", "Golden Hour", "Wildflower Field", "Warm Breeze", "Citrus Grove", "Long Days"],
      es: ["Rayo de Sol", "Hora Dorada", "Campo Silvestre", "Brisa Cálida", "Huerto de Cítricos", "Días Largos"],
    },
    gemstones: {
      en: ["Citrine", "Sunstone", "Yellow Topaz", "Carnelian"],
      es: ["Citrino", "Piedra del Sol", "Topacio Amarillo", "Cornalina"],
    },
    imagery: {
      en: [
        "long golden evenings that stretch late into summer",
        "warm sun on skin at the edge of a wildflower field",
        "the easy stillness of a slow summer afternoon",
      ],
      es: [
        "largas tardes doradas que se extienden hasta bien entrada la noche de verano",
        "el sol cálido en la piel al borde de un campo silvestre",
        "la quietud sencilla de una tarde lenta de verano",
      ],
    },
    charms: {
      en: ["tiny sun charm", "flower charm", "citrus slice bead", "seashell charm"],
      es: ["dije de sol pequeño", "dije de flor", "cuenta de rodaja de cítrico", "dije de concha"],
    },
  },
  japanese: {
    nameWords: {
      en: ["Sakura", "Zen Garden", "Koi Pond", "Tranquil Bamboo", "Lantern Light", "Quiet Temple"],
      es: ["Sakura", "Jardín Zen", "Estanque de Koi", "Bambú Tranquilo", "Luz de Farol", "Templo Silencioso"],
    },
    gemstones: {
      en: ["Pink Cherry Quartz", "Jade", "White Jasper", "Freshwater Pearl"],
      es: ["Cuarzo Cerezo Rosa", "Jade", "Jaspe Blanco", "Perla de Agua Dulce"],
    },
    imagery: {
      en: [
        "cherry blossoms drifting quietly over a still garden pond",
        "the calm of a zen garden at first light",
        "soft lantern light along a quiet temple path",
      ],
      es: [
        "flores de cerezo cayendo suavemente sobre un estanque de jardín tranquilo",
        "la calma de un jardín zen a la primera luz del día",
        "la suave luz de un farol a lo largo de un sendero de templo silencioso",
      ],
    },
    charms: {
      en: ["tiny cherry blossom charm", "koi fish bead", "lantern charm", "bamboo bead"],
      es: ["dije de flor de cerezo pequeña", "cuenta de pez koi", "dije de farol", "cuenta de bambú"],
    },
  },
  scandinavian: {
    nameWords: {
      en: ["Nordic Light", "Fjord", "Birch", "Hygge", "Pale Dawn", "Quiet North"],
      es: ["Luz Nórdica", "Fiordo", "Abedul", "Hygge", "Alba Pálida", "Norte Silencioso"],
    },
    gemstones: {
      en: ["Clear Quartz", "White Howlite", "Grey Moonstone", "Labradorite"],
      es: ["Cuarzo Transparente", "Howlita Blanca", "Piedra Luna Gris", "Labradorita"],
    },
    imagery: {
      en: [
        "pale winter light over a still fjord at dawn",
        "the quiet comfort of hygge on a slow, cozy morning",
        "birch trees standing calm against a soft grey sky",
      ],
      es: [
        "la luz pálida del invierno sobre un fiordo tranquilo al amanecer",
        "la comodidad silenciosa del hygge en una mañana lenta y acogedora",
        "abedules de pie en calma contra un cielo gris suave",
      ],
    },
    charms: {
      en: ["tiny birch leaf charm", "snowflake bead", "minimalist circle charm", "star charm"],
      es: ["dije de hoja de abedul pequeña", "cuenta de copo de nieve", "dije de círculo minimalista", "dije de estrella"],
    },
  },
  vintage: {
    nameWords: {
      en: ["Heirloom", "Antique Rose", "Old Lace", "Timeworn", "Keepsake", "Faded Gold"],
      es: ["Reliquia", "Rosa Antigua", "Encaje Viejo", "Desgastado por el Tiempo", "Recuerdo", "Oro Desgastado"],
    },
    gemstones: {
      en: ["Smoky Quartz", "Garnet", "Amber", "Freshwater Pearl"],
      es: ["Cuarzo Ahumado", "Granate", "Ámbar", "Perla de Agua Dulce"],
    },
    imagery: {
      en: [
        "the quiet warmth of an heirloom passed down through generations",
        "faded lace and soft antique gold catching afternoon light",
        "a keepsake box full of small, treasured things",
      ],
      es: [
        "la calidez silenciosa de una reliquia transmitida por generaciones",
        "encaje desvaído y oro antiguo suave atrapando la luz de la tarde",
        "una caja de recuerdos llena de pequeñas cosas atesoradas",
      ],
    },
    charms: {
      en: ["antique-style locket charm", "filigree bead", "vintage key charm", "pearl drop"],
      es: ["dije de relicario estilo antiguo", "cuenta de filigrana", "dije de llave vintage", "gota de perla"],
    },
  },
  botanical: {
    nameWords: {
      en: ["Herbarium", "Fern & Leaf", "Botanical Study", "Greenhouse", "Wild Root", "Verdant"],
      es: ["Herbario", "Helecho y Hoja", "Estudio Botánico", "Invernadero", "Raíz Silvestre", "Frondoso"],
    },
    gemstones: {
      en: ["Green Aventurine", "Moss Agate", "Peridot", "Jade"],
      es: ["Aventurina Verde", "Ágata Musgo", "Peridoto", "Jade"],
    },
    imagery: {
      en: [
        "pressed leaves and wildflowers kept like a quiet herbarium",
        "the humid warmth of a greenhouse full of green life",
        "wild roots and ferns growing tangled and free",
      ],
      es: [
        "hojas prensadas y flores silvestres guardadas como un herbario silencioso",
        "el calor húmedo de un invernadero lleno de vida verde",
        "raíces silvestres y helechos creciendo enredados y libres",
      ],
    },
    charms: {
      en: ["tiny fern charm", "leaf charm", "seed pod bead", "root charm"],
      es: ["dije de helecho pequeño", "dije de hoja", "cuenta de vaina de semilla", "dije de raíz"],
    },
  },
  celestial: {
    nameWords: {
      en: ["Celestial", "Nebula", "Stargazer", "Cosmic Dust", "Aurora", "Skybound"],
      es: ["Celestial", "Nebulosa", "Observadora de Estrellas", "Polvo Cósmico", "Aurora", "Rumbo al Cielo"],
    },
    gemstones: {
      en: ["Labradorite", "Iolite", "Amethyst", "Moonstone"],
      es: ["Labradorita", "Iolita", "Amatista", "Piedra Luna"],
    },
    imagery: {
      en: [
        "the shifting colors of an aurora dancing across a night sky",
        "the quiet vastness of stargazing far from city lights",
        "swirling nebula colors captured in polished stone",
      ],
      es: [
        "los colores cambiantes de una aurora danzando en el cielo nocturno",
        "la vastedad silenciosa de observar estrellas lejos de las luces de la ciudad",
        "los colores arremolinados de una nebulosa capturados en piedra pulida",
      ],
    },
    charms: {
      en: ["tiny star charm", "moon charm", "galaxy bead", "comet charm"],
      es: ["dije de estrella pequeña", "dije de luna", "cuenta de galaxia", "dije de cometa"],
    },
  },
  woodland: {
    nameWords: {
      en: ["Fable Forest", "Fawn", "Hollow Oak", "Toadstool", "Wild Thicket", "Deer Path"],
      es: ["Bosque de Fábula", "Cervatillo", "Roble Hueco", "Seta", "Espesura Silvestre", "Sendero del Ciervo"],
    },
    gemstones: {
      en: ["Moss Agate", "Smoky Quartz", "Tiger's Eye", "Jasper"],
      es: ["Ágata Musgo", "Cuarzo Ahumado", "Ojo de Tigre", "Jaspe"],
    },
    imagery: {
      en: [
        "a storybook woodland where fawns wander quiet, mossy paths",
        "the hush of an old hollow oak deep in the forest",
        "toadstools and ferns growing along a hidden deer path",
      ],
      es: [
        "un bosque de cuento donde los cervatillos recorren senderos musgosos y tranquilos",
        "el silencio de un viejo roble hueco en lo profundo del bosque",
        "setas y helechos creciendo a lo largo de un sendero escondido de ciervos",
      ],
    },
    charms: {
      en: ["tiny fox charm", "mushroom bead", "acorn charm", "deer charm"],
      es: ["dije de zorro pequeño", "cuenta de hongo", "dije de bellota", "dije de ciervo"],
    },
  },
  tropical: {
    nameWords: {
      en: ["Palm Breeze", "Hibiscus", "Island Light", "Coconut Grove", "Lagoon Bloom", "Sunset Coast"],
      es: ["Brisa de Palma", "Hibisco", "Luz de Isla", "Huerto de Coco", "Flor de Laguna", "Costa al Atardecer"],
    },
    gemstones: {
      en: ["Carnelian", "Citrine", "Turquoise", "Coral"],
      es: ["Cornalina", "Citrino", "Turquesa", "Coral"],
    },
    imagery: {
      en: [
        "warm island light filtering through swaying palm leaves",
        "hibiscus blooms bright against turquoise water",
        "the easy warmth of a sunset over a quiet tropical coast",
      ],
      es: [
        "la cálida luz de la isla filtrándose entre hojas de palma que se mecen",
        "flores de hibisco brillantes contra el agua turquesa",
        "la calidez sencilla de un atardecer sobre una costa tropical tranquila",
      ],
    },
    charms: {
      en: ["tiny palm leaf charm", "shell bead", "hibiscus charm", "starfish charm"],
      es: ["dije de hoja de palma pequeña", "cuenta de concha", "dije de hibisco", "dije de estrella de mar"],
    },
  },
};

export const GENERIC_VOCAB: ThemeVocab = {
  nameWords: {
    en: ["Golden Hour", "Quiet Grace", "Soft Light", "Gentle Spirit", "Radiant", "Serene"],
    es: ["Hora Dorada", "Gracia Silenciosa", "Luz Suave", "Espíritu Gentil", "Radiante", "Serena"],
  },
  gemstones: {
    en: ["Rose Quartz", "Moonstone", "Clear Quartz", "Citrine"],
    es: ["Cuarzo Rosa", "Piedra Luna", "Cuarzo Transparente", "Citrino"],
  },
  imagery: {
    en: [
      "a quiet, unhurried moment of everyday beauty",
      "soft light settling over something simple and meaningful",
      "the calm feeling of a small, cherished ritual",
    ],
    es: [
      "un momento tranquilo y sin prisas de belleza cotidiana",
      "una luz suave posándose sobre algo simple y significativo",
      "la sensación calmada de un pequeño ritual apreciado",
    ],
  },
  charms: {
    en: ["tiny heart charm", "star charm", "leaf charm", "drop bead"],
    es: ["dije de corazón pequeño", "dije de estrella", "dije de hoja", "gota de cuenta"],
  },
};

export function getThemeVocab(themeId?: string): ThemeVocab {
  if (themeId && THEME_VOCAB[themeId]) return THEME_VOCAB[themeId];
  return GENERIC_VOCAB;
}

export function vocabList(vocab: ThemeVocab, field: keyof ThemeVocab, locale: Locale): string[] {
  return vocab[field][locale];
}
