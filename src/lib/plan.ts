export function isPaidPlan(plan?: string | null) {
  return plan === "paid";
}

export function showsUncleInvoiceMark(plan?: string | null) {
  return !isPaidPlan(plan);
}
