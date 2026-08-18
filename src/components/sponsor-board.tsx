import Link from "next/link";
import type { Sponsor } from "@prisma/client";
import { SponsorMark } from "@/components/sponsor-mark";

export function SponsorBoard({
  featured,
  rest,
}: {
  featured: Sponsor[];
  rest: Sponsor[];
}) {
  if (featured.length === 0 && rest.length === 0) return null;

  return (
    <section className="mx-auto mt-16 w-full max-w-5xl border-t border-line px-6 pb-20 pt-12 text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Sponsors
      </p>

      {featured.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {featured.map((sponsor) => (
            <li key={sponsor.id}>
              <Link
                href={`/sponsors/${sponsor.slug}`}
                className="paper flex h-full items-start gap-4 rounded-[1.3rem] p-5 transition hover:-translate-y-0.5"
              >
                <SponsorMark name={sponsor.name} logoUrl={sponsor.logoUrl} large />
                <div className="min-w-0">
                  <p className="display text-xl text-ink">{sponsor.name}</p>
                  {sponsor.tagline ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {sponsor.tagline}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {rest.length > 0 ? (
        <ul
          className={`divide-y divide-line overflow-hidden rounded-[1.3rem] border border-line bg-paper ${
            featured.length > 0 ? "mt-8" : "mt-4"
          }`}
        >
          {rest.map((sponsor) => (
            <li key={sponsor.id}>
              <Link
                href={`/sponsors/${sponsor.slug}`}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-paper-2"
              >
                <SponsorMark name={sponsor.name} logoUrl={sponsor.logoUrl} />
                <div className="min-w-0 flex-1">
                  <p className="text-ink">{sponsor.name}</p>
                  {sponsor.tagline ? (
                    <p className="truncate text-sm text-muted">{sponsor.tagline}</p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
