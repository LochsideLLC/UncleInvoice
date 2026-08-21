import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";

export const metadata: Metadata = {
  title: "Referral Partner Program — Bookkeeping Conroe",
  description: "Free QuickBooks inspection referral partner program details.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ZaneBilboPartnerPage() {
  return (
    <PageContainer>
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          Bookkeeping Conroe · Referral Partner Program
        </p>
        <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">
          Free QuickBooks Inspection
        </h1>
      </header>

      <section className="flex flex-col gap-4 text-base leading-relaxed">
        <p>
          We&apos;re offering local business owners a{" "}
          <strong>free QuickBooks inspection</strong>, often available the same
          day.
        </p>
        <p>
          We&apos;ll take a look at their QuickBooks file and identify anything
          that appears incorrect, incomplete, behind, or worth their attention.
        </p>
        <p>There&apos;s no obligation to hire us.</p>
        <p>
          Afterward, if they found the inspection helpful, we&apos;ll ask them
          to leave an honest Google review about their experience.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-6">
        <h2 className="text-2xl">What You Can Say</h2>
        <blockquote className="border-l-2 border-accent pl-4 italic leading-relaxed text-ink">
          &ldquo;I work with Bookkeeping Conroe, a local bookkeeping firm.
          We&apos;re offering business owners a free QuickBooks inspection
          right now. We&apos;ll take a look at your books and point out
          anything that looks wrong, behind, or worth paying attention to. We
          can usually do it the same day. There&apos;s no obligation to hire
          us. Would you like me to set one up for you?&rdquo;
        </blockquote>
        <p className="text-sm text-muted">
          If they say their books are already messy:
        </p>
        <blockquote className="border-l-2 border-accent pl-4 italic leading-relaxed text-ink">
          &ldquo;That&apos;s exactly what we can take a look at. I can do the
          initial inspection with you, and Thomas will guide me if we find
          anything complicated. The inspection itself is free.&rdquo;
        </blockquote>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">Your Compensation</h2>
        <p className="leading-relaxed">
          You will be paid <strong>$25 per hour</strong> for approved
          QuickBooks inspection work.
        </p>
        <p className="leading-relaxed">
          Thomas will train and guide you on how to conduct the inspection and
          what to look for.
        </p>
        <p className="leading-relaxed">
          You are not expected to diagnose every accounting issue yourself. If
          something is outside your experience, escalate it.
        </p>

        <p className="leading-relaxed">
          If a prospect you originate becomes a paying client:
        </p>
        <ul className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-6">
          <li>
            <strong>Monthly bookkeeping:</strong> You receive 100% of the
            client&apos;s first month of recurring bookkeeping fees.
          </li>
          <li>
            <strong>Cleanup or catch-up work:</strong> You receive 10% of the
            cleanup fee collected by Bookkeeping Conroe.
          </li>
        </ul>
        <p className="leading-relaxed text-sm text-muted">
          When appropriate, you may also be offered the opportunity to help
          service the account on an ongoing basis.
        </p>
      </section>

      <footer className="border-t border-line pt-6 text-sm text-muted">
        Questions?{" "}
        <a
          href="mailto:partners@bookkeepingconroe.com"
          className="text-accent hover:text-accent-hover"
        >
          partners@bookkeepingconroe.com
        </a>
      </footer>
    </PageContainer>
  );
}
