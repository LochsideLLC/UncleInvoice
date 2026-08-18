import type { ReactNode } from "react";
import Link from "next/link";
import { UncleStamp } from "@/components/brand-mark";

export function SiteHeader({
  user,
  stampClassName = "h-16 w-16",
  extra,
}: {
  user?: { admin?: boolean } | null;
  stampClassName?: string;
  extra?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col items-center text-center">
      <Link href="/" className="display text-2xl leading-none text-muted">
        Uncle Invoice
      </Link>
      <UncleStamp className={`mt-1.5 ${stampClassName}`} />
      {user || extra ? (
        <nav className="mt-3 flex items-center gap-5 text-sm text-muted">
          {user ? (
            <>
              {user.admin ? (
                <Link href="/admin" className="hover:text-ink">
                  Admin
                </Link>
              ) : null}
              <Link href="/app" className="hover:text-ink">
                My invoices
              </Link>
            </>
          ) : null}
          {extra}
        </nav>
      ) : null}
    </header>
  );
}
