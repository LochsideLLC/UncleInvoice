"use client";

import { useState } from "react";
import { copyReviewLinkAction } from "@/actions/invoices";

export function CopyLinkButton({
  workspaceId,
  invoiceId,
}: {
  workspaceId: string;
  invoiceId: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    setMessage(null);
    const result = await copyReviewLinkAction(workspaceId, invoiceId);
    setPending(false);
    if (result.error || !result.link) {
      setMessage(result.error ?? "Could not create a link.");
      return;
    }
    try {
      await navigator.clipboard.writeText(result.link);
      setMessage("Link copied. Text or email it to the contractor.");
    } catch {
      setMessage(result.link);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" className="btn btn-secondary" onClick={onClick} disabled={pending}>
        {pending ? "Creating link…" : "Copy review link"}
      </button>
      {message ? <p className="break-all text-sm text-muted">{message}</p> : null}
    </div>
  );
}
