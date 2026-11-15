/**
 * Sample content for local development: destinations with map coordinates,
 * local hosts, categories, experiences with itineraries, and guest reviews.
 */

export type StepSeed = [title: string, location: string, duration: string, description: string, lat?: number, lng?: number, admission?: "INCLUDED" | "FREE" | "NOT_INCLUDED" | "PASS_BY"];

export type ExperienceSeed = {
  slug: string;
  title: string;
  category: string; // category slug
  host: string; // host slug
  summary: string;
  description?: string;
  durationHours: number;
  price: number;
  pricingType?: "PER_PERSON" | "PER_GROUP";
  maxGroupSize?: number;
  languages: string;
  highlights: string[];
  included: string[];
  notIncluded?: string[];
  meetingPoint: string;
  meetingLat?: number;
  meetingLng?: number;
  startTime?: string;
  endPoint?: string;
  featured?: boolean;
  steps: StepSeed[];
};

export type CitySeed = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  tagline: string;
  description: string;
  hotspot?: boolean;
  hosts: { slug: string; name: string; tagline: string; bio: string; languages: string; verified?: boolean; responseTimeHours?: number }[];
  experiences: ExperienceSeed[];
};

export type CountrySeed = { slug: string; name: string; iso: string; lat: number; lng: number; description: string; cities: CitySeed[] };

export const categories = [
  { slug: "food-drink", name: "Food & Drink", icon: "🍜", sortOrder: 1, description: "Markets, street food, tastings and home-cooked meals." },
  { slug: "culture", name: "Culture", icon: "🎭", sortOrder: 2, description: "Neighbourhoods, art and everyday life with a local." },
  { slug: "history", name: "History", icon: "🏛️", sortOrder: 3, description: "Ancient sites and the stories behind them." },
  { slug: "nature", name: "Nature", icon: "🌿", sortOrder: 4, description: "Sunsets, hikes and the great outdoors." },
  { slug: "nightlife", name: "Nightlife", icon: "🌙", sortOrder: 5, description: "Bars, live music and the city after dark." },
  { slug: "workshops", name: "Workshops", icon: "🎨", sortOrder: 6, description: "Learn a craft or cook with your host." },
];

const FREE_CANCEL = "Free cancellation up to 24 hours before the start.";
export { FREE_CANCEL };

