import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";

const db = new PrismaClient();
const base = "http://localhost:3000";

function token() {
  return randomBytes(32).toString("hex");
}
function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function get(path, cookie) {
  const res = await fetch(`${base}${path}`, {
    redirect: "manual",
    headers: cookie ? { cookie } : {},
  });
  const text = await res.text();
  return { status: res.status, location: res.headers.get("location"), text };
}

async function main() {
  const user = await db.user.findUniqueOrThrow({
    where: { email: "ada@ledgerandco.test" },
  });
  const sessionToken = token();
  await db.session.create({
    data: {
      userId: user.id,
      tokenHash: hash(sessionToken),
      expiresAt: new Date(Date.now() + 86400000),
    },
  });
  const cookie = `ir_session=${sessionToken}`;

  const app = await get("/app", cookie);
  if (app.status !== 200 || !app.text.includes("Sunrise Cleaning")) {
    throw new Error(`Dashboard failed: ${app.status}`);
  }

  const workspace = await get("/app/w/demo-sunrise", cookie);
  if (workspace.status !== 200 || !workspace.text.includes("Seed an invoice")) {
    throw new Error(`Workspace failed: ${workspace.status}`);
  }

  const invoice = await db.invoice.findFirstOrThrow({
    where: { workspaceId: "demo-sunrise", number: "INV-0001" },
    include: { contractor: true },
  });
  const reviewToken = token();
  await db.magicLink.create({
    data: {
      tokenHash: hash(reviewToken),
      purpose: "invoice_review",
      email: invoice.contractor.email,
      invoiceId: invoice.id,
      expiresAt: new Date(Date.now() + 86400000),
    },
  });

  const review = await get(`/review/${reviewToken}`);
  if (review.status !== 200 || !review.text.includes("does this look right")) {
    throw new Error(`Review page failed: ${review.status}`);
  }
  if (!review.text.includes("Lincoln Park")) {
    throw new Error("Review page missing seeded line item");
  }

  const pdf = await get(`/api/invoices/${invoice.id}/pdf?token=${reviewToken}`);
  if (pdf.status !== 200 || !pdf.text.startsWith("%PDF")) {
    throw new Error(`PDF failed: ${pdf.status}`);
  }

  const extra = [
    ["/app/w/demo-sunrise/import", "contractor_name"],
    ["/app/w/demo-sunrise/contractors", "Add a contractor"],
    ["/app/w/demo-sunrise/invoices", "INV-0001"],
    [`/app/w/demo-sunrise/invoices/${invoice.id}`, "Get this confirmed"],
    ["/app/w/demo-sunrise/invoices/new", "Seed an invoice"],
    ["/app/outbox", "Outbox"],
    ["/", "They just confirm it"],
  ];
  for (const [path, needle] of extra) {
    const page = await get(path, cookie);
    if (page.status !== 200 || !page.text.includes(needle)) {
      throw new Error(`${path} failed (${page.status})`);
    }
  }

  console.log("OK landing, auth gate, dashboard, workspace, review, PDF, import, invoices, outbox");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
