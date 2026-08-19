import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 pb-24">
      <h1 className="text-3xl">We could not find that.</h1>
      <p className="mt-3 text-muted">
        The link may have expired, or this page is not meant for this account.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Back home
      </Link>
    </div>
  );
}
