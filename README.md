# Uncle Invoice

That invoice, already filled in.

Bookkeepers seed a draft from the books. The contractor opens a magic link, edits if needed, and confirms. The confirmed invoice is emailed to the client and stored as a PDF.

Repo: [LochsideLLC/UncleInvoice](https://github.com/LochsideLLC/UncleInvoice)  
Site: [uncleinvoice.com](https://uncleinvoice.com)

## Local setup

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo bookkeeper:

- Email: `ada@ledgerandco.test`
- Password: `demo1234`
- Client: Sunrise Cleaning Co.

There is no email provider in the default local setup. Review links and invoice emails are written to **Outbox** (`/app/outbox`) so you can copy them. To actually send mail, set `RESEND_API_KEY` in `.env`.

## Stack

- Next.js 16 (App Router)
- React 19
- Prisma + SQLite locally
- Netlify for deploys
- Cloudflare for DNS (`uncleinvoice.com`)

## Deploy (Netlify)

1. Import `LochsideLLC/UncleInvoice` in Netlify.
2. Build command and publish directory come from `netlify.toml`.
3. Set environment variables:

```
DATABASE_URL=
APP_URL=https://uncleinvoice.com
SESSION_SECRET=
RESEND_API_KEY=
MAIL_FROM=Uncle Invoice <noreply@uncleinvoice.com>
```

SQLite will not persist on Netlify. Use a hosted database URL in production (Neon, Turso, or similar) before going live.

## DNS (Cloudflare → Netlify)

After Netlify assigns the site:

- Apex `uncleinvoice.com`: CNAME flatten to the Netlify hostname (e.g. `something.netlify.app`). Proxy can stay DNS-only (grey cloud) to avoid SSL fights, or Cloudflare SSL mode **Full**.
- `www`: CNAME to the same Netlify hostname.

## CSV import

`contractor_name,contractor_email,date,amount,description`

Each row becomes a contractor (if new) and a draft invoice.
