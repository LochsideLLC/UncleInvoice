"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/actions/auth";
import { ContinueWithGoogle } from "@/components/continue-with-google";
import { FormBanner } from "@/components/form-banner";

export function SignupForm({
  error,
  googleEnabled,
}: {
  error?: string;
  googleEnabled: boolean;
}) {
  const [state, action, pending] = useActionState(signupAction, null);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 pb-16">
      <h1 className="display text-3xl">Create your account</h1>
      <p className="mt-2 text-muted">
        Bookkeepers and business owners start here. Contractors usually arrive from a
        review link — no signup required.
      </p>
      <div className="paper mt-8 rounded-3xl p-6">
        {googleEnabled ? (
          <>
            <ContinueWithGoogle from="/signup" />
            <div className="relative my-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span className="relative z-10 bg-paper px-2">or</span>
              <span className="absolute inset-x-0 top-1/2 border-t border-line" />
            </div>
          </>
        ) : null}
        <form action={action} className="space-y-4">
          <FormBanner state={state ?? (error ? { error } : null)} />
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="btn btn-primary" name="intent" value="password" disabled={pending}>
              Create account
            </button>
            <button className="btn btn-secondary" name="intent" value="magic" disabled={pending}>
              Use a sign-in link instead
            </button>
          </div>
        </form>
      </div>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
