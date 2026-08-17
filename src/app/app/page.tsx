import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listWorkspaces } from "@/lib/workspace";

export default async function AppHomePage() {
  const user = await requireUser();
  const memberships = await listWorkspaces(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted">Your clients</p>
          <h1 className="mt-1 text-3xl">Who are we closing this month?</h1>
        </div>
        <Link href="/app/workspaces/new" className="btn btn-primary">
          Add a client
        </Link>
      </div>

      {memberships.length === 0 ? (
        <div className="paper rounded-3xl p-8">
          <h2 className="text-2xl">No clients yet</h2>
          <p className="mt-2 max-w-xl text-muted">
            Add the business you keep the books for. Then add their contractors and seed
            the invoices you already know should exist.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {memberships.map(({ workspace, role }) => (
            <li key={workspace.id}>
              <Link
                href={`/app/w/${workspace.id}`}
                className="paper block rounded-3xl p-6 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl">{workspace.name}</h2>
                  <span className="text-xs uppercase tracking-wide text-muted">{role}</span>
                </div>
                <p className="mt-2 text-muted">{workspace.email}</p>
                <p className="mt-4 text-sm text-muted">
                  {workspace._count.contractors} contractors · {workspace._count.invoices}{" "}
                  invoices
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
