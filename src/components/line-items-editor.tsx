"use client";

import { useState } from "react";
import { centsToDollars } from "@/lib/money";

export type LineDraft = {
  description: string;
  quantity: string;
  price: string;
  taxable: boolean;
};

export function LineItemsEditor({
  initial = [{ description: "", quantity: "1", price: "", taxable: false }],
  onChange,
}: {
  initial?: LineDraft[];
  onChange?: (rows: LineDraft[]) => void;
}) {
  const [rows, setRows] = useState<LineDraft[]>(
    initial.length ? initial : [{ description: "", quantity: "1", price: "", taxable: false }],
  );

  function commit(next: LineDraft[]) {
    setRows(next);
    onChange?.(next);
  }

  function update(index: number, patch: Partial<LineDraft>) {
    commit(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-3">
      <div className="hidden gap-3 text-xs uppercase tracking-wide text-muted sm:grid sm:grid-cols-[1fr_5.5rem_7rem_3.5rem_2rem]">
        <span>Description</span>
        <span>Qty</span>
        <span>Rate ($)</span>
        <span>Tax</span>
        <span />
      </div>
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_5.5rem_7rem_3.5rem_2rem] sm:items-center">
          <input
            name="item_description"
            value={row.description}
            onChange={(event) => update(index, { description: event.target.value })}
            placeholder="Cleaning, 4 units on Lake Street"
            className="w-full rounded-xl border border-line bg-white px-3 py-2"
          />
          <input
            name="item_quantity"
            value={row.quantity}
            onChange={(event) => update(index, { quantity: event.target.value })}
            inputMode="decimal"
            className="w-full rounded-xl border border-line bg-white px-3 py-2"
          />
          <input
            name="item_price"
            value={row.price}
            onChange={(event) => update(index, { price: event.target.value })}
            inputMode="decimal"
            placeholder="75.00"
            className="w-full rounded-xl border border-line bg-white px-3 py-2"
          />
          <label className="flex items-center justify-center">
            <input
              type="checkbox"
              name="item_taxable"
              value={String(index)}
              checked={row.taxable}
              onChange={(event) => update(index, { taxable: event.target.checked })}
              aria-label="Charge tax on this line"
              className="h-4 w-4 accent-[var(--accent)]"
            />
          </label>
          <button
            type="button"
            className="text-sm text-muted"
            onClick={() => commit(rows.filter((_, i) => i !== index))}
            aria-label="Remove line"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-accent underline-offset-2 hover:underline"
        onClick={() =>
          commit([...rows, { description: "", quantity: "1", price: "", taxable: false }])
        }
      >
        Add another line
      </button>
    </div>
  );
}

export function toLineDrafts(
  items: { description: string; quantity: number; unitPrice: number; taxable?: boolean }[],
): LineDraft[] {
  return items.map((item) => ({
    description: item.description,
    quantity: String(item.quantity),
    price: centsToDollars(item.unitPrice),
    taxable: Boolean(item.taxable),
  }));
}
