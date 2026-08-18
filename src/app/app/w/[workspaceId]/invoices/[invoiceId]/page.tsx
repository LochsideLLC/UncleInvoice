import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { formatDate, toDateInput } from "@/lib/dates";
import { formatMoney, invoiceGrandTotal } from "@/lib/money";
import { SEEDED_DISCLAIMER } from "@/lib/invoices";
import { sendForReviewAction, sendToClientAction } from "@/actions/invoices";
import { StatusBadge } from "@/components/status-badge";
import { CopyLinkButton } from "@/components/copy-link-button";
import { EditInvoiceForm } from "@/components/edit-invoice-form";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; invoiceId: string }>;
}) {
  const { workspaceId, invoiceId } = await params;
  await requireWorkspace(workspaceId);
  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, workspaceId },
    include: {
      contractor: true,
      workspace: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      events: { orderBy: { createdAt: "desc" } },
      seededBy: true,
    },
  });
  if (!invoice) notFound();

  const total = invoiceGrandTotal(invoice.lineItems, invoice.taxRateBps);
  const canEdit = invoice.status !== "sent";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{invoice.number}</p>
            <h2 className="text-3xl">{invoice.contractor.name}</h2>
            <p className="mt-1 text-muted">{formatMoney(total)} · {formatDate(invoice.issueDate)}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="notice">
          {SEEDED_DISCLAIMER}
          {invoice.seededBy ? ` Seeded by ${invoice.seededBy.name}.` : null}
        </div>

        {canEdit ? (
          <EditInvoiceForm
            workspaceId={workspaceId}
            invoice={{
              id: invoice.id,
              issueDate: toDateInput(invoice.issueDate),
              dueDate: toDateInput(invoice.dueDate),
              poNumber: invoice.poNumber ?? "",
              paymentTerms: invoice.paymentTerms ?? "",
              paymentInstructions: invoice.paymentInstructions ?? "",
              taxRateBps: invoice.taxRateBps,
              serviceStart: toDateInput(invoice.serviceStart),
              serviceEnd: toDateInput(invoice.serviceEnd),
              notes: invoice.notes ?? "",
              internalNote: invoice.internalNote ?? "",
              lineItems: invoice.lineItems,
            }}
          />
        ) : (
          <div className="paper rounded-3xl p-6">
            <ul className="space-y-2">
              {invoice.lineItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {item.description}{" "}
                    <span className="text-muted">
                      ({item.quantity} × {formatMoney(item.unitPrice)})
                    </span>
                  </span>
                  <span>{formatMoney(Math.round(item.quantity * item.unitPrice))}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <aside className="space-y-5">
        <div className="paper space-y-4 rounded-3xl p-6">
          <h3 className="text-xl">Get this confirmed</h3>
          <p className="text-sm text-muted">
            Send a magic link, or copy it and text it. The contractor does not need an
            account.
          </p>
          {invoice.contractor.email ? (
            <form action={sendForReviewAction}>
              <input type="hidden" name="workspaceId" value={workspaceId} />
              <input type="hidden" name="invoiceId" value={invoice.id} />
              <button className="btn btn-primary">Email review link</button>
            </form>
          ) : (
            <p className="text-sm text-amber-900">
              Add an email on the contractor record to send automatically.
            </p>
          )}
          <CopyLinkButton workspaceId={workspaceId} invoiceId={invoice.id} />
          {invoice.status === "confirmed" || invoice.status === "sent" ? (
            <form action={sendToClientAction}>
              <input type="hidden" name="workspaceId" value={workspaceId} />
              <input type="hidden" name="invoiceId" value={invoice.id} />
              <button className="btn btn-secondary">Email invoice to client</button>
            </form>
          ) : null}
          <Link
            href={`/api/invoices/${invoice.id}/pdf`}
            className="btn btn-ghost"
          >
            Download PDF
          </Link>
        </div>

        <div className="paper rounded-3xl p-6">
          <h3 className="text-xl">Activity</h3>
          <ol className="mt-4 space-y-3 text-sm">
            {invoice.events.map((event) => (
              <li key={event.id}>
                <p>{event.message}</p>
                <p className="text-muted">
                  {event.actorName ?? event.actorEmail ?? "System"} · {formatDate(event.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
