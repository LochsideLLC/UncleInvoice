import { FILE_1099_URL, IRS_W9_PDF, W9_VIDEO_THUMB, W9_VIDEO_URL } from "@/lib/w9";

export function W9Note() {
  return (
    <aside className="paper grid gap-6 rounded-[1.4rem] p-6 sm:p-8 lg:grid-cols-2 lg:items-start">
      <div>
        <h2 className="display text-3xl text-ink sm:text-4xl">
          Should you send a W-9 with this?
        </h2>
        <p className="mt-3 text-muted">
          A W-9 is a form you send the company you billed so they know who you are and can pay
          you. It has your tax ID on it. They use it to file a 1099 with the IRS, which is how
          they report what they paid you.
        </p>
        <div className="mt-5 space-y-3">
          <a
            href={IRS_W9_PDF}
            className="btn btn-secondary w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get a W-9
          </a>
          <a
            href={FILE_1099_URL}
            className="btn btn-secondary w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            File 1099s
          </a>
        </div>
      </div>
      <a
        href={W9_VIDEO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-[1rem] border-4 border-line bg-ink"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={W9_VIDEO_THUMB}
          alt=""
          className="aspect-video w-full object-cover opacity-90 transition group-hover:opacity-100"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg transition group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
        </span>
        <span className="sr-only">Watch on YouTube (opens in a new tab)</span>
      </a>
    </aside>
  );
}
