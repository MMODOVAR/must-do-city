import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";


async function main() {
  // --- Admin account (from env, with dev defaults) ---
  const email = (process.env.ADMIN_EMAIL ?? "admin@mustdocity.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`Admin ready: ${email}`);

  // --- Sample content (only if the DB is empty) ---
  if ((await prisma.country.count()) > 0) return;

  await prisma.country.create({
    data: {
      name: "Lebanon",
      slug: "lebanon",
      isoCode: "LB",
      description: "Mountains, Mediterranean coast and some of the oldest cities on earth.",
      cities: {
        create: [
          {
            name: "Beirut",
            slug: "beirut",
            description: "A city of layers — Roman ruins, Ottoman houses and a restless nightlife.",
            journeys: {
              create: [
                {
                  title: "Beirut Food Walk",
                  slug: "beirut-food-walk",
                  summary: "Mezze, manousheh and knefeh through Mar Mikhael and Gemmayzeh.",
                  category: "Food & Drink",
                  durationHours: 3.5,
                  price: 45,
                  featured: true,
                  steps: {
                    create: [
                      { order: 1, title: "Breakfast manousheh", location: "Mar Mikhael", duration: "30 min",
                        description: "Za'atar and cheese flatbread straight from the oven." },
                      { order: 2, title: "Gemmayzeh stairs", location: "St. Nicholas Stairs", duration: "40 min",
                        description: "Walk the art stairs and stop for fresh juice." },
                      { order: 3, title: "Knefeh finale", location: "Downtown", duration: "30 min",
                        description: "Warm cheese pastry with orange-blossom syrup." },
                    ],
                  },
                },
                {
                  title: "Corniche Sunset",
                  slug: "corniche-sunset",
                  summary: "Stroll the seafront to Raouché's Pigeon Rocks at golden hour.",
                  category: "Nature",
                  durationHours: 2,
                  price: 0,
                  steps: {
                    create: [
                      { order: 1, title: "Ain el-Mreisseh", duration: "45 min", description: "Start where the fishermen gather." },
                      { order: 2, title: "Pigeon Rocks", location: "Raouché", duration: "45 min", description: "Watch the sun drop behind the arches." },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Byblos",
            slug: "byblos",
            description: "One of the oldest continuously inhabited cities in the world.",
            journeys: {
              create: [
                {
                  title: "Ancient Byblos",
                  slug: "ancient-byblos",
                  summary: "Crusader castle, Phoenician temples and the old souk.",
                  category: "History",
                  durationHours: 4,
                  price: 30,
                  featured: true,
                  steps: {
                    create: [
                      { order: 1, title: "Crusader Castle", duration: "1 h" },
                      { order: 2, title: "Old Souk", duration: "1 h" },
                      { order: 3, title: "Fish lunch at the port", duration: "1.5 h" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.country.create({
    data: {
      name: "France",
      slug: "france",
      isoCode: "FR",
      description: "Art, food and villages that look like paintings.",
      cities: {
        create: [
          {
            name: "Paris",
            slug: "paris",
            description: "The city of light, best explored on foot.",
            journeys: {
              create: [
                {
                  title: "Montmartre Morning",
                  slug: "montmartre-morning",
                  summary: "Croissants, painters and the view from Sacré-Cœur.",
                  category: "Culture",
                  durationHours: 3,
                  price: 25,
                  currency: "EUR",
                  steps: {
                    create: [
                      { order: 1, title: "Boulangerie stop", location: "Rue des Abbesses", duration: "20 min" },
                      { order: 2, title: "Place du Tertre", duration: "45 min" },
                      { order: 3, title: "Sacré-Cœur steps", duration: "45 min" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log("Sample countries, cities and journeys created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
