-- AlterTable
ALTER TABLE "uncleinvoice"."User" ADD COLUMN "businessLogoKind" TEXT NOT NULL DEFAULT 'mark';
ALTER TABLE "uncleinvoice"."User" ADD COLUMN "businessWordmarkUrl" TEXT;
