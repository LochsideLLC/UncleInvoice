import { db } from "@/lib/db";

export async function listSponsors() {
  const all = await db.sponsor.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  return {
    featured: all.filter((item) => item.featured),
    rest: all.filter((item) => !item.featured),
  };
}

export async function getSponsorBySlug(slug: string) {
  return db.sponsor.findUnique({ where: { slug } });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function hrefFor(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}
