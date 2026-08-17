"use client";

import { useActionState } from "react";
import { createInvoiceAction } from "@/actions/invoices";
import { FormBanner } from "@/components/form-banner";
import { LineItemsEditor } from "@/components/line-items-editor";

export function SeedInvoiceForm({
  workspaceId,
  contractors,
}: {
  workspaceId: string;
  contractors: { id: string; name: string; email: string | null }[];
}) {
  const [state, action, pending] = useActionState(createInvoiceAction, null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="paper space-y-5 rounded-3xl p-6">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <FormBanner state={state} />
      <div className="field">
        <label htmlFor="contractorId">Contractor</label>
        <select id="contractorId" name="contractorId" required defaultValue="">
          <option value="" disabled>
            Choose who this invoice is from
          </option>
          {contractors.map((contractor) => (
            <option key={contractor.id} value={contractor.id}>
              {contractor.name}
              {contractor.email ? ` · ${contractor.email}` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="field">
          <label htmlFor="issueDate">Invoice date</label>
          <input id="issueDate" name="issueDate" type="date" required defaultValue={today} />
        </div>
        <div className="field">
          <label htmlFor="serviceStart">Work from</label>
          <input id="serviceStart" name="serviceStart" type="date" />
        </div>
        <div className="field">
          <label htmlFor="serviceEnd">Work through</label>
          <input id="serviceEnd" name="serviceEnd" type="date" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-muted">Line items</p>
        <LineItemsEditor />
      </div>
      <div className="field">
        <label htmlFor="notes">Note on the invoice</label>
        <textarea id="notes" name="notes" rows={2} />
      </div>
      <div className="field">
        <label htmlFor="internalNote">Internal note (only you see this)</label>
        <textarea id="internalNote" name="internalNote" rows={2} placeholder="Check #4418, paid 3/28" />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="sendNow" className="mt-1" />
        <span>Email the contractor a review link right after saving.</span>
      </label>
      <button className="btn btn-primary" disabled={pending}>
        Save draft
      </button>
    </form>
  );
}
