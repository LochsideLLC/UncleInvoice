import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SponsorMark } from "@/components/sponsor-mark";
import { getSponsorBySlug, hrefFor } from "@/lib/sponsors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sponsor = await getSponsorBySlug(slug);
  if (!sponsor) return { title: "Sponsor" };
  return {
    title: `${sponsor.name} — Uncle Invoice`,
    description: sponsor.tagline ?? sponsor.about ?? `Sponsor listing for ${sponsor.name}`,
  };
}

export default async function SponsorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sponsor = await getSponsorBySlug(slug);
  if (!sponsor) notFound();

  return (
    <div className="mx-auto min-h-full w-full max-w-2xl px-6 pb-8">
      <article className="paper rounded-[1.6rem] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <SponsorMark name={sponsor.name} logoUrl={sponsor.logoUrl} large />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Sponsor
            </p>
            <h1 className="mt-1 text-3xl">{sponsor.name}</h1>
            {sponsor.city ? <p className="mt-1 text-muted">{sponsor.city}</p> : null}
          </div>
        </div>
        {sponsor.tagline ? (
          <p className="mt-6 text-lg text-ink">{sponsor.tagline}</p>
        ) : null}
        {sponsor.about ? (
          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{sponsor.about}</p>
        ) : null}
        <dl className="mt-8 space-y-2 text-sm">
          {sponsor.phone ? (
            <div>
              <dt className="uppercase tracking-wide text-muted">Phone</dt>
              <dd>
                <a href={`tel:${sponsor.phone}`} className="underline-offset-2 hover:underline">
                  {sponsor.phone}
                </a>
              </dd>
            </div>
          ) : null}
          {sponsor.email ? (
            <div>
              <dt className="uppercase tracking-wide text-muted">Email</dt>
              <dd>
                <a href={`mailto:${sponsor.email}`} className="underline-offset-2 hover:underline">
                  {sponsor.email}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
        <a
          href={hrefFor(sponsor.url)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary mt-8"
        >
          Visit website
        </a>
      </article>
      <Link href="/" className="mt-8 inline-block text-sm text-muted hover:text-ink">
        ← Back to Uncle Invoice
      </Link>
    </div>
  );
}
