import Link from "next/link";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/crypto";
import { ClaimAccountForm } from "@/components/claim-account-form";

export default async function ReviewDonePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const record = await db.magicLink.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      invoice: { include: { contractor: true, workspace: true } },
    },
  });
  const invoice = record?.invoice;

  return (
    <div className="mx-auto min-h-full w-full max-w-xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-muted">Uncle Invoice</p>
      <h1 className="mt-3 text-3xl">Thank you. That invoice is on the record.</h1>
      <p className="mt-3 text-muted">
        {invoice
          ? `${invoice.number} from ${invoice.contractor.name} is confirmed${
              invoice.status === "sent" ? ` and emailed to ${invoice.workspace.name}` : ""
            }.`
          : "Your confirmation is saved."}
      </p>
      {invoice ? (
        <Link href={`/api/invoices/${invoice.id}/pdf?token=${token}`} className="btn btn-secondary mt-6">
          Download PDF
        </Link>
      ) : null}

      {invoice?.contractor.email ? (
        <div className="mt-10">
          <h2 className="text-2xl">Want to see your invoices later?</h2>
          <p className="mt-2 text-muted">
            Optional. Set a password for {invoice.contractor.email}. You do not need this
            to confirm invoices — only if you want a login.
          </p>
          <ClaimAccountForm
            email={invoice.contractor.email}
            name={invoice.contractor.name}
          />
        </div>
      ) : null}
    </div>
  );
}
