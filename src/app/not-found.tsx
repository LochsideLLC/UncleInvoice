import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <BrandMark size="sm" />
      <h1 className="mt-6 text-3xl">We could not find that.</h1>
      <p className="mt-3 text-muted">
        The link may have expired, or this page is not meant for this account.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Back home
      </Link>
    </div>
  );
}
