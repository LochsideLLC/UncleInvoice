export const CLIENT_TERMS = [
  "clients",
  "customers",
  "donors",
  "patients",
  "members",
  "partners",
  "students",
  "tenants",
  "accounts",
] as const;

export type ClientTerm = (typeof CLIENT_TERMS)[number];
