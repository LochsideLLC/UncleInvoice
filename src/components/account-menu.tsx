import Link from "next/link";
import { AccountMark } from "@/components/brand-mark";

export function AccountMenu({
  name,
  logoUrl,
  stampClassName,
}: {
  name: string;
  logoUrl?: string | null;
  admin?: boolean;
  stampClassName: string;
}) {
  return (
    <Link href="/app/profile" aria-label="Profile" className="mt-1.5 rounded-full">
      <AccountMark name={name} logoUrl={logoUrl} className={stampClassName} />
    </Link>
  );
}
