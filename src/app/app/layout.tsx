import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <div className="mx-auto w-full max-w-6xl px-6 pb-16">{children}</div>;
}
