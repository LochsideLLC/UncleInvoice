-- AlterTable
ALTER TABLE "uncleinvoice"."InvoiceLineItem" ADD COLUMN "taxable" BOOLEAN NOT NULL DEFAULT false;

-- Existing invoices taxed the whole bill. Keep those totals the same.
UPDATE "uncleinvoice"."InvoiceLineItem" SET "taxable" = true;
