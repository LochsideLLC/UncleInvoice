import { getSessionUser } from "@/lib/auth";
import { QuickInvoiceForm } from "@/components/quick-invoice-form";
import { SiteHeader } from "@/components/site-header";
import { W9Note } from "@/components/w9-note";

export default async function CreateInvoicePage() {
  const user = await getSessionUser();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-5 py-8">
      <SiteHeader user={user} />
      <QuickInvoiceForm
        defaultFromName={user?.name ?? ""}
        defaultFromEmail={user && user.email !== "guest@uncleinvoice.com" ? user.email : ""}
      />
      <div className="mt-8">
        <W9Note />
      </div>
    </div>
  );
}
