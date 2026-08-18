import Link from "next/link";
import { SponsorForm } from "@/components/sponsor-form";

export default function NewSponsorPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/sponsors" className="text-sm text-muted">
        ← Sponsors
      </Link>
      <h1 className="text-3xl">Add a sponsor</h1>
      <SponsorForm />
    </div>
  );
}
