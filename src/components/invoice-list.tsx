"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { STATUS_LABEL, type InvoiceStatus } from "@/lib/status";
import type { InvoiceRow } from "@/lib/dashboard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "awaiting_review", label: "Waiting" },
  { key: "confirmed", label: "Confirmed" },
  { key: "sent", label: "Sent" },
  { key: "paid", label: "Paid" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export function InvoiceList({ invoices }: { invoices: InvoiceRow[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "paid" ? inv.isPaid : inv.status === filter && !inv.isPaid);
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        inv.number.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [invoices, filter, query]);

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted">Invoices</p>
        <h2 className="mt-1 text-3xl">Browse &amp; filter</h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className="text-sm transition-colors"
            style={
              filter === key
                ? { color: "var(--ink)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }
                : { color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: "3px" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search by number or client…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {visible.length === 0 ? (
        <p className="text-sm text-muted">No invoices match.</p>
      ) : (
        <div className="paper overflow-hidden rounded-3xl">
          <ul>
            {visible.map((invoice) => (
              <li key={invoice.id} className="border-t border-line first:border-t-0">
                <Link
                  href={`/invoices/view/${invoice.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 hover:bg-paper-2"
                >
                  <div>
                    <p className="font-medium">
                      {invoice.number}
                      <span className="text-muted"> · {invoice.clientName}</span>
                    </p>
                    <p className="text-sm text-muted">
                      {invoice.isPaid
                        ? "Paid"
                        : (STATUS_LABEL[invoice.status as InvoiceStatus] ?? invoice.status)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {invoice.isPaid
                      ? formatMoney(invoice.totalCents)
                      : invoice.dueCents > 0
                      ? `${formatMoney(invoice.dueCents)} due`
                      : formatMoney(invoice.totalCents)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
