import { initials } from "@/lib/sponsors";

export function SponsorMark({
  name,
  logoUrl,
  large = false,
}: {
  name: string;
  logoUrl?: string | null;
  large?: boolean;
}) {
  const size = large ? "h-16 w-16 text-lg" : "h-12 w-12 text-sm";
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover ring-1 ring-line`}
      />
    );
  }
  return (
    <span
      className={`${size} inline-flex shrink-0 items-center justify-center rounded-full bg-paper-2 font-semibold text-accent ring-1 ring-line`}
    >
      {initials(name)}
    </span>
  );
}
