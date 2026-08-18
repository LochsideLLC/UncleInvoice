"use client";

export function InvoiceActions({
  pdfHref,
}: {
  pdfHref: string;
}) {
  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button type="button" className="btn btn-primary" onClick={() => window.print()}>
        Print
      </button>
      <a href={`${pdfHref}${pdfHref.includes("?") ? "&" : "?"}download=1`} className="btn btn-ghost">
        Download PDF
      </a>
    </div>
  );
}
