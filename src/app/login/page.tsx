import { LoginForm } from "@/components/login-form";
import { googleAuthErrorMessage, googleConfigured } from "@/lib/google-oauth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <LoginForm
      next={next ?? ""}
      error={googleAuthErrorMessage(error) ?? undefined}
      googleEnabled={googleConfigured()}
    />
  );
}
