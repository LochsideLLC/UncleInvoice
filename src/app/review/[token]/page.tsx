import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/crypto";
import { formatMoney, invoiceGrandTotal } from "@/lib/money";
import { SEEDED_DISCLAIMER } from "@/lib/invoices";
import { ContractorReviewForm } from "@/components/contractor-review-form";
import { toDateInput } from "@/lib/dates";
import { BrandMark } from "@/components/brand-mark";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const record = await db.magicLink.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      invoice: {
        include: {
          contractor: true,
          workspace: true,
          lineItems: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (
    !record ||
    record.purpose !== "invoice_review" ||
    record.expiresAt < new Date() ||
    !record.invoice
  ) {
    notFound();
  }

  const invoice = record.invoice;
  const total = invoiceGrandTotal(invoice.lineItems, invoice.taxRateBps);
  const alreadyDone = invoice.status === "confirmed" || invoice.status === "sent";

  return (
    <div className="mx-auto min-h-full w-full max-w-xl px-5 py-10">
      <BrandMark size="sm" />
      <h1 className="mt-5 text-3xl">
        Hi {invoice.contractor.name.split(" ")[0]} — does this look right?
      </h1>
      <p className="mt-3 text-muted">
        {invoice.workspace.name} asked us to prepare invoice {invoice.number} from their
        books. Amount: <span className="text-ink">{formatMoney(total)}</span>.
      </p>
      <div className="notice mt-5">
        {SEEDED_DISCLAIMER}
      </div>

      {alreadyDone ? (
        <div className="paper mt-6 rounded-3xl p-6">
          <h2 className="text-2xl">Already confirmed</h2>
          <p className="mt-2 text-muted">
            This invoice is on file
            {invoice.sentAt ? " and was emailed to the client" : ""}. Thank you.
          </p>
        </div>
      ) : (
        <ContractorReviewForm
          token={token}
          workspaceName={invoice.workspace.name}
          invoice={{
            issueDate: toDateInput(invoice.issueDate),
            serviceStart: toDateInput(invoice.serviceStart),
            serviceEnd: toDateInput(invoice.serviceEnd),
            notes: invoice.notes ?? "",
            lineItems: invoice.lineItems,
          }}
        />
      )}
    </div>
  );
}
