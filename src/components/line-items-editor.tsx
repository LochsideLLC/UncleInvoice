"use client";

import { useState } from "react";
import { centsToDollars } from "@/lib/money";

export type LineDraft = {
  description: string;
  quantity: string;
  price: string;
};

export function LineItemsEditor({
  initial = [{ description: "", quantity: "1", price: "" }],
}: {
  initial?: LineDraft[];
}) {
  const [rows, setRows] = useState<LineDraft[]>(
    initial.length ? initial : [{ description: "", quantity: "1", price: "" }],
  );

  function update(index: number, patch: Partial<LineDraft>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-3">
      <div className="hidden gap-3 text-xs uppercase tracking-wide text-muted sm:grid sm:grid-cols-[1fr_5.5rem_7rem_2rem]">
        <span>Description</span>
        <span>Qty</span>
        <span>Rate ($)</span>
        <span />
      </div>
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_5.5rem_7rem_2rem] sm:items-center">
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
          <button
            type="button"
            className="text-sm text-muted"
            onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
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
          setRows((current) => [...current, { description: "", quantity: "1", price: "" }])
        }
      >
        Add another line
      </button>
    </div>
  );
}

export function toLineDrafts(
  items: { description: string; quantity: number; unitPrice: number }[],
): LineDraft[] {
  return items.map((item) => ({
    description: item.description,
    quantity: String(item.quantity),
    price: centsToDollars(item.unitPrice),
  }));
}
