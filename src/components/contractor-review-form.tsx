"use client";

import { useActionState } from "react";
import { contractorConfirmAction, contractorUpdateInvoiceAction } from "@/actions/invoices";
import { FormBanner } from "@/components/form-banner";
import { LineItemsEditor, toLineDrafts } from "@/components/line-items-editor";

export function ContractorReviewForm({
  token,
  workspaceName,
  invoice,
}: {
  token: string;
  workspaceName: string;
  invoice: {
    issueDate: string;
    serviceStart: string;
    serviceEnd: string;
    notes: string;
    lineItems: { description: string; quantity: number; unitPrice: number }[];
  };
}) {
  const [saveState, saveAction, savePending] = useActionState(
    contractorUpdateInvoiceAction,
    null,
  );
  const [confirmState, confirmAction, confirmPending] = useActionState(
    contractorConfirmAction,
    null,
  );

  return (
    <div className="paper mt-6 space-y-5 rounded-3xl p-6">
      <FormBanner state={saveState ?? confirmState} />
      <form id="review-form" className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="field">
            <label htmlFor="issueDate">Invoice date</label>
            <input
              id="issueDate"
              name="issueDate"
              type="date"
              required
              defaultValue={invoice.issueDate}
            />
          </div>
          <div className="field">
            <label htmlFor="serviceStart">Work from</label>
            <input
              id="serviceStart"
              name="serviceStart"
              type="date"
              defaultValue={invoice.serviceStart}
            />
          </div>
          <div className="field">
            <label htmlFor="serviceEnd">Work through</label>
            <input
              id="serviceEnd"
              name="serviceEnd"
              type="date"
              defaultValue={invoice.serviceEnd}
            />
          </div>
        </div>
        <LineItemsEditor initial={toLineDrafts(invoice.lineItems)} />
        <div className="field">
          <label htmlFor="notes">Note to {workspaceName}</label>
          <textarea id="notes" name="notes" rows={2} defaultValue={invoice.notes} />
        </div>
        <label className="flex items-start gap-3 text-sm leading-snug">
          <input type="checkbox" name="attest" className="mt-1 h-5 w-5" />
          <span>
            I confirm this invoice is accurate, and I am the person (or authorized
            representative) who did this work.
          </span>
        </label>
      </form>
      <div className="flex flex-col gap-2">
        <button
          className="btn btn-primary"
          form="review-form"
          formAction={confirmAction}
          disabled={confirmPending}
        >
          Confirm and send to {workspaceName}
        </button>
        <button
          className="btn btn-ghost"
          form="review-form"
          formAction={saveAction}
          disabled={savePending}
        >
          Save my edits first
        </button>
      </div>
    </div>
  );
}
