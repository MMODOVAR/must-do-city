-- AlterTable
ALTER TABLE "Experience" ADD COLUMN "additionalInfo" TEXT;
ALTER TABLE "Experience" ADD COLUMN "endPoint" TEXT;
ALTER TABLE "Experience" ADD COLUMN "startTime" TEXT;

-- AlterTable
ALTER TABLE "ExperienceStep" ADD COLUMN "admission" TEXT;
ALTER TABLE "ExperienceStep" ADD COLUMN "latitude" REAL;
ALTER TABLE "ExperienceStep" ADD COLUMN "longitude" REAL;

-- CreateTable
CREATE TABLE "ExperiencePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL,
    "experienceId" TEXT NOT NULL,
    CONSTRAINT "ExperiencePhoto_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ExperiencePhoto_experienceId_order_idx" ON "ExperiencePhoto"("experienceId", "order");

