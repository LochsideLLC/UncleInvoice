import Link from "next/link";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { formatMoney, invoiceGrandTotal } from "@/lib/money";
import { StatusBadge } from "@/components/status-badge";

export default async function WorkspaceHomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { workspace } = await requireWorkspace(workspaceId);

  const [invoices, awaiting, contractors] = await Promise.all([
    db.invoice.findMany({
      where: { workspaceId },
      include: { contractor: true, lineItems: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.invoice.count({ where: { workspaceId, status: "awaiting_review" } }),
    db.contractor.count({ where: { workspaceId } }),
  ]);

  const openCents = invoices
    .filter((invoice) => invoice.status === "awaiting_review" || invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoiceGrandTotal(invoice.lineItems, invoice.taxRateBps), 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Waiting on contractors" value={String(awaiting)} />
        <Stat label="Contractors" value={String(contractors)} />
        <Stat label="Open on the recent list" value={formatMoney(openCents)} />
      </section>

      <section className="flex flex-wrap gap-3">
        <Link href={`/app/w/${workspace.id}/invoices/new`} className="btn btn-primary">
          Seed an invoice
        </Link>
        <Link href={`/app/w/${workspace.id}/import`} className="btn btn-secondary">
          Import a spreadsheet
        </Link>
        <Link href={`/app/w/${workspace.id}/contractors`} className="btn btn-ghost">
          Add a contractor
        </Link>
      </section>

      <section className="paper rounded-3xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-xl">Recent invoices</h2>
          <Link href={`/app/w/${workspace.id}/invoices`} className="text-sm text-muted">
            View all
          </Link>
        </div>
        {invoices.length === 0 ? (
          <p className="px-6 py-8 text-muted">
            Nothing seeded yet. Start from a check you already issued.
          </p>
        ) : (
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.id} className="border-t border-line first:border-t-0">
                <Link
                  href={`/app/w/${workspace.id}/invoices/${invoice.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {invoice.number} · {invoice.contractor.name}
                    </p>
                    <p className="text-sm text-muted">
                      {formatMoney(invoiceGrandTotal(invoice.lineItems, invoice.taxRateBps))}
                    </p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="paper rounded-3xl p-5">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 text-2xl">{value}</p>
    </div>
  );
}
