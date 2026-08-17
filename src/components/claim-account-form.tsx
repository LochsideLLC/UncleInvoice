"use client";

import { useActionState } from "react";
import { setPasswordAction } from "@/actions/auth";
import { FormBanner } from "@/components/form-banner";

export function ClaimAccountForm({ email, name }: { email: string; name: string }) {
  const [state, action, pending] = useActionState(setPasswordAction, null);

  return (
    <form action={action} className="paper mt-5 space-y-4 rounded-3xl p-6">
      <FormBanner state={state} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="name" value={name} />
      <div className="field">
        <label htmlFor="password">Choose a password</label>
        <input id="password" name="password" type="password" minLength={8} required />
      </div>
      <button className="btn btn-primary" disabled={pending}>
        Create my login
      </button>
    </form>
  );
}
