import Link from "next/link";
import { db } from "@/lib/db";
import {
  deleteSponsorAction,
  toggleSponsorFeaturedAction,
} from "@/actions/sponsors";

export default async function AdminSponsorsPage() {
  const sponsors = await db.sponsor.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Sponsors</h1>
          <p className="mt-2 text-muted">
            Featured sponsors sit in the big row on the home page. Everyone else is
            listed underneath. Each one gets a public page.
          </p>
        </div>
        <Link href="/admin/sponsors/new" className="btn btn-primary">
          Add a sponsor
        </Link>
      </div>
      <div className="paper overflow-hidden rounded-[1.4rem]">
        <ul>
          {sponsors.map((sponsor) => (
            <li
              key={sponsor.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 first:border-t-0"
            >
              <div>
                <p className="font-medium">
                  {sponsor.name}
                  {sponsor.featured ? (
                    <span className="ml-2 text-xs uppercase tracking-wide text-accent">
                      Featured
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-muted">/sponsors/{sponsor.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/sponsors/${sponsor.slug}`} className="btn btn-ghost px-3 py-1.5 text-sm">
                  View
                </Link>
                <Link
                  href={`/admin/sponsors/${sponsor.id}`}
                  className="btn btn-ghost px-3 py-1.5 text-sm"
                >
                  Edit
                </Link>
                <form action={toggleSponsorFeaturedAction}>
                  <input type="hidden" name="id" value={sponsor.id} />
                  <input
                    type="hidden"
                    name="featured"
                    value={sponsor.featured ? "false" : "true"}
                  />
                  <button className="btn btn-ghost px-3 py-1.5 text-sm">
                    {sponsor.featured ? "Unfeature" : "Feature"}
                  </button>
                </form>
                <form action={deleteSponsorAction}>
                  <input type="hidden" name="id" value={sponsor.id} />
                  <button className="btn btn-ghost px-3 py-1.5 text-sm">Remove</button>
                </form>
              </div>
            </li>
          ))}
          {sponsors.length === 0 ? (
            <li className="px-5 py-8 text-muted">No sponsors yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
