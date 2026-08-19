"use client";

import { useState } from "react";

function IconEmail() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 5.5l7 4.5 7-4.5" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6.5 9.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1" />
      <path d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1" />
    </svg>
  );
}
import { markAsPaidAction, sendToClientAction } from "@/actions/invoices";

const infoPill =
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap select-none";

export function InvoiceStatusBar({
  workspaceId,
  invoiceId,
  status,
  sentAt,
  dueDate,
  totalCents,
  amountPaid,
  clientEmail,
}: {
  workspaceId: string;
  invoiceId: string;
  status: string;
  sentAt: Date | null;
  dueDate: Date | null;
  totalCents: number;
  amountPaid: number;
  clientEmail: string;
}) {
  const [showPayForm, setShowPayForm] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = `${window.location.origin}/invoices/view/${invoiceId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isSent = status === "sent";
  const isPaid = totalCents > 0 && amountPaid >= totalCents;
  const remainingCents = Math.max(0, totalCents - amountPaid);
  const remainingDollars = (remainingCents / 100).toFixed(2);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = dueDate ? new Date(dueDate) : null;
  if (due) due.setHours(0, 0, 0, 0);
  const daysUntilDue = due ? Math.round((due.getTime() - today.getTime()) / 86_400_000) : null;

  const todayIso = new Date().toISOString().slice(0, 10);

  function sentLabel() {
    if (!isSent) return "Not sent";
    if (!sentAt) return "Sent";
    return `Sent ${new Date(sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }

  function dueLabel() {
    if (daysUntilDue === null) return null;
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? "" : "s"}`;
    if (daysUntilDue === 0) return "Due today";
    return `${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"} until due`;
  }

  function dueStyle(): React.CSSProperties {
    if (daysUntilDue === null) return {};
    if (daysUntilDue < 0) return { background: "#fde8e8", border: "1.5px solid #c0392b", color: "#9a1f1f" };
    if (daysUntilDue <= 7) return { background: "#f3dcc0", border: "1.5px solid #c4612a", color: "#7a3a22" };
    return { background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--muted)" };
  }

  const dueLabelText = dueLabel();
  const showActions = !isPaid;

  return (
    <>
      <div className="flex items-center justify-between gap-3 print:hidden">

        {/* Info pills — pure indicators, no interactivity */}
        <div className="flex items-center gap-2">
          <span
            className={infoPill}
            style={
              isSent
                ? { background: "color-mix(in srgb, #5a8a6a 14%, var(--paper))", border: "1.5px solid #5a8a6a", color: "#3d6b52" }
                : { background: "color-mix(in srgb, #c4612a 10%, var(--paper))", border: "1.5px solid #c4612a", color: "#c4612a" }
            }
          >
            {sentLabel()}
          </span>

          {dueLabelText && !isPaid && (
            <span className={infoPill} style={dueStyle()}>
              {dueLabelText}
            </span>
          )}

          {isPaid && (
            <span
              className={infoPill}
              style={{ background: "color-mix(in srgb, var(--olive) 18%, var(--paper))", border: "1.5px solid var(--olive)", color: "var(--olive)" }}
            >
              Paid
            </span>
          )}
        </div>

        {/* Action buttons — rectangular, same shape as Print / Download */}
        {showActions && (
          <div className="flex items-center gap-2">
            {!isSent ? (
              <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem 0.85rem", fontSize: "0.875rem" }} onClick={() => setShowSendForm(true)}>
                <IconEmail /> Send
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem 0.85rem", fontSize: "0.875rem" }} onClick={() => { /* TODO: send reminder */ }}>
                <IconEmail /> Send reminder
              </button>
            )}
            <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem 0.85rem", fontSize: "0.875rem" }} onClick={copyLink}>
              <IconLink /> {copied ? "Copied!" : "Share link"}
            </button>
            <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem 0.85rem", fontSize: "0.875rem" }} onClick={() => setShowPayForm(true)}>
              Mark as paid
            </button>
          </div>
        )}
      </div>

      {showSendForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(42,31,22,0.35)" }}
          onPointerDown={(e) => { if (e.target === e.currentTarget) setShowSendForm(false); }}
        >
          <div className="paper w-full max-w-sm rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl">Send invoice</h3>
            <p className="mt-2 text-sm text-muted">
              This will email the invoice to your client and mark it as sent.
            </p>
            {clientEmail ? (
              <p className="mt-3 rounded-xl bg-paper-2 px-3 py-2 text-sm font-medium">{clientEmail}</p>
            ) : (
              <p className="mt-3 text-sm" style={{ color: "#c4612a" }}>
                No client email on file. Add one in the client settings before sending.
              </p>
            )}
            <form action={sendToClientAction} className="mt-5 flex gap-3">
              <input type="hidden" name="workspaceId" value={workspaceId} />
              <input type="hidden" name="invoiceId" value={invoiceId} />
              <button type="submit" className="btn btn-primary" disabled={!clientEmail}>Send now</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowSendForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showPayForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(42,31,22,0.35)" }}
          onPointerDown={(e) => { if (e.target === e.currentTarget) setShowPayForm(false); }}
        >
          <div className="paper w-full max-w-sm rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl">Record payment</h3>
            <p className="mt-1 text-sm text-muted">Fill in what you know. Even partial info helps.</p>
            <form action={markAsPaidAction} className="mt-5 space-y-4">
              <input type="hidden" name="workspaceId" value={workspaceId} />
              <input type="hidden" name="invoiceId" value={invoiceId} />
              <div className="field">
                <label htmlFor="pay-amount">Amount paid</label>
                <input type="number" id="pay-amount" name="amount" step="0.01" min="0.01" defaultValue={remainingDollars} required />
              </div>
              <div className="field">
                <label htmlFor="pay-date">Date paid</label>
                <input type="date" id="pay-date" name="paidDate" defaultValue={todayIso} />
              </div>
              <div className="field">
                <label htmlFor="pay-method">How they paid</label>
                <select id="pay-method" name="method">
                  <option value="">— select —</option>
                  <option>Check</option>
                  <option>ACH / Bank transfer</option>
                  <option>Wire transfer</option>
                  <option>Credit card</option>
                  <option>Cash</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="pay-note">Note (optional)</label>
                <input type="text" id="pay-note" name="note" placeholder="e.g. Check #1234" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="btn btn-primary">Save payment</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowPayForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
