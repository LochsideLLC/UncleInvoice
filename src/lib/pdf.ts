import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate } from "@/lib/dates";
import { formatMoney, invoiceTotal, lineTotal } from "@/lib/money";

type PdfInvoice = {
  number: string;
  issueDate: Date;
  serviceStart: Date | null;
  serviceEnd: Date | null;
  notes: string | null;
  confirmedAt: Date | null;
  confirmedByEmail: string | null;
  workspace: {
    name: string;
    email: string;
    phone: string | null;
    addressLine: string | null;
    city: string | null;
    region: string | null;
    postalCode: string | null;
  };
  contractor: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  lineItems: { description: string; quantity: number; unitPrice: number }[];
};

export async function buildInvoicePdf(invoice: PdfInvoice): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.11, 0.1, 0.09);
  const muted = rgb(0.34, 0.33, 0.31);
  const green = rgb(0.12, 0.42, 0.29);

  let y = 740;
  const left = 56;

  page.drawText("INVOICE", { x: left, y, size: 22, font: bold, color: ink });
  y -= 22;
  page.drawText(`Invoice ${invoice.number}`, { x: left, y, size: 11, font, color: muted });
  y -= 16;
  page.drawText(`Date ${formatDate(invoice.issueDate)}`, { x: left, y, size: 11, font, color: muted });
  if (invoice.serviceStart || invoice.serviceEnd) {
    y -= 16;
    page.drawText(
      `Service period ${formatDate(invoice.serviceStart)} – ${formatDate(invoice.serviceEnd)}`,
      { x: left, y, size: 11, font, color: muted },
    );
  }

  y -= 36;
  page.drawText("FROM", { x: left, y, size: 9, font: bold, color: muted });
  page.drawText("BILL TO", { x: 320, y, size: 9, font: bold, color: muted });
  y -= 16;
  page.drawText(invoice.contractor.name, { x: left, y, size: 12, font: bold, color: ink });
  page.drawText(invoice.workspace.name, { x: 320, y, size: 12, font: bold, color: ink });

  const fromLines = [invoice.contractor.email, invoice.contractor.phone].filter(Boolean);
  const toLines = [
    invoice.workspace.addressLine,
    [invoice.workspace.city, invoice.workspace.region, invoice.workspace.postalCode]
      .filter(Boolean)
      .join(", "),
    invoice.workspace.email,
    invoice.workspace.phone,
  ].filter(Boolean);

  const block = Math.max(fromLines.length, toLines.length);
  for (let i = 0; i < block; i += 1) {
    y -= 14;
    if (fromLines[i]) page.drawText(String(fromLines[i]), { x: left, y, size: 10, font, color: ink });
    if (toLines[i]) page.drawText(String(toLines[i]), { x: 320, y, size: 10, font, color: ink });
  }

  y -= 32;
  page.drawText("DESCRIPTION", { x: left, y, size: 9, font: bold, color: muted });
  page.drawText("QTY", { x: 360, y, size: 9, font: bold, color: muted });
  page.drawText("RATE", { x: 420, y, size: 9, font: bold, color: muted });
  page.drawText("AMOUNT", { x: 490, y, size: 9, font: bold, color: muted });
  y -= 8;
  page.drawLine({
    start: { x: left, y },
    end: { x: 556, y },
    thickness: 1,
    color: rgb(0.84, 0.83, 0.82),
  });

  for (const item of invoice.lineItems) {
    y -= 18;
    page.drawText(item.description.slice(0, 52), { x: left, y, size: 10, font, color: ink });
    page.drawText(String(item.quantity), { x: 360, y, size: 10, font, color: ink });
    page.drawText(formatMoney(item.unitPrice), { x: 420, y, size: 10, font, color: ink });
    page.drawText(formatMoney(lineTotal(item.quantity, item.unitPrice)), {
      x: 490,
      y,
      size: 10,
      font,
      color: ink,
    });
  }

  y -= 16;
  page.drawLine({
    start: { x: 360, y },
    end: { x: 556, y },
    thickness: 1,
    color: rgb(0.84, 0.83, 0.82),
  });
  y -= 20;
  const total = invoiceTotal(invoice.lineItems);
  page.drawText("Total", { x: 360, y, size: 12, font: bold, color: ink });
  page.drawText(formatMoney(total), { x: 490, y, size: 12, font: bold, color: ink });

  if (invoice.notes) {
    y -= 36;
    page.drawText("NOTES", { x: left, y, size: 9, font: bold, color: muted });
    y -= 16;
    page.drawText(invoice.notes.slice(0, 110), { x: left, y, size: 10, font, color: ink });
  }

  if (invoice.confirmedAt) {
    y -= 28;
    page.drawText(
      `Confirmed by ${invoice.confirmedByEmail ?? invoice.contractor.name} on ${formatDate(invoice.confirmedAt)}.`,
      { x: left, y, size: 9, font, color: green },
    );
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
