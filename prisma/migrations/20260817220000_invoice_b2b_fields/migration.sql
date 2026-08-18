-- AlterTable
ALTER TABLE "uncleinvoice"."Workspace" ADD COLUMN "taxId" TEXT;

-- AlterTable
ALTER TABLE "uncleinvoice"."Contractor" ADD COLUMN "addressLine" TEXT;
ALTER TABLE "uncleinvoice"."Contractor" ADD COLUMN "city" TEXT;
ALTER TABLE "uncleinvoice"."Contractor" ADD COLUMN "region" TEXT;
ALTER TABLE "uncleinvoice"."Contractor" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "uncleinvoice"."Contractor" ADD COLUMN "taxId" TEXT;

-- AlterTable
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "dueDate" TIMESTAMP(3);
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "poNumber" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "paymentTerms" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "paymentInstructions" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "taxRateBps" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "fromTaxId" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "billToTaxId" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "fromAddressLine" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "fromCity" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "fromRegion" TEXT;
ALTER TABLE "uncleinvoice"."Invoice" ADD COLUMN "fromPostalCode" TEXT;
