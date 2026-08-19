"use client";

import { useRef, useState } from "react";

const MAX_EDGE = 640;

export async function fileToDataUrl(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not read that image.");
  context.fillStyle = "#fff8ee";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.88);
}

export function ImageDropzone({
  label,
  hint,
  value,
  pending,
  variant = "wide",
  onFile,
  onRemove,
}: {
  label: string;
  hint: string;
  value?: string | null;
  pending?: boolean;
  variant?: "square" | "wide";
  onFile: (file: File) => void;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const square = variant === "square";

  function takeFile(file: File | undefined) {
    if (!file) return;
    onFile(file);
  }

  return (
    <div className="field min-w-0">
      <label>{label}</label>
      <button
        type="button"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          takeFile(event.dataTransfer.files[0]);
        }}
        className={`flex h-20 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed px-2 py-2 text-center transition ${
          over ? "border-accent bg-paper-2" : "border-line bg-paper-2/50"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className={square ? "h-10 w-10 object-contain" : "h-10 max-w-full object-contain"}
          />
        ) : (
          <span className="display text-xl leading-none text-accent">+</span>
        )}
        <span className="text-[0.7rem] leading-tight text-muted">
          {value ? "Drop to replace" : hint}
        </span>
      </button>
      {value && onRemove ? (
        <button type="button" onClick={onRemove} className="self-start text-xs text-muted hover:text-ink">
          Remove
        </button>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          takeFile(file);
        }}
      />
    </div>
  );
}
