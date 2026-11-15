/**
 * Page details per experience: meeting-point location, timing, end point and
 * gallery photos. Photos are Unsplash links (hotlinking is how Unsplash asks
 * to be used); any that fail to load fall back to a gradient on the site.
 */

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const FOOD = [u("1504674900247-0877df9cc836"), u("1414235077428-338989a2e8c0"), u("1555396273-367ea4eb4db5"), u("1467003909585-2f8a72700288")];

export const ADDITIONAL_INFO = [
  "Confirmation within 24 hours of booking, subject to host availability",
  "Public transportation options are available nearby",
  "Most travellers can participate",
  "This is a private tour — only your group will participate",
  "Comfortable walking shoes recommended",
];

type Details = { meeting: [number, number]; startTime: string; endPoint?: string; photos?: { url: string; caption?: string }[] };

export const details: Record<string, Details> = {
  "beirut-food-walk": { meeting: [33.8985, 35.5245], startTime: "10:00", endPoint: "Downtown Beirut, near Martyrs' Square",
    photos: [{ url: FOOD[0], caption: "Mezze to share" }, { url: FOOD[1], caption: "Family-run kitchens" }, { url: FOOD[3], caption: "Fresh from the oven" }] },
  "corniche-sunset": { meeting: [33.9005, 35.493], startTime: "17:30", endPoint: "Raouché, by Pigeon Rocks" },
  "beirut-rooftops-by-night": { meeting: [33.8957, 35.5165], startTime: "19:00", endPoint: "Mar Mikhael" },
  "ancient-byblos": { meeting: [34.1196, 35.6462], startTime: "10:00", endPoint: "Byblos Old Port" },
  "montmartre-morning": { meeting: [48.8844, 2.3384], startTime: "09:00", endPoint: "Sacré-Cœur Basilica",
    photos: [{ url: u("1502602898657-3e91760cbb34"), caption: "Paris from above" }, { url: u("1499856871958-5b9627545d1a"), caption: "Morning light over the city" }, { url: FOOD[2], caption: "Café stop" }] },
  "marais-cheese-and-wine": { meeting: [48.8556, 2.3655], startTime: "17:00",
    photos: [{ url: u("1499856871958-5b9627545d1a"), caption: "Paris" }, { url: FOOD[1], caption: "Pairing like a Parisian" }] },
  "lyon-traboules-and-bouchons": { meeting: [45.7606, 4.827], startTime: "11:00", endPoint: "Presqu'île, Place des Jacobins" },
  "trastevere-food-tour": { meeting: [41.8894, 12.4703], startTime: "18:00", endPoint: "Piazza Trilussa",
    photos: [{ url: u("1552832230-c0197dd311b5"), caption: "Rome at dusk" }, { url: u("1565299624946-b28f40a0ae38"), caption: "Roman-style pizza" }, { url: FOOD[0], caption: "Trattoria classics" }, { url: FOOD[2], caption: "Where the locals eat" }] },
  "rome-ancient-secrets": { meeting: [41.8912, 12.492], startTime: "09:00", endPoint: "Largo di Torre Argentina",
    photos: [{ url: u("1552832230-c0197dd311b5"), caption: "The Colosseum" }] },
  "florence-leather-workshop": { meeting: [43.767, 11.248], startTime: "10:00" },
  "barcelona-tapas-night": { meeting: [41.3838, 2.182], startTime: "19:30", endPoint: "Plaça Reial", photos: [{ url: FOOD[3], caption: "Tapas" }, { url: FOOD[2] }] },
  "gaudi-beyond-the-crowds": { meeting: [41.404, 2.175], startTime: "09:30", endPoint: "Casa Batlló, Passeig de Gràcia" },
  "alfama-fado-evening": { meeting: [38.7118, -9.1303], startTime: "18:30" },
  "marrakech-medina-and-souks": { meeting: [31.6262, -7.989], startTime: "10:00", endPoint: "Rooftop café overlooking Jemaa el-Fnaa" },
  "moroccan-cooking-class": { meeting: [31.6352, -7.9975], startTime: "09:30", photos: [{ url: FOOD[0], caption: "Our tagine feast" }] },
  "tokyo-izakaya-hopping": { meeting: [35.6912, 139.7006], startTime: "18:30", endPoint: "Golden Gai, Shinjuku",
    photos: [{ url: u("1540959733332-eab4deabeeaf"), caption: "Shinjuku after dark" }, { url: FOOD[1], caption: "Yakitori & sake" }] },
  "kyoto-tea-ceremony": { meeting: [35.0037, 135.7726], startTime: "14:00", photos: [{ url: u("1493976040374-85c8e12f0c0e"), caption: "Kyoto" }] },
  "harlem-jazz-and-soul-food": { meeting: [40.81, -73.95], startTime: "18:00", endPoint: "Jazz club, Harlem",
    photos: [{ url: u("1496442226666-8d4d0e62e6e9"), caption: "New York" }, { url: FOOD[0], caption: "Soul food dinner" }] },
  "cdmx-taco-crawl": { meeting: [19.4232, -99.1628], startTime: "13:00", endPoint: "Condesa" },
};

/** Cover images for cities (used on the map popups' destination cards and city pages). */
export const cityImages: Record<string, string> = {
  paris: u("1502602898657-3e91760cbb34"),
  rome: u("1552832230-c0197dd311b5"),
  tokyo: u("1540959733332-eab4deabeeaf"),
  "new-york": u("1496442226666-8d4d0e62e6e9"),
  kyoto: u("1493976040374-85c8e12f0c0e"),
};
