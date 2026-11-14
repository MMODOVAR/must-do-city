-- Local experiences: hosts, categories, experiences (formerly journeys),
-- reviews, bookings and map coordinates.
-- Hand-written so existing Journey / JourneyStep rows are carried over.

-- AlterTable
ALTER TABLE "Country" ADD COLUMN "latitude" REAL;
ALTER TABLE "Country" ADD COLUMN "longitude" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "isHotspot" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "countryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_City" ("countryId", "createdAt", "description", "id", "imageUrl", "name", "published", "slug", "updatedAt") SELECT "countryId", "createdAt", "description", "id", "imageUrl", "name", "published", "slug", "updatedAt" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
CREATE UNIQUE INDEX "City_countryId_slug_key" ON "City"("countryId", "slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "languages" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "responseTimeHours" INTEGER,
    "memberSince" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "cityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Host_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "durationHours" REAL,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "pricingType" TEXT NOT NULL DEFAULT 'PER_PERSON',
    "maxGroupSize" INTEGER,
    "languages" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "highlights" TEXT,
    "included" TEXT,
    "notIncluded" TEXT,
    "meetingPoint" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "cancellationPolicy" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "ratingAverage" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "cityId" TEXT NOT NULL,
    "hostId" TEXT,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Experience_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Experience_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Experience_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExperienceStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "duration" TEXT,
    "experienceId" TEXT NOT NULL,
    CONSTRAINT "ExperienceStep_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "date" DATETIME NOT NULL,
    "guests" INTEGER NOT NULL,
    "totalPrice" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "message" TEXT,
    "adminNote" TEXT,
    "experienceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorCountry" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "experienceId" TEXT NOT NULL,
    "bookingId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Migrate data: free-text journey categories become Category rows
INSERT INTO "Category" ("id", "name", "slug", "sortOrder")
SELECT 'cat' || lower(hex(randomblob(10))), MIN(trim("category")), lower(replace(replace(replace(trim("category"), ' & ', '-'), '&', '-'), ' ', '-')), 0
FROM "Journey"
WHERE "category" IS NOT NULL AND trim("category") <> ''
GROUP BY lower(replace(replace(replace(trim("category"), ' & ', '-'), '&', '-'), ' ', '-'));

-- Migrate data: journeys become experiences (slugs are now globally unique)
INSERT INTO "Experience" ("id", "title", "slug", "summary", "description", "durationHours", "price", "currency",
                          "imageUrl", "featured", "published", "cityId", "categoryId", "createdAt", "updatedAt")
SELECT j."id", j."title",
       CASE WHEN (SELECT COUNT(*) FROM "Journey" j2 WHERE j2."slug" = j."slug") > 1
            THEN j."slug" || '-' || (SELECT c."slug" FROM "City" c WHERE c."id" = j."cityId")
            ELSE j."slug" END,
       j."summary", j."description", j."durationHours", j."price", j."currency",
       j."imageUrl", j."featured", j."published", j."cityId",
       (SELECT cat."id" FROM "Category" cat WHERE cat."slug" = lower(replace(replace(replace(trim(j."category"), ' & ', '-'), '&', '-'), ' ', '-'))),
       j."createdAt", j."updatedAt"
FROM "Journey" j;

INSERT INTO "ExperienceStep" ("id", "order", "title", "description", "location", "duration", "experienceId")
SELECT "id", "order", "title", "description", "location", "duration", "journeyId" FROM "JourneyStep";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JourneyStep";
DROP INDEX "Journey_cityId_slug_key";
DROP TABLE "Journey";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "Host_slug_key" ON "Host"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
