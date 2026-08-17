export function FormBanner({
  state,
}: {
  state: { error?: string; ok?: boolean; message?: string } | null;
}) {
  if (!state?.error && !state?.message) return null;
  const failed = Boolean(state.error);
  return (
    <p
      className={`rounded-xl px-3 py-2 text-sm ${
        failed ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-900"
      }`}
    >
      {state.error ?? state.message}
    </p>
  );
}
