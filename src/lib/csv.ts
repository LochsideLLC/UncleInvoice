import { parse } from "papaparse";
import { dollarsToCents } from "@/lib/money";

export type CsvPaymentRow = {
  contractorName: string;
  contractorEmail: string;
  date: string;
  amount: string;
  description: string;
};

export const CSV_TEMPLATE_HEADER =
  "contractor_name,contractor_email,date,amount,description";

export function parsePaymentCsv(text: string): CsvPaymentRow[] {
  const result = parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) =>
      header.trim().toLowerCase().replaceAll(" ", "_").replaceAll("-", "_"),
  });

  if (result.errors.length) {
    const first = result.errors[0];
    throw new Error(`Could not read the spreadsheet: ${first.message}`);
  }

  return result.data
    .map((row) => ({
      contractorName: (row.contractor_name ?? row.name ?? "").trim(),
      contractorEmail: (row.contractor_email ?? row.email ?? "").trim().toLowerCase(),
      date: (row.date ?? row.issue_date ?? "").trim(),
      amount: (row.amount ?? row.total ?? "").trim(),
      description: (row.description ?? row.memo ?? "Services").trim(),
    }))
    .filter((row) => row.contractorName && row.amount);
}

export function csvRowToCents(amount: string): number {
  const cents = dollarsToCents(amount);
  if (cents <= 0) {
    throw new Error(`Amount "${amount}" is not a valid dollar amount.`);
  }
  return cents;
}
