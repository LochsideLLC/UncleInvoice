"use client";

import { useActionState } from "react";
import { updateInvoiceAction } from "@/actions/invoices";
import { FormBanner } from "@/components/form-banner";
import { LineItemsEditor, toLineDrafts } from "@/components/line-items-editor";

export function EditInvoiceForm({
  workspaceId,
  invoice,
}: {
  workspaceId: string;
  invoice: {
    id: string;
    issueDate: string;
    serviceStart: string;
    serviceEnd: string;
    notes: string;
    internalNote: string;
    lineItems: { description: string; quantity: number; unitPrice: number }[];
  };
}) {
  const [state, action, pending] = useActionState(updateInvoiceAction, null);

  return (
    <form action={action} className="paper space-y-4 rounded-3xl p-6">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="invoiceId" value={invoice.id} />
      <FormBanner state={state} />
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
        <label htmlFor="notes">Note on the invoice</label>
        <textarea id="notes" name="notes" rows={2} defaultValue={invoice.notes} />
      </div>
      <div className="field">
        <label htmlFor="internalNote">Internal note</label>
        <textarea
          id="internalNote"
          name="internalNote"
          rows={2}
          defaultValue={invoice.internalNote}
        />
      </div>
      <button className="btn btn-secondary" disabled={pending}>
        Save changes
      </button>
    </form>
  );
}
