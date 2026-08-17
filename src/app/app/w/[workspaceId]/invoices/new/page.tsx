import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { SeedInvoiceForm } from "@/components/seed-invoice-form";

export default async function NewInvoicePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { workspace } = await requireWorkspace(workspaceId);
  const contractors = await db.contractor.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl">Seed an invoice</h2>
        <p className="mt-2 text-muted">
          Based on the books, this is the invoice {workspace.name}&apos;s contractor should
          have sent. They will review it, edit if needed, and confirm.
        </p>
      </div>
      {contractors.length === 0 ? (
        <p className="paper rounded-3xl p-6 text-muted">
          Add a contractor first, then come back and seed their invoice.
        </p>
      ) : (
        <SeedInvoiceForm workspaceId={workspaceId} contractors={contractors} />
      )}
    </div>
  );
}
