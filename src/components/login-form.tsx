"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { FormBanner } from "@/components/form-banner";
import { BrandMark } from "@/components/brand-mark";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8">
        <BrandMark />
      </div>
      <h1 className="display text-3xl">Sign in</h1>
      <p className="mt-2 text-muted">Use your password, or get a link in your email.</p>
      <div className="paper mt-8 rounded-3xl p-6">
        <form action={action} className="space-y-4">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <FormBanner state={state} />
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="btn btn-primary" name="intent" value="password" disabled={pending}>
              Sign in
            </button>
            <button className="btn btn-secondary" name="intent" value="magic" disabled={pending}>
              Email me a link
            </button>
          </div>
        </form>
      </div>
      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-ink underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
