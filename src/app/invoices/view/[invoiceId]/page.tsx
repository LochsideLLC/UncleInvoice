import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/crypto";
import { getSessionUser } from "@/lib/auth";
import { formatDate } from "@/lib/dates";
import { formatMoney, invoiceTotal, lineTotal } from "@/lib/money";
import { StatusBadge } from "@/components/status-badge";

export default async function PublicInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { invoiceId } = await params;
  const { token } = await searchParams;
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      contractor: true,
      workspace: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!invoice) notFound();

  const allowed = await canViewInvoice(invoice.id, invoice.workspaceId, token);
  if (!allowed) notFound();

  const total = invoiceTotal(invoice.lineItems);

  return (
    <div className="mx-auto min-h-full w-full max-w-2xl px-5 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted">Invoice {invoice.number}</p>
          <h1 className="mt-1 text-3xl">{invoice.contractor.name}</h1>
          <p className="mt-1 text-muted">Bill to {invoice.workspace.name}</p>
        </div>
        <StatusBadge status={invoice.status} />
      </div>
      <p className="mt-4 text-muted">Date {formatDate(invoice.issueDate)}</p>

      <div className="paper mt-8 rounded-3xl p-6">
        <ul className="space-y-3">
          {invoice.lineItems.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.description}
                <span className="block text-sm text-muted">
                  {item.quantity} × {formatMoney(item.unitPrice)}
                </span>
              </span>
              <span>{formatMoney(lineTotal(item.quantity, item.unitPrice))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-line pt-4 text-xl">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      {invoice.notes ? <p className="mt-6 text-muted">{invoice.notes}</p> : null}
      {invoice.confirmedAt ? (
        <p className="mt-4 text-sm text-accent">
          Confirmed by {invoice.confirmedByEmail ?? invoice.contractor.name} on{" "}
          {formatDate(invoice.confirmedAt)}.
        </p>
      ) : null}

      <a
        href={`/api/invoices/${invoice.id}/pdf${token ? `?token=${token}` : ""}`}
        className="btn btn-primary mt-8"
      >
        Download PDF
      </a>
    </div>
  );
}

async function canViewInvoice(
  invoiceId: string,
  workspaceId: string,
  token: string | string[] | undefined,
) {
  const raw = Array.isArray(token) ? token[0] : token;
  if (raw) {
    const record = await db.magicLink.findUnique({
      where: { tokenHash: hashToken(raw) },
    });
    if (
      record &&
      record.invoiceId === invoiceId &&
      record.expiresAt >= new Date() &&
      (record.purpose === "invoice_view" || record.purpose === "invoice_review")
    ) {
      return true;
    }
  }

  const user = await getSessionUser();
  if (!user) return false;
  const membership = await db.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
  });
  return Boolean(membership);
}
