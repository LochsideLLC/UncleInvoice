import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { listSponsors } from "@/lib/sponsors";
import { SiteHeader } from "@/components/site-header";
import { SponsorBoard } from "@/components/sponsor-board";

export default async function HomePage() {
  const user = await getSessionUser();
  const { featured, rest } = await listSponsors();

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <SiteHeader user={user} stampClassName="h-20 w-20" />
      </div>

      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center px-6 pb-6 text-center">
          <h1 className="text-4xl leading-[1.12] text-ink sm:text-5xl">
            Create invoices for free
          </h1>
          <Link href="/create" className="btn btn-primary btn-hero mt-10">
            Create Invoice
          </Link>
          {user ? (
            <Link href={user.admin ? "/admin" : "/app"} className="mt-4 text-sm text-muted hover:text-ink">
              {user.admin ? "Admin" : "My invoices"}
            </Link>
          ) : (
            <div className="mt-4 flex items-center gap-5 text-sm text-muted">
              <Link href="/signup" className="hover:text-ink">
                Create account
              </Link>
              <Link href="/login" className="hover:text-ink">
                Log in
              </Link>
            </div>
          )}
        </div>
        <SponsorBoard featured={featured} rest={rest} />
      </main>
    </div>
  );
}
