import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-full">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg tracking-tight">
          Uncle Invoice
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <Link href="/app" className="btn btn-primary">
              Open your clients
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="grid gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              For bookkeepers and the businesses they keep
            </p>
            <h1 className="max-w-xl text-4xl leading-tight sm:text-5xl">
              You already know what the invoice should say. They just confirm it.
            </h1>
            <p className="max-w-xl text-lg text-muted">
              When a client paid a contractor and there is no invoice, the close stalls.
              Uncle Invoice lets you seed a draft from the books, text the contractor a
              link, and get a confirmed invoice back — without asking anyone to become a
              bookkeeper.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">
                Start with your next close
              </Link>
              <Link href="/login" className="btn btn-secondary">
                Try the Sunrise Cleaning demo
              </Link>
            </div>
            <p className="text-sm text-muted">
              Demo login: <span className="text-ink">ada@ledgerandco.test</span> / demo1234
            </p>
          </div>

          <div className="paper rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-muted">Contractor view</p>
            <h2 className="mt-2 text-2xl">Hi Maria — does this look right?</h2>
            <p className="mt-2 text-sm text-muted">
              Sunrise Cleaning (and their bookkeeper) prepared this from the March checks.
              Review it. Fix anything that is wrong. You are responsible for the invoice.
            </p>
            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-baseline justify-between">
                <span>Unit cleaning — Lincoln Park, 8 visits</span>
                <span>$600.00</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between text-xl">
                <span>Total</span>
                <span>$600.00</span>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
              This is a starting point from the books — not a finished invoice until you
              confirm it.
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <span className="btn btn-primary pointer-events-none">This looks right</span>
              <span className="btn btn-ghost pointer-events-none">Edit first</span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-3">
          {[
            {
              title: "Bookkeepers",
              body: "Seed drafts from the check register or a spreadsheet. You know the date, the amount, and usually the work. Stop waiting on a blank invoice.",
            },
            {
              title: "Clients",
              body: "Give contractors a link instead of a lecture. When they confirm, the documentation lands in your inbox as a real invoice.",
            },
            {
              title: "Contractors",
              body: "No password. No software to learn. Open the text, check the numbers, tap confirm. Create an account later if you want a history.",
            },
          ].map((card) => (
            <article key={card.title} className="paper rounded-3xl p-6">
              <h3 className="text-xl">{card.title}</h3>
              <p className="mt-3 text-muted">{card.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
