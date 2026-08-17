export const INVOICE_STATUSES = [
  "draft",
  "awaiting_review",
  "confirmed",
  "sent",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  awaiting_review: "Waiting on contractor",
  confirmed: "Confirmed",
  sent: "Sent to client",
};

export const STATUS_TONE: Record<InvoiceStatus, string> = {
  draft: "bg-stone-100 text-stone-700",
  awaiting_review: "bg-amber-100 text-amber-900",
  confirmed: "bg-emerald-100 text-emerald-900",
  sent: "bg-sky-100 text-sky-900",
};

export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return INVOICE_STATUSES.includes(value as InvoiceStatus);
}
