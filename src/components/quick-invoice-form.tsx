"use client";

import { useActionState, useMemo, useState } from "react";
import { createPublicInvoiceAction } from "@/actions/public-invoice";
import { FormBanner } from "@/components/form-banner";
import { PAYMENT_TERMS } from "@/lib/invoice-fields";
import {
  amountDue,
  dollarsToCents,
  formatMoney,
  invoiceTotal,
  lineTotal,
  paymentState as paymentStateOf,
  percentToBps,
  taxableSubtotal,
  taxCents,
} from "@/lib/money";

type LineDraft = {
  description: string;
  quantity: string;
  price: string;
  taxable: boolean;
};

function payByIsBeforeInvoice(issue: string, due: string): boolean {
  return Boolean(issue && due && due < issue);
}

function dueFromTerms(issueDate: string, terms: string): string {
  if (!issueDate) return "";
  if (terms === "Due on receipt") return issueDate;
  const match = /^Net (\d+)$/.exec(terms);
  if (!match) return "";
  const date = new Date(`${issueDate}T12:00:00`);
  date.setDate(date.getDate() + Number(match[1]));
  return date.toISOString().slice(0, 10);
}

export function QuickInvoiceForm({
  defaultFromName = "",
  defaultFromEmail = "",
}: {
  defaultFromName?: string;
  defaultFromEmail?: string;
}) {
  const [state, action, pending] = useActionState(createPublicInvoiceAction, null);
  const today = new Date().toISOString().slice(0, 10);
  const [fromName, setFromName] = useState("");
  const [fromContactName, setFromContactName] = useState(defaultFromName);
  const [fromEmail, setFromEmail] = useState(defaultFromEmail);
  const [fromPhone, setFromPhone] = useState("");
  const [fromAddressLine, setFromAddressLine] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromRegion, setFromRegion] = useState("");
  const [fromPostalCode, setFromPostalCode] = useState("");
  const [billToName, setBillToName] = useState("");
  const [billToContactName, setBillToContactName] = useState("");
  const [billToEmail, setBillToEmail] = useState("");
  const [billToPhone, setBillToPhone] = useState("");
  const [billToAddressLine, setBillToAddressLine] = useState("");
  const [billToCity, setBillToCity] = useState("");
  const [billToRegion, setBillToRegion] = useState("");
  const [billToPostalCode, setBillToPostalCode] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [paymentState, setPaymentState] = useState<"unpaid" | "partial" | "paid">("unpaid");
  const [amountPaidInput, setAmountPaidInput] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([
    { description: "", quantity: "1", price: "", taxable: false },
  ]);
  const [dateWarn, setDateWarn] = useState(false);

  const pricedLines = useMemo(
    () =>
      lines.map((row) => ({
        ...row,
        quantity: Number.parseFloat(row.quantity) || 0,
        unitPrice: dollarsToCents(row.price),
      })),
    [lines],
  );
  const subtotal = invoiceTotal(pricedLines);
  const tax = taxCents(taxableSubtotal(pricedLines), percentToBps(taxRate));
  const total = subtotal + tax;
  const paidCents =
    paymentState === "paid"
      ? total
      : paymentState === "partial"
        ? dollarsToCents(amountPaidInput)
        : 0;
  const dueCents = amountDue(total, paidCents);
  const paidLabel = paymentStateOf(paidCents, total);

  function applyTerms(nextTerms: string, nextIssue = issueDate) {
    setPaymentTerms(nextTerms);
    const computed = dueFromTerms(nextIssue, nextTerms);
    if (computed) setDueDate(computed);
  }

  function updateLine(index: number, patch: Partial<LineDraft>) {
    setLines((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <form action={action} className="space-y-6">
      <FormBanner state={state} />
      <article className="invoice-sheet paper rounded-[1.4rem] p-6 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="invoice-fields">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Bill to</p>
            <input
              id="billToName"
              name="billToName"
              required
              aria-label="Client company"
              className="invoice-input"
              value={billToName}
              onChange={(event) => setBillToName(event.target.value)}
              placeholder="Company"
            />
            <input
              id="billToContactName"
              name="billToContactName"
              aria-label="Attn"
              className="invoice-input"
              value={billToContactName}
              onChange={(event) => setBillToContactName(event.target.value)}
              placeholder="Attn (optional)"
            />
            <input
              id="billToAddressLine"
              name="billToAddressLine"
              aria-label="Client street address"
              className="invoice-input"
              value={billToAddressLine}
              onChange={(event) => setBillToAddressLine(event.target.value)}
              placeholder="Street address"
            />
            <div className="grid grid-cols-[minmax(0,1fr)_5.75rem_6.5rem] gap-3">
              <input
                id="billToCity"
                name="billToCity"
                aria-label="Client city"
                className="invoice-input"
                value={billToCity}
                onChange={(event) => setBillToCity(event.target.value)}
                placeholder="City"
              />
              <input
                id="billToRegion"
                name="billToRegion"
                aria-label="Client state"
                className="invoice-input"
                value={billToRegion}
                onChange={(event) => setBillToRegion(event.target.value)}
                placeholder="State"
              />
              <input
                id="billToPostalCode"
                name="billToPostalCode"
                aria-label="Client ZIP"
                className="invoice-input"
                value={billToPostalCode}
                onChange={(event) => setBillToPostalCode(event.target.value)}
                placeholder="ZIP"
              />
            </div>
            <input
              id="billToEmail"
              name="billToEmail"
              type="email"
              required
              aria-label="Client email"
              className="invoice-input"
              value={billToEmail}
              onChange={(event) => setBillToEmail(event.target.value)}
              placeholder="ap@client.com"
            />
            <input
              id="billToPhone"
              name="billToPhone"
              aria-label="Client phone"
              className="invoice-input"
              value={billToPhone}
              onChange={(event) => setBillToPhone(event.target.value)}
              placeholder="Phone"
            />
          </div>

          <div className="invoice-fields">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">From</p>
            <input
              id="fromContactName"
              name="fromContactName"
              aria-label="Your name"
              className="invoice-input"
              value={fromContactName}
              onChange={(event) => setFromContactName(event.target.value)}
              placeholder="Your name"
            />
            <input
              id="fromName"
              name="fromName"
              aria-label="Your company"
              className="invoice-input"
              value={fromName}
              onChange={(event) => setFromName(event.target.value)}
              placeholder="Company"
            />
            <input
              id="fromAddressLine"
              name="fromAddressLine"
              aria-label="Your street address"
              className="invoice-input"
              value={fromAddressLine}
              onChange={(event) => setFromAddressLine(event.target.value)}
              placeholder="Street address"
            />
            <div className="grid grid-cols-[minmax(0,1fr)_5.75rem_6.5rem] gap-3">
              <input
                id="fromCity"
                name="fromCity"
                aria-label="City"
                className="invoice-input"
                value={fromCity}
                onChange={(event) => setFromCity(event.target.value)}
                placeholder="City"
              />
              <input
                id="fromRegion"
                name="fromRegion"
                aria-label="State"
                className="invoice-input"
                value={fromRegion}
                onChange={(event) => setFromRegion(event.target.value)}
                placeholder="State"
              />
              <input
                id="fromPostalCode"
                name="fromPostalCode"
                aria-label="ZIP"
                className="invoice-input"
                value={fromPostalCode}
                onChange={(event) => setFromPostalCode(event.target.value)}
                placeholder="ZIP"
              />
            </div>
            <input
              id="fromEmail"
              name="fromEmail"
              type="email"
              aria-label="Your email"
              className="invoice-input"
              value={fromEmail}
              onChange={(event) => setFromEmail(event.target.value)}
              placeholder="you@company.com"
            />
            <input
              id="fromPhone"
              name="fromPhone"
              aria-label="Your phone"
              className="invoice-input"
              value={fromPhone}
              onChange={(event) => setFromPhone(event.target.value)}
              placeholder="Phone"
            />
          </div>
        </div>

        <div className="invoice-meta mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-muted">
            Invoice number
            <input
              id="invoiceNumber"
              name="invoiceNumber"
              aria-label="Invoice number"
              className="invoice-input mt-1"
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
              placeholder="INV-0001"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-muted">
            Invoice date
            <input
              id="issueDate"
              name="issueDate"
              type="date"
              required
              aria-label="Invoice date"
              className="invoice-input mt-1"
              value={issueDate}
              onChange={(event) => {
                const next = event.target.value;
                setIssueDate(next);
                const computed = dueFromTerms(next, paymentTerms);
                if (computed) {
                  setDueDate(computed);
                  return;
                }
                if (payByIsBeforeInvoice(next, dueDate)) setDateWarn(true);
              }}
            />
          </label>
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-muted">
            Terms
            <select
              id="paymentTerms"
              name="paymentTerms"
              aria-label="Payment terms"
              className="invoice-input mt-1"
              value={paymentTerms}
              onChange={(event) => applyTerms(event.target.value)}
            >
              <option value="">—</option>
              {PAYMENT_TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </label>
          <div className="relative">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-muted">
              Pay by
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                aria-label="Pay by"
                className="invoice-input mt-1"
                value={dueDate}
                onChange={(event) => {
                  const next = event.target.value;
                  setDueDate(next);
                  if (payByIsBeforeInvoice(issueDate, next)) setDateWarn(true);
                }}
              />
            </label>
            {dateWarn ? (
              <div
                className="paper absolute left-0 top-full z-20 mt-2 w-56 rounded-xl p-3 shadow-lg"
                role="alertdialog"
                aria-labelledby="date-warn-title"
              >
                <p id="date-warn-title" className="text-sm text-ink">
                  Pay by is before the invoice date.
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-3 w-full"
                  onClick={() => setDateWarn(false)}
                >
                  OK
                </button>
              </div>
            ) : null}
          </div>
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-muted">
            PO
            <input
              id="poNumber"
              name="poNumber"
              aria-label="PO number"
              className="invoice-input mt-1"
              value={poNumber}
              onChange={(event) => setPoNumber(event.target.value)}
              placeholder="optional"
            />
          </label>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="w-full py-2 pr-4 font-medium">Description</th>
                <th className="w-32 min-w-32 py-2 px-3 text-right font-medium">Qty</th>
                <th className="w-40 min-w-40 py-2 px-3 text-right font-medium">Rate</th>
                <th className="w-16 py-2 px-4 text-center font-medium">Tax</th>
                <th className="w-28 py-2 pl-4 text-right font-medium">Amount</th>
                <th className="w-8 py-2">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((row, index) => (
                <tr key={index} className="border-b border-line/70">
                  <td className="w-full py-3 pr-4 align-top">
                    <textarea
                      name="item_description"
                      rows={1}
                      aria-label={`Line ${index + 1} description`}
                      className="invoice-input invoice-input-line w-full"
                      value={row.description}
                      onChange={(event) => {
                        updateLine(index, { description: event.target.value });
                        event.target.style.height = "auto";
                        event.target.style.height = `${event.target.scrollHeight}px`;
                      }}
                      ref={(node) => {
                        if (!node) return;
                        node.style.height = "auto";
                        node.style.height = `${node.scrollHeight}px`;
                      }}
                      placeholder="What this line is for"
                    />
                  </td>
                  <td className="w-32 min-w-32 px-3 py-3 align-top">
                    <input
                      name="item_quantity"
                      aria-label={`Line ${index + 1} quantity`}
                      inputMode="decimal"
                      className="invoice-input h-10 w-full text-right tabular-nums"
                      value={row.quantity}
                      onChange={(event) => updateLine(index, { quantity: event.target.value })}
                    />
                  </td>
                  <td className="w-40 min-w-40 px-3 py-3 align-top">
                    <input
                      name="item_price"
                      aria-label={`Line ${index + 1} rate`}
                      inputMode="decimal"
                      className="invoice-input h-10 w-full text-right tabular-nums"
                      value={row.price}
                      onChange={(event) => updateLine(index, { price: event.target.value })}
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex h-10 items-center justify-center">
                      <input
                        type="checkbox"
                        name="item_taxable"
                        value={String(index)}
                        checked={row.taxable}
                        onChange={(event) => updateLine(index, { taxable: event.target.checked })}
                        aria-label={`Charge tax on line ${index + 1}`}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                    </div>
                  </td>
                  <td className="py-3 pl-4 align-top">
                    <div className="flex h-10 items-center justify-end tabular-nums">
                      {formatMoney(lineTotal(pricedLines[index].quantity, pricedLines[index].unitPrice))}
                    </div>
                  </td>
                  <td className="py-3 pl-2 align-top">
                    <div className="flex h-10 items-center justify-center">
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line text-base leading-none text-muted hover:border-ink hover:text-ink"
                        onClick={() =>
                          setLines((current) =>
                            current.length === 1
                              ? [{ description: "", quantity: "1", price: "", taxable: false }]
                              : current.filter((_, i) => i !== index),
                          )
                        }
                        aria-label={`Remove line ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="mt-2 text-sm text-accent underline-offset-2 hover:underline"
            onClick={() =>
              setLines((current) => [
                ...current,
                { description: "", quantity: "1", price: "", taxable: false },
              ])
            }
          >
            Add a line
          </button>
        </div>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-1 text-sm">
          {paidLabel === "paid" ? (
            <p className="mb-3 inline-block border-[3px] border-olive px-3 py-1 text-sm font-semibold uppercase tracking-[0.16em] text-olive">
              Paid
            </p>
          ) : paidLabel === "partial" ? (
            <p className="mb-3 inline-block border-[3px] border-brass px-3 py-1 text-sm font-semibold uppercase tracking-[0.16em] text-ink">
              Partially paid
            </p>
          ) : null}
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoney(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-muted">
            <label className="inline-flex items-center gap-1">
              <span>Tax</span>
              <input
                id="taxRate"
                name="taxRate"
                inputMode="decimal"
                aria-label="Tax percent"
                className="invoice-input w-14 text-right tabular-nums"
                value={taxRate}
                onChange={(event) => setTaxRate(event.target.value)}
                placeholder="0"
              />
              <span>%</span>
            </label>
            <span className="tabular-nums">{formatMoney(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-xl">
            <span className="display">Total</span>
            <span className="display tabular-nums">{formatMoney(total)}</span>
          </div>
          <div className="field pt-3">
            <label htmlFor="paymentState">Payment Status</label>
            <select
              id="paymentState"
              name="paymentState"
              className="invoice-input"
              value={paymentState}
              onChange={(event) =>
                setPaymentState(event.target.value as "unpaid" | "partial" | "paid")
              }
            >
              <option value="unpaid">Not paid</option>
              <option value="partial">Partially paid</option>
              <option value="paid">Paid in full</option>
            </select>
          </div>
          {paymentState === "partial" ? (
            <div className="field">
              <label htmlFor="amountPaid">How much was paid</label>
              <input
                id="amountPaid"
                name="amountPaid"
                inputMode="decimal"
                className="invoice-input text-right tabular-nums"
                value={amountPaidInput}
                onChange={(event) => setAmountPaidInput(event.target.value)}
                placeholder="0.00"
              />
            </div>
          ) : null}
          {paidLabel !== "unpaid" ? (
            <div className="flex justify-between text-muted">
              <span>Paid</span>
              <span className="tabular-nums">{formatMoney(Math.min(paidCents, total))}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-muted">
            <span>Still due</span>
            <span className="tabular-nums">{formatMoney(dueCents)}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">How to pay</p>
            <textarea
              id="paymentInstructions"
              name="paymentInstructions"
              rows={3}
              aria-label="How to pay"
              className="invoice-input mt-1 w-full"
              value={paymentInstructions}
              onChange={(event) => setPaymentInstructions(event.target.value)}
              placeholder="ACH, check, or where to send payment"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Notes</p>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              aria-label="Notes"
              className="invoice-input mt-1 w-full"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Anything else that should print on the invoice"
            />
          </div>
        </div>
      </article>

      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Saving…" : "Looks good — create it"}
      </button>
    </form>
  );
}
