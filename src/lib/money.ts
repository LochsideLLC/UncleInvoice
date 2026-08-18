export function dollarsToCents(value: string | number): number {
  const n = typeof value === "number" ? value : Number.parseFloat(value.replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function lineTotal(quantity: number, unitPriceCents: number): number {
  return Math.round(quantity * unitPriceCents);
}

export type MoneyLine = {
  quantity: number;
  unitPrice: number;
  taxable?: boolean;
};

export function invoiceTotal(items: MoneyLine[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitPrice), 0);
}

export function taxableSubtotal(items: MoneyLine[]): number {
  return items
    .filter((item) => item.taxable)
    .reduce((sum, item) => sum + lineTotal(item.quantity, item.unitPrice), 0);
}

export function taxCents(subtotalCents: number, taxRateBps: number): number {
  if (!taxRateBps) return 0;
  return Math.round((subtotalCents * taxRateBps) / 10000);
}

export function invoiceGrandTotal(items: MoneyLine[], taxRateBps = 0): number {
  return invoiceTotal(items) + taxCents(taxableSubtotal(items), taxRateBps);
}

export type PaymentState = "unpaid" | "partial" | "paid";

export function paymentState(amountPaid: number, totalCents: number): PaymentState {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= totalCents && totalCents > 0) return "paid";
  return "partial";
}

export function amountDue(totalCents: number, amountPaid: number): number {
  return Math.max(0, totalCents - Math.max(0, amountPaid));
}

export function parseAmountPaid(formData: FormData, totalCents: number): number {
  const state = String(formData.get("paymentState") ?? "unpaid");
  if (state === "paid") return Math.max(0, totalCents);
  if (state !== "partial") return 0;
  const paid = dollarsToCents(String(formData.get("amountPaid") ?? "0"));
  if (paid <= 0) return 0;
  if (totalCents > 0 && paid >= totalCents) return totalCents;
  return paid;
}

export function bpsToPercent(bps: number): string {
  return (bps / 100).toString();
}

export function percentToBps(value: string | number): number {
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}