export const countries: CountrySeed[] = [
  {
    slug: "lebanon", name: "Lebanon", iso: "LB", lat: 33.85, lng: 35.86,
    description: "Mountains, Mediterranean coast and some of the oldest cities on earth.",
    cities: [
      {
        slug: "beirut", name: "Beirut", lat: 33.8938, lng: 35.5018, hotspot: true,
        tagline: "Mezze, sea views and rooftop nights",
        description: "A city of layers — Roman ruins, Ottoman houses and a restless nightlife.",
        hosts: [
          { slug: "rania-haddad", name: "Rania Haddad", tagline: "Chef & market lover", languages: "English, French, Arabic", verified: true, responseTimeHours: 2,
            bio: "I grew up in my grandmother's kitchen in Achrafieh. Today I cook for a living, and on weekends I take travellers to the bakers, grocers and grill masters who feed this city." },
          { slug: "karim-nassar", name: "Karim Nassar", tagline: "Architect, night owl", languages: "English, Arabic", verified: true, responseTimeHours: 4,
            bio: "I restore old Beiruti houses by day and know every rooftop bar by night. Let me show you how the city rebuilds itself — and how it celebrates." },
        ],
        experiences: [
          {
            slug: "beirut-food-walk", title: "Beirut Food Walk", category: "food-drink", host: "rania-haddad", featured: true,
            summary: "Mezze, manousheh and knefeh through Mar Mikhael and Gemmayzeh.",
            description: "Eat your way through two of Beirut's liveliest neighbourhoods with someone who knows every baker by name. We'll taste the classics, meet the people who make them, and talk about how food holds this city together.",
            durationHours: 3.5, price: 45, maxGroupSize: 8, languages: "English, French, Arabic",
            highlights: ["Taste 8+ Lebanese specialities", "Meet the family bakers of Mar Mikhael", "Finish with warm knefeh downtown"],
            included: ["All food tastings", "Fresh juice", "Bottled water"], notIncluded: ["Alcoholic drinks", "Hotel pick-up"],
            meetingPoint: "Mar Mikhael train station steps",
            steps: [
              ["Breakfast manousheh", "Mar Mikhael", "30 min", "Za'atar and cheese flatbread straight from the oven.", 33.8968, 35.5225],
              ["Gemmayzeh stairs", "St. Nicholas Stairs", "40 min", "Walk the art stairs and stop for fresh juice.", 33.8946, 35.5178, "FREE"],
              ["Knefeh finale", "Downtown", "30 min", "Warm cheese pastry with orange-blossom syrup.", 33.896, 35.5047],
            ],
          },
          {
            slug: "corniche-sunset", title: "Corniche Sunset", category: "nature", host: "karim-nassar",
            summary: "Stroll the seafront to Raouché's Pigeon Rocks at golden hour.",
            durationHours: 2, price: 0, maxGroupSize: 10, languages: "English, Arabic",
            highlights: ["Golden hour at Pigeon Rocks", "Corn on the cob from a street cart", "The best photo spots on the seafront"],
            included: ["Local guide"], meetingPoint: "Ain El Mreisseh lighthouse",
            steps: [
              ["Ain El Mreisseh", "Corniche", "45 min", "Join joggers, fishermen and families on the seafront promenade.", 33.901, 35.49, "FREE"],
              ["Pigeon Rocks", "Raouché", "45 min", "Watch the sun drop behind Beirut's famous sea arches.", 33.8897, 35.47, "FREE"],
            ],
          },
          {
            slug: "beirut-rooftops-by-night", title: "Beirut Rooftops by Night", category: "nightlife", host: "karim-nassar", featured: true,
            summary: "Three rooftops, three neighbourhoods, one very long night.",
            durationHours: 4, price: 60, maxGroupSize: 6, languages: "English, Arabic",
            highlights: ["Skip-the-line at local favourites", "Arak tasting with mezze", "Stories of Beirut's nightlife history"],
            included: ["First drink at each stop", "Mezze plates"], notIncluded: ["Taxi between stops"],
            meetingPoint: "Gemmayzeh, Rue Gouraud",
            steps: [
              ["Sunset drinks", "Gemmayzeh", "1 h", "Start high above the old town as the lights come on.", 33.8952, 35.516],
              ["Arak & mezze", "Badaro", "1 h 30", "A family-run spot where locals spend whole evenings.", 33.8748, 35.515],
              ["Last call", "Mar Mikhael", "1 h 30", "Live music and the city's best late-night crowd.", 33.8975, 35.524],
            ],
          },
        ],
      },
      {
        slug: "byblos", name: "Byblos", lat: 34.123, lng: 35.6519,
        tagline: "7,000 years by the sea",
        description: "One of the oldest continuously inhabited cities in the world.",
        hosts: [
          { slug: "elie-khoury", name: "Elie Khoury", tagline: "Archaeologist & fisherman's son", languages: "English, French, Arabic", verified: true, responseTimeHours: 6,
            bio: "I dig in Byblos for a living and grew up on its harbour. Seven thousand years of history is a lot — I'll give you the best of it." },
        ],
        experiences: [
          {
            slug: "ancient-byblos", title: "Ancient Byblos", category: "history", host: "elie-khoury",
            summary: "Crusader castle, Phoenician ruins and a fish lunch by the old port.",
            durationHours: 4, price: 30, maxGroupSize: 10, languages: "English, French, Arabic",
            highlights: ["Walk 7,000 years of history", "Crusader castle with an archaeologist", "Fresh catch by the harbour"],
            included: ["Entry tickets", "Expert guiding"], notIncluded: ["Lunch"],
            meetingPoint: "Byblos Castle entrance",
            steps: [
              ["Crusader Castle", "Byblos Citadel", "1 h", "Climb the 12th-century keep for views over the ruins.", 34.1199, 35.6455, "INCLUDED"],
              ["Old souk", "Historic centre", "45 min", "Fossil shops and stone-paved lanes.", 34.1215, 35.647, "FREE"],
              ["Harbour lunch", "Old Port", "1 h 30", "Grilled fish where Phoenician ships once docked.", 34.1232, 35.644],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "france", name: "France", iso: "FR", lat: 46.6, lng: 2.2,
    description: "Cafés, markets and art on every corner.",
    cities: [
      {
        slug: "paris", name: "Paris", lat: 48.8566, lng: 2.3522, hotspot: true,
        tagline: "Hidden courtyards & the perfect croissant",
        description: "The City of Light, best discovered one neighbourhood at a time.",
        hosts: [
          { slug: "camille-laurent", name: "Camille Laurent", tagline: "Painter living in Montmartre", languages: "English, French, Spanish", verified: true, responseTimeHours: 3,
            bio: "I have painted in Montmartre for fifteen years. I know where the light is best at 9am and which bakery wins the croissant war this year." },
          { slug: "hugo-martin", name: "Hugo Martin", tagline: "Cheesemonger & wine nerd", languages: "English, French", responseTimeHours: 5,
            bio: "Third-generation fromager in the Marais. If it's made from milk or grapes, I want you to taste it." },
        ],
        experiences: [
          {
            slug: "montmartre-morning", title: "Montmartre Morning", category: "culture", host: "camille-laurent", featured: true,
            summary: "Croissants, painters' square and the view from Sacré-Cœur.",
            durationHours: 3, price: 25, maxGroupSize: 8, languages: "English, French, Spanish",
            highlights: ["Visit a working artist's studio", "Award-winning croissant tasting", "Sacré-Cœur before the crowds"],
            included: ["Pastry tasting", "Studio visit"], meetingPoint: "Abbesses metro station",
            steps: [
              ["Boulangerie stop", "Rue des Abbesses", "20 min", "Pick up a buttery croissant to go.", 48.8846, 2.338],
              ["Place du Tertre", "Montmartre", "45 min", "Watch painters at work in the old village square.", 48.8865, 2.3408, "FREE"],
              ["Sacré-Cœur", "Butte Montmartre", "45 min", "The best free view over Paris.", 48.8867, 2.3431, "FREE"],
            ],
          },
          {
            slug: "marais-cheese-and-wine", title: "Marais Cheese & Wine Tasting", category: "food-drink", host: "hugo-martin",
            summary: "Six cheeses, four wines and the stories of the farmers behind them.",
            durationHours: 2.5, price: 85, maxGroupSize: 6, languages: "English, French",
            highlights: ["Taste in a 17th-century cellar", "Learn to pair like a Parisian", "Take home a tasting guide"],
            included: ["6 cheeses", "4 glasses of wine", "Bread & charcuterie"], notIncluded: ["Gratuities"],
            meetingPoint: "Place des Vosges, north arcade",
            steps: [
              ["Fromagerie visit", "Rue de Bretagne", "45 min", "Meet the affineurs and pick our cheeses.", 48.863, 2.361],
              ["Cellar tasting", "Le Marais", "1 h 30", "Pair, sip and compare in a vaulted stone cellar.", 48.8575, 2.359, "INCLUDED"],
            ],
          },
        ],
      },
      {
        slug: "lyon", name: "Lyon", lat: 45.764, lng: 4.8357,
        tagline: "The capital of French food",
        description: "Silk-weavers' passages, bouchons and two rivers.",
        hosts: [
          { slug: "lea-bernard", name: "Léa Bernard", tagline: "Bouchon chef's daughter", languages: "English, French, Italian", responseTimeHours: 8,
            bio: "My family has run a bouchon in Vieux Lyon for forty years. I'll show you the traboules and feed you until you beg me to stop." },
        ],
        experiences: [
          {
            slug: "lyon-traboules-and-bouchons", title: "Traboules & Bouchons", category: "food-drink", host: "lea-bernard",
            summary: "Secret passageways of Vieux Lyon and a proper bouchon lunch.",
            durationHours: 3.5, price: 70, maxGroupSize: 8, languages: "English, French, Italian",
            highlights: ["Hidden Renaissance traboules", "Three-course bouchon lunch", "Praline tart at the best pâtisserie"],
            included: ["Lunch with wine", "Pastry"], meetingPoint: "Saint-Jean Cathedral",
            steps: [
              ["Traboules walk", "Vieux Lyon", "1 h 15", "Slip through the silk-weavers' secret passages.", 45.763, 4.8275, "FREE"],
              ["Bouchon lunch", "Rue Saint-Jean", "1 h 30", "Quenelles, saucisson brioché and a pot of Beaujolais.", 45.762, 4.827],
              ["Praline tart", "Presqu'île", "30 min", "Lyon's pink, sugary signature.", 45.764, 4.834],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "italy", name: "Italy", iso: "IT", lat: 42.5, lng: 12.5,
    description: "La dolce vita: piazzas, pasta and two thousand years of art.",
    cities: [
      {
        slug: "rome", name: "Rome", lat: 41.9028, lng: 12.4964, hotspot: true,
        tagline: "Carbonara, cobblestones & ancient ruins",
        description: "An open-air museum where locals still live, eat and argue in the piazza.",
        hosts: [
          { slug: "giulia-rossi", name: "Giulia Rossi", tagline: "Trastevere born & raised", languages: "English, Italian", verified: true, responseTimeHours: 2,
            bio: "Trastevere is my village inside the city. I'll take you to the trattorias my nonna approves of and away from the tourist menus." },
        ],
        experiences: [
          {
            slug: "trastevere-food-tour", title: "Trastevere Food Tour", category: "food-drink", host: "giulia-rossi", featured: true,
            summary: "Supplì, cacio e pepe and gelato in Rome's most charming quarter.",
            durationHours: 3, price: 75, maxGroupSize: 8, languages: "English, Italian",
            highlights: ["10 tastings incl. wine", "Family-run trattoria", "Artisan gelato"], included: ["All food", "2 glasses of wine"],
            meetingPoint: "Piazza di Santa Maria in Trastevere fountain",
            steps: [
              ["Supplì stop", "Via di San Francesco a Ripa", "20 min", "Rome's fried rice ball, molten mozzarella inside.", 41.8865, 12.473],
              ["Trattoria", "Trastevere", "1 h 15", "Cacio e pepe and carbonara, side by side.", 41.8895, 12.47],
              ["Gelato", "Piazza Trilussa", "20 min", "The real thing — no neon mountains of ice cream.", 41.8922, 12.47],
            ],
          },
          {
            slug: "rome-ancient-secrets", title: "Ancient Rome Secrets", category: "history", host: "giulia-rossi",
            summary: "The Colosseum's stories and the hidden ruins tourists walk past.",
            durationHours: 3, price: 220, pricingType: "PER_GROUP", maxGroupSize: 6, languages: "English, Italian",
            highlights: ["Private guide for your group", "Lesser-known ruins", "Best views of the Forum"], included: ["Private guide"], notIncluded: ["Entry tickets"],
            meetingPoint: "Colosseo metro exit",
            steps: [
              ["Colosseum outside", "Piazza del Colosseo", "45 min", "Gladiators, emperors and the real story.", 41.8902, 12.4922, "PASS_BY"],
              ["Palatine views", "Via di San Gregorio", "1 h", "Where Rome began.", 41.8892, 12.4875, "PASS_BY"],
              ["Hidden ruins", "Largo di Torre Argentina", "45 min", "Where Caesar fell — and where cats now rule.", 41.8955, 12.4768, "FREE"],
            ],
          },
        ],
      },
      {
        slug: "florence", name: "Florence", lat: 43.7696, lng: 11.2558,
        tagline: "Renaissance art & Tuscan wine",
        description: "A Renaissance jewel on the Arno.",
        hosts: [
          { slug: "marco-bianchi", name: "Marco Bianchi", tagline: "Leather artisan", languages: "English, Italian, German", responseTimeHours: 12,
            bio: "I run a small leather workshop in Oltrarno, like my father did. Come and make something with your own hands." },
        ],
        experiences: [
          {
            slug: "florence-leather-workshop", title: "Leather Workshop in Oltrarno", category: "workshops", host: "marco-bianchi",
            summary: "Craft your own leather wallet with a third-generation artisan.",
            durationHours: 2.5, price: 95, maxGroupSize: 4, languages: "English, Italian, German",
            highlights: ["Make a wallet to take home", "Traditional Florentine tools", "Espresso in the workshop"], included: ["Materials", "Tools", "Espresso"],
            meetingPoint: "Piazza Santo Spirito",
            steps: [
              ["Choose your leather", "Oltrarno workshop", "20 min", "Feel the difference between hides and pick yours.", 43.7665, 11.247],
              ["Cut & stitch", "Workshop bench", "1 h 45", "Saddle-stitch your wallet by hand.", 43.7662, 11.2476, "INCLUDED"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "spain", name: "Spain", iso: "ES", lat: 40.4, lng: -3.7,
    description: "Late dinners, long sunsets and fiestas.",
    cities: [
      {
        slug: "barcelona", name: "Barcelona", lat: 41.3874, lng: 2.1686, hotspot: true,
        tagline: "Gaudí, tapas & beach sunsets",
        description: "Modernist architecture, Gothic lanes and the Mediterranean on your doorstep.",
        hosts: [
          { slug: "pau-ferrer", name: "Pau Ferrer", tagline: "Born in El Born", languages: "English, Spanish, Catalan", verified: true, responseTimeHours: 3,
            bio: "I'm a Barcelona tour designer and amateur chef. I love the city's backstreets and its vermouth hour — I'll show you both." },
        ],
        experiences: [
          {
            slug: "barcelona-tapas-night", title: "Tapas & Vermouth Night", category: "nightlife", host: "pau-ferrer", featured: true,
            summary: "Hop between the old-school bodegas of El Born and the Gothic Quarter.",
            durationHours: 3, price: 65, maxGroupSize: 8, languages: "English, Spanish, Catalan",
            highlights: ["4 bars, 10 tapas", "Vermouth on tap", "Gothic Quarter by night"], included: ["Tapas", "3 drinks"],
            meetingPoint: "Santa Maria del Mar basilica",
            steps: [
              ["Vermouth hour", "El Born", "45 min", "Barcelona's favourite aperitif, straight from the barrel.", 41.3845, 2.182],
              ["Classic bodega", "Barri Gòtic", "1 h", "Patatas bravas and pan con tomate.", 41.383, 2.1765],
              ["Last tapa", "Plaça Reial", "45 min", "Crema catalana to finish.", 41.3801, 2.1754],
            ],
          },
          {
            slug: "gaudi-beyond-the-crowds", title: "Gaudí Beyond the Crowds", category: "culture", host: "pau-ferrer",
            summary: "Modernisme masterpieces and the stories of the man behind them.",
            durationHours: 3.5, price: 55, maxGroupSize: 8, languages: "English, Spanish",
            highlights: ["Sagrada Família exterior story", "Hidden modernist gems", "Passeig de Gràcia icons"], included: ["Guide"], notIncluded: ["Entry tickets"],
            meetingPoint: "Plaça de Gaudí",
            steps: [
              ["Sagrada Família", "Eixample", "1 h", "Read the façades like a book.", 41.4036, 2.1744, "NOT_INCLUDED"],
              ["Hidden gems", "Eixample", "1 h", "Buildings most visitors never notice.", 41.395, 2.162, "PASS_BY"],
              ["Casa Batlló", "Passeig de Gràcia", "45 min", "The dragon's back up close.", 41.3916, 2.1649, "NOT_INCLUDED"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "portugal", name: "Portugal", iso: "PT", lat: 39.5, lng: -8.0,
    description: "Tiles, trams and the Atlantic.",
    cities: [
      {
        slug: "lisbon", name: "Lisbon", lat: 38.7223, lng: -9.1393, hotspot: true,
        tagline: "Fado, pastéis & miradouros",
        description: "Seven hills, yellow trams and the soulful sound of fado.",
        hosts: [
          { slug: "ines-costa", name: "Inês Costa", tagline: "Fado singer", languages: "English, Portuguese, Spanish", verified: true, responseTimeHours: 4,
            bio: "I sing fado three nights a week in Alfama. Before the show, I love walking guests through my neighbourhood's steep, tiled streets." },
        ],
        experiences: [
          {
            slug: "alfama-fado-evening", title: "Alfama & Fado Evening", category: "culture", host: "ines-costa", featured: true,
            summary: "Sunset viewpoints, ginjinha and an intimate fado house.",
            durationHours: 3.5, price: 70, maxGroupSize: 8, languages: "English, Portuguese, Spanish",
            highlights: ["Live fado with a singer as your host", "Sunset at a miradouro", "Cherry liqueur in a chocolate cup"], included: ["Fado house entry", "Ginjinha", "Petiscos"],
            meetingPoint: "Miradouro de Santa Luzia",
            steps: [
              ["Miradouro", "Santa Luzia", "30 min", "Tiles, terracotta roofs and the river.", 38.7115, -9.13, "FREE"],
              ["Ginjinha", "Alfama", "20 min", "A sweet sour-cherry shot, the Lisbon way.", 38.712, -9.129],
              ["Fado house", "Alfama", "2 h", "Petiscos and the voice of the city.", 38.711, -9.128, "INCLUDED"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "morocco", name: "Morocco", iso: "MA", lat: 31.8, lng: -7.1,
    description: "Souks, spice and the edge of the Sahara.",
    cities: [
      {
        slug: "marrakech", name: "Marrakech", lat: 31.6295, lng: -7.9811, hotspot: true,
        tagline: "Souks, riads & spice",
        description: "The Red City — a sensory overload best navigated with a local.",
        hosts: [
          { slug: "youssef-amrani", name: "Youssef Amrani", tagline: "Medina navigator", languages: "English, French, Arabic", verified: true, responseTimeHours: 2,
            bio: "I was born inside the medina walls. I know which alley leads where, which merchant is honest, and where to find the best msemen." },
        ],
        experiences: [
          {
            slug: "marrakech-medina-and-souks", title: "Medina & Souks Without Getting Lost", category: "culture", host: "youssef-amrani", featured: true,
            summary: "Spice merchants, artisans' workshops and mint tea on a hidden rooftop.",
            durationHours: 3, price: 40, maxGroupSize: 8, languages: "English, French, Arabic",
            highlights: ["Artisans at work", "Spice tasting", "Rooftop mint tea over Jemaa el-Fnaa"], included: ["Tea", "Spice tasting"],
            meetingPoint: "Café de France, Jemaa el-Fnaa",
            steps: [
              ["Spice souk", "Rahba Kedima", "45 min", "Saffron, ras el hanout and the art of bargaining.", 31.631, -7.986, "FREE"],
              ["Artisans", "Souk Haddadine", "1 h", "Metalworkers, dyers and leather tanners.", 31.633, -7.987, "FREE"],
              ["Rooftop tea", "Medina", "45 min", "Mint tea as the call to prayer rings out.", 31.6258, -7.9891],
            ],
          },
          {
            slug: "moroccan-cooking-class", title: "Tagine Cooking Class in a Riad", category: "workshops", host: "youssef-amrani",
            summary: "Shop the market, then cook and eat a tagine feast with a local family.",
            durationHours: 4, price: 55, maxGroupSize: 8, languages: "English, French",
            highlights: ["Market shopping", "Cook in a family riad", "Recipes to take home"], included: ["Ingredients", "Lunch", "Recipes"],
            meetingPoint: "Bab Doukkala gate",
            steps: [
              ["Market", "Bab Doukkala", "45 min", "Pick vegetables, spices and fresh bread.", 31.635, -7.997],
              ["Cook", "Family riad", "2 h", "Chicken tagine with preserved lemon.", 31.632, -7.993, "INCLUDED"],
              ["Feast", "Riad courtyard", "1 h", "Eat together under the orange tree.", 31.6322, -7.9928],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "japan", name: "Japan", iso: "JP", lat: 36.2, lng: 138.25,
    description: "Neon cities, quiet temples and the world's best food.",
    cities: [
      {
        slug: "tokyo", name: "Tokyo", lat: 35.6762, lng: 139.6503, hotspot: true,
        tagline: "Izakayas, neon & hidden shrines",
        description: "A megacity made of tiny neighbourhoods, each with its own personality.",
        hosts: [
          { slug: "yuki-tanaka", name: "Yuki Tanaka", tagline: "Izakaya regular", languages: "English, Japanese", verified: true, responseTimeHours: 6,
            bio: "Salaryman by day, food explorer by night. I'll take you to the tiny bars under the train tracks that don't have English menus." },
        ],
        experiences: [
          {
            slug: "tokyo-izakaya-hopping", title: "Shinjuku Izakaya Hopping", category: "nightlife", host: "yuki-tanaka", featured: true,
            summary: "Yakitori, sake and the back alleys of Omoide Yokocho and Golden Gai.",
            durationHours: 3, price: 110, maxGroupSize: 6, languages: "English, Japanese",
            highlights: ["3 izakayas locals love", "Golden Gai's tiny bars", "Sake 101"], included: ["Food at each stop", "3 drinks"],
            meetingPoint: "Shinjuku station, east exit",
            steps: [
              ["Omoide Yokocho", "Shinjuku", "1 h", "Smoky yakitori under the tracks.", 35.693, 139.6996],
              ["Standing bar", "Kabukicho", "45 min", "Sake tasting with the master.", 35.695, 139.702],
              ["Golden Gai", "Shinjuku", "1 h", "Six-seat bars, each a world of its own.", 35.694, 139.7045],
            ],
          },
        ],
      },
      {
        slug: "kyoto", name: "Kyoto", lat: 35.0116, lng: 135.7681,
        tagline: "Temples, tea & geisha districts",
        description: "Japan's ancient capital, with over 1,600 temples.",
        hosts: [
          { slug: "aiko-mori", name: "Aiko Mori", tagline: "Tea ceremony teacher", languages: "English, Japanese", responseTimeHours: 12,
            bio: "I teach the way of tea in a 100-year-old machiya house. Slow down with me." },
        ],
        experiences: [
          {
            slug: "kyoto-tea-ceremony", title: "Tea Ceremony in a Machiya", category: "workshops", host: "aiko-mori",
            summary: "Whisk your own matcha in a century-old townhouse.",
            durationHours: 1.5, price: 60, maxGroupSize: 6, languages: "English, Japanese",
            highlights: ["Authentic tea room", "Make your own matcha", "Seasonal wagashi sweets"], included: ["Matcha", "Wagashi"],
            meetingPoint: "Gion Shijo station, exit 7",
            steps: [
              ["Welcome", "Machiya house", "15 min", "The meaning of the tea room.", 35.0037, 135.775],
              ["Ceremony", "Tea room", "1 h", "Watch, then whisk your own bowl.", 35.0039, 135.7754, "INCLUDED"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "united-states", name: "United States", iso: "US", lat: 39.8, lng: -98.6,
    description: "Big cities, bigger landscapes.",
    cities: [
      {
        slug: "new-york", name: "New York", lat: 40.7128, lng: -74.006, hotspot: true,
        tagline: "Bagels, jazz & borough secrets",
        description: "Five boroughs, eight million stories.",
        hosts: [
          { slug: "maya-johnson", name: "Maya Johnson", tagline: "Harlem jazz lover", languages: "English, Spanish", verified: true, responseTimeHours: 3,
            bio: "Harlem is my home and jazz is my religion. Come for the music, stay for the soul food." },
        ],
        experiences: [
          {
            slug: "harlem-jazz-and-soul-food", title: "Harlem Jazz & Soul Food", category: "nightlife", host: "maya-johnson",
            summary: "A soul-food dinner and a set at a legendary jazz club.",
            durationHours: 3.5, price: 120, maxGroupSize: 6, languages: "English, Spanish",
            highlights: ["Live jazz set", "Soul-food dinner", "Harlem Renaissance stories"], included: ["Dinner", "Club cover charge"], notIncluded: ["Drinks at the club"],
            meetingPoint: "Apollo Theater marquee",
            steps: [
              ["Harlem walk", "125th Street", "45 min", "The Apollo, the Renaissance and the people.", 40.8099, -73.95, "PASS_BY"],
              ["Soul food", "Lenox Ave", "1 h", "Fried chicken, collards and cornbread.", 40.811, -73.944],
              ["Jazz club", "Harlem", "1 h 30", "A live set in an intimate room.", 40.815, -73.945, "INCLUDED"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "mexico", name: "Mexico", iso: "MX", lat: 23.6, lng: -102.5,
    description: "Tacos, colour and ancient civilisations.",
    cities: [
      {
        slug: "mexico-city", name: "Mexico City", lat: 19.4326, lng: -99.1332,
        tagline: "Tacos, murals & mezcal",
        description: "One of the world's great food cities.",
        hosts: [
          { slug: "diego-hernandez", name: "Diego Hernández", tagline: "Taco obsessive", languages: "English, Spanish", responseTimeHours: 5,
            bio: "I've eaten tacos every day of my life and I'm not stopping. Let's find your new favourite stand." },
        ],
        experiences: [
          {
            slug: "cdmx-taco-crawl", title: "Taco Crawl in Roma & Condesa", category: "food-drink", host: "diego-hernandez",
            summary: "Al pastor, suadero and mezcal at the city's best street stands.",
            durationHours: 3, price: 50, maxGroupSize: 8, languages: "English, Spanish",
            highlights: ["6 taco stops", "Mezcal tasting", "Street-art murals"], included: ["All tacos", "Mezcal tasting"],
            meetingPoint: "Glorieta de Insurgentes",
            steps: [
              ["Al pastor", "Roma Norte", "30 min", "Spit-roasted pork with pineapple.", 19.417, -99.161],
              ["Mercado", "Mercado Medellín", "1 h", "Market stalls and fresh salsas.", 19.409, -99.163],
              ["Mezcal", "Condesa", "45 min", "Smoky agave spirits, sipped slowly.", 19.412, -99.173],
            ],
          },
        ],
      },
    ],
  },
];

/** Guest review snippets, reused across experiences. */
export const reviewPool: { rating: number; title: string; comment: string; name: string; country: string }[] = [
  { rating: 5, title: "Felt like visiting a friend", comment: "Our host was warm, funny and knew everyone. We saw a side of the city we would never have found alone.", name: "Sophie", country: "United Kingdom" },
  { rating: 5, title: "The highlight of our trip", comment: "Perfectly paced, delicious, and full of stories. Worth every penny — book it!", name: "Daniel", country: "Germany" },
  { rating: 4, title: "Great experience", comment: "Loved the food and the company. A little rushed at the end but we'd absolutely do it again.", name: "Aisha", country: "Canada" },
  { rating: 5, title: "Tailored to us", comment: "We mentioned we love history and our host adapted the whole route. Thoughtful and generous.", name: "Lucas", country: "Brazil" },
  { rating: 5, title: "Pure magic", comment: "I've done many tours — this was the first that felt personal rather than touristy.", name: "Emma", country: "Australia" },
  { rating: 4, title: "Highly recommend", comment: "Fantastic host with great local tips for the rest of our stay.", name: "Noah", country: "United States" },
];
