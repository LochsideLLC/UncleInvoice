import { recentOutbox } from "@/lib/mail";
import { formatDate } from "@/lib/dates";

export default async function OutboxPage() {
  const emails = await recentOutbox(30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Outbox</h1>
        <p className="mt-2 text-muted">
          Every review link and invoice email we generate is listed here. If you have not
          connected Resend yet, this is how you copy the link and text it yourself.
        </p>
      </div>
      <div className="paper rounded-3xl">
        <ul>
          {emails.map((email) => (
            <li key={email.id} className="border-t border-line px-6 py-4 first:border-t-0">
              <p className="font-medium">{email.subject}</p>
              <p className="text-sm text-muted">
                To {email.to} · {formatDate(email.createdAt)}
              </p>
              {email.link ? (
                <a href={email.link} className="mt-2 inline-block break-all text-sm underline">
                  {email.link}
                </a>
              ) : null}
            </li>
          ))}
          {emails.length === 0 ? (
            <li className="px-6 py-8 text-muted">Nothing sent yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
