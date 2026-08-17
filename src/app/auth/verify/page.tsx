import Link from "next/link";
import { consumeLoginToken } from "@/actions/auth";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="text-3xl">Missing link</h1>
        <p className="mt-3 text-muted">That sign-in link is incomplete.</p>
        <Link href="/login" className="btn btn-primary mt-6">
          Back to sign in
        </Link>
      </div>
    );
  }

  const result = await consumeLoginToken(token);
  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl">Could not sign you in</h1>
      <p className="mt-3 text-muted">{result.error}</p>
      <Link href="/login" className="btn btn-primary mt-6">
        Request a new link
      </Link>
    </div>
  );
}
