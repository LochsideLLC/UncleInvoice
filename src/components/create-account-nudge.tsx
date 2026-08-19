import Link from "next/link";

export function CreateAccountNudge() {
  return (
    <aside className="paper mb-6 flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div>
        <h2 className="display text-2xl text-ink">
          Want Uncle to remember your name, logo, and invoices next time?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Make a free account and you will not have to start from scratch.
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44">
        <Link href="/signup" className="btn btn-primary">
          Create Account
        </Link>
        <Link href="/login" className="text-center text-sm text-muted hover:text-ink">
          Sign In
        </Link>
      </div>
    </aside>
  );
}
