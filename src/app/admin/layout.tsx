import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { BrandMark } from "@/components/brand-mark";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.admin) redirect("/app");

  return (
    <div className="min-h-full">
      <header className="border-b border-line bg-paper/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <BrandMark href="/admin" size="sm" />
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/sponsors" className="text-muted hover:text-ink">
              Sponsors
            </Link>
            <Link href="/app" className="text-muted hover:text-ink">
              Invoices
            </Link>
            <span className="hidden text-muted sm:inline">{user.name}</span>
            <form action={logoutAction}>
              <button className="text-muted underline-offset-2 hover:underline">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
