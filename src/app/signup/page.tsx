import { SignupForm } from "@/components/signup-form";
import { googleAuthErrorMessage, googleConfigured } from "@/lib/google-oauth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <SignupForm
      error={googleAuthErrorMessage(error) ?? undefined}
      googleEnabled={googleConfigured()}
    />
  );
}
