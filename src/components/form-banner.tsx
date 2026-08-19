"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function FormBanner({
  state,
}: {
  state: { error?: string; ok?: boolean; message?: string } | null;
}) {
  const failed = Boolean(state?.error);
  const successText = !failed && state?.message ? state.message : null;
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!successText) {
      setVisible((open) => {
        if (open) setLeaving(true);
        return open;
      });
      return;
    }

    setText(successText);
    setLeaving(false);
    setVisible(true);
    if (successText.includes("http")) return;

    const hide = window.setTimeout(() => setLeaving(true), 4500);
    return () => window.clearTimeout(hide);
  }, [successText]);

  if (failed) {
    return (
      <p className="rounded-xl bg-[#f3dcc0] px-3 py-2 text-sm text-[#7a3a22]">{state?.error}</p>
    );
  }

  if (!mounted || !visible || !text) return null;

  return createPortal(
    <div
      role="status"
      className={`fixed inset-x-0 top-0 z-[80] bg-[#4a5c3a] px-4 py-3 text-center text-sm font-semibold text-[#fff8ee] shadow-[0_8px_24px_-12px_rgba(42,31,22,0.45)] ${
        leaving ? "toast-banner-out" : "toast-banner"
      }`}
      onAnimationEnd={() => {
        if (!leaving) return;
        setVisible(false);
        setLeaving(false);
      }}
    >
      {text}
    </div>,
    document.body,
  );
}
