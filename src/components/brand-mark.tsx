import Link from "next/link";

export function UncleStamp({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>Uncle Invoice</title>
      <defs>
        <clipPath id="uncle-stamp-inner">
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#fff8ee" />
      <g clipPath="url(#uncle-stamp-inner)">
        <circle cx="32" cy="50" r="21" fill="#9a3b24" />
        <g transform="translate(32 32) scale(1.28) translate(-32 -32)">
          <path
            d="M18 44c3.2-7.5 8.4-11 14-11s10.8 3.5 14 11"
            fill="#9a3b24"
          />
        </g>
        <g transform="translate(32 28.5) scale(1.76) translate(-32 -27)">
          <circle cx="32" cy="27" r="9.2" fill="#e8c9a4" />
          <path d="M23.5 26.5h17" stroke="#2a1f16" strokeWidth="1.6" />
          <circle cx="27.2" cy="26.6" r="3.4" fill="none" stroke="#2a1f16" strokeWidth="1.5" />
          <circle cx="36.8" cy="26.6" r="3.4" fill="none" stroke="#2a1f16" strokeWidth="1.5" />
          <path
            d="M28.2 31.6Q32 31.3 35.8 31.6L32 34.5Z"
            fill="#2a1f16"
          />
          <path
            d="M22 22.5c2.4-3.2 6-5 10-5s7.6 1.8 10 5"
            fill="none"
            stroke="#2a1f16"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

export function BrandMark({
  href = "/",
  size = "md",
  mark = true,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  mark?: boolean;
}) {
  const stamp = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const type = size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";

  return (
    <Link href={href} className="inline-flex items-center gap-2.5 text-ink">
      {mark ? <UncleStamp className={stamp} /> : null}
      <span className={`display ${type} leading-none`}>Uncle Invoice</span>
    </Link>
  );
}
