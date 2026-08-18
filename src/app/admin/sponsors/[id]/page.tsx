import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SponsorForm } from "@/components/sponsor-form";

export default async function EditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sponsor = await db.sponsor.findUnique({ where: { id } });
  if (!sponsor) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/sponsors" className="text-sm text-muted">
        ← Sponsors
      </Link>
      <h1 className="text-3xl">Edit {sponsor.name}</h1>
      <SponsorForm
        sponsor={{
          id: sponsor.id,
          name: sponsor.name,
          slug: sponsor.slug,
          tagline: sponsor.tagline ?? "",
          about: sponsor.about ?? "",
          url: sponsor.url,
          email: sponsor.email ?? "",
          phone: sponsor.phone ?? "",
          city: sponsor.city ?? "",
          logoUrl: sponsor.logoUrl ?? "",
          featured: sponsor.featured,
        }}
      />
    </div>
  );
}
