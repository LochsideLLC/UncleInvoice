import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard";
import { listWorkspaces } from "@/lib/workspace";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default async function AppHomePage() {
  const user = await requireUser();
  const [memberships, stats] = await Promise.all([
    listWorkspaces(user.id),
    getDashboardStats(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center pt-2">
        <Link href="/create" className="btn btn-primary btn-hero">
          Create Invoice
        </Link>
      </div>
      <DashboardTabs stats={stats} memberships={memberships} />
    </div>
  );
}
