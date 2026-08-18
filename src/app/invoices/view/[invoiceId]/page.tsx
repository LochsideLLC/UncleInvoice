import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/crypto";
import { getSessionUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { InvoiceDocument, invoiceToDocument } from "@/components/invoice-document";
import { InvoiceActions } from "@/components/invoice-actions";

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

  const pdfHref = `/api/invoices/${invoice.id}/pdf${token ? `?token=${token}` : ""}`;
  const user = await getSessionUser();

  return (
    <div className="mx-auto min-h-full w-full max-w-6xl px-5 py-8">
      <div className="print:hidden">
        <SiteHeader
          user={user}
          extra={
            <Link href="/create" className="hover:text-ink">
              New invoice
            </Link>
          }
        />
      </div>
      <p className="mb-4 text-muted print:hidden">Here&apos;s what you made. Look it over before you download.</p>
      <InvoiceDocument invoice={invoiceToDocument(invoice)} />
      <div className="mt-6">
        <InvoiceActions pdfHref={pdfHref} />
      </div>
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
