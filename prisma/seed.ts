import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const bookkeeper = await db.user.upsert({
    where: { email: "ada@ledgerandco.test" },
    update: { passwordHash, name: "Ada Mensah", admin: true },
    create: {
      email: "ada@ledgerandco.test",
      name: "Ada Mensah",
      passwordHash,
      admin: true,
    },
  });

  const workspace = await db.workspace.upsert({
    where: { id: "demo-sunrise" },
    update: {},
    create: {
      id: "demo-sunrise",
      name: "Sunrise Cleaning Co.",
      email: "office@sunrisecleaning.test",
      phone: "(312) 555-0144",
      addressLine: "1840 W Lake St",
      city: "Chicago",
      region: "IL",
      postalCode: "60612",
      invoicePrefix: "INV",
      nextInvoiceNumber: 4,
      createdById: bookkeeper.id,
    },
  });

  await db.workspaceMember.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace.id, userId: bookkeeper.id },
    },
    update: { role: "bookkeeper" },
    create: {
      workspaceId: workspace.id,
      userId: bookkeeper.id,
      role: "bookkeeper",
    },
  });

  const maria = await db.contractor.upsert({
    where: { id: "demo-maria" },
    update: {},
    create: {
      id: "demo-maria",
      workspaceId: workspace.id,
      name: "Maria Lopez",
      email: "maria.lopez@example.test",
      phone: "(312) 555-0198",
    },
  });
  const james = await db.contractor.upsert({
    where: { id: "demo-james" },
    update: {},
    create: {
      id: "demo-james",
      workspaceId: workspace.id,
      name: "James Okonkwo",
      email: "james.okonkwo@example.test",
      phone: "(773) 555-0112",
    },
  });
  await db.contractor.upsert({
    where: { id: "demo-aisha" },
    update: {},
    create: {
      id: "demo-aisha",
      workspaceId: workspace.id,
      name: "Aisha Patel",
      email: "aisha.patel@example.test",
    },
  });

  await db.invoice.deleteMany({ where: { workspaceId: workspace.id } });

  const march = await db.invoice.create({
    data: {
      workspaceId: workspace.id,
      contractorId: maria.id,
      number: "INV-0001",
      status: "awaiting_review",
      issueDate: new Date("2026-03-31T12:00:00"),
      serviceStart: new Date("2026-03-01T12:00:00"),
      serviceEnd: new Date("2026-03-31T12:00:00"),
      notes: "Weekly cleans at the Lincoln Park units.",
      seededByUserId: bookkeeper.id,
      lineItems: {
        create: [
          {
            description: "Unit cleaning — Lincoln Park (8 visits)",
            quantity: 8,
            unitPrice: 7500,
            sortOrder: 0,
          },
        ],
      },
      events: {
        create: {
          type: "seeded",
          actorEmail: bookkeeper.email,
          actorName: bookkeeper.name,
          message: "Seeded from March check register ($600 paid 3/28).",
        },
      },
    },
  });

  await db.invoice.create({
    data: {
      workspaceId: workspace.id,
      contractorId: james.id,
      number: "INV-0002",
      status: "confirmed",
      issueDate: new Date("2026-03-31T12:00:00"),
      serviceStart: new Date("2026-03-01T12:00:00"),
      serviceEnd: new Date("2026-03-31T12:00:00"),
      seededByUserId: bookkeeper.id,
      confirmedAt: new Date("2026-04-02T15:00:00"),
      confirmedByEmail: james.email,
      lineItems: {
        create: [
          {
            description: "Deep clean — Wicker Park loft",
            quantity: 2,
            unitPrice: 18000,
            sortOrder: 0,
          },
        ],
      },
      events: {
        create: [
          {
            type: "seeded",
            actorEmail: bookkeeper.email,
            actorName: bookkeeper.name,
            message: "Seeded from job log and $360 check dated 3/22.",
          },
          {
            type: "confirmed",
            actorEmail: james.email,
            actorName: james.name,
            message: "Contractor confirmed the invoice as accurate.",
          },
        ],
      },
    },
  });

  await db.invoice.create({
    data: {
      workspaceId: workspace.id,
      contractorId: maria.id,
      number: "INV-0003",
      status: "draft",
      issueDate: new Date("2026-04-15T12:00:00"),
      serviceStart: new Date("2026-04-01T12:00:00"),
      serviceEnd: new Date("2026-04-15T12:00:00"),
      seededByUserId: bookkeeper.id,
      internalNote: "Check #4418 for $225. Waiting to send until we confirm the unit count.",
      lineItems: {
        create: [
          {
            description: "Unit cleaning — South Loop",
            quantity: 3,
            unitPrice: 7500,
            sortOrder: 0,
          },
        ],
      },
      events: {
        create: {
          type: "seeded",
          actorEmail: bookkeeper.email,
          actorName: bookkeeper.name,
          message: "Draft seeded from April mid-month payments.",
        },
      },
    },
  });

  await db.sponsor.upsert({
    where: { slug: "bookkeeping-conroe" },
    update: {},
    create: {
      slug: "bookkeeping-conroe",
      name: "Bookkeeping Conroe",
      tagline: "Monthly books, so the close is not a fire drill.",
      about:
        "Bookkeeping Conroe handles reconciliations, QuickBooks, and monthly reporting for businesses in Conroe and the Woodlands. We already know what the invoices should say — that’s why we built Uncle Invoice.",
      url: "https://www.bookkeepingconroe.com",
      email: "hello@bookkeepingconroe.com",
      phone: "(936) 283-4346",
      city: "Conroe, TX",
      featured: true,
      sortOrder: 0,
    },
  });
  await db.sponsor.upsert({
    where: { slug: "southwest-digital" },
    update: {},
    create: {
      slug: "southwest-digital",
      name: "Southwest Digital",
      tagline: "Sites, ads, and the kind of marketing that pays for itself.",
      about:
        "Southwest Digital is the marketing arm next door: websites, Google Ads, and SEO for businesses that need the phone to ring. Uncle Invoice is one of the tools we put in front of clients.",
      url: "https://southwestdigital.io",
      email: "hello@southwestdigital.io",
      phone: "(936) 283-4346",
      city: "Conroe, TX",
      featured: true,
      sortOrder: 1,
    },
  });

  console.log("Seeded Uncle Invoice demo.");
  console.log("  Bookkeeper: ada@ledgerandco.test / demo1234");
  console.log("  Client: Sunrise Cleaning Co.");
  console.log(`  Review sample invoice: /app/w/${workspace.id}/invoices/${march.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
