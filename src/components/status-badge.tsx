import { STATUS_LABEL, STATUS_TONE, isInvoiceStatus } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const tone = isInvoiceStatus(status) ? STATUS_TONE[status] : "bg-stone-100 text-stone-700";
  const label = isInvoiceStatus(status) ? STATUS_LABEL[status] : status;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}
