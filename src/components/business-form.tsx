"use client";

import { useActionState, useState } from "react";
import {
  removeBusinessLogoAction,
  updateBusinessAction,
  updateBusinessLogoAction,
  updateBusinessLogoKindAction,
} from "@/actions/account";
import { FormBanner } from "@/components/form-banner";
import { ImageDropzone, fileToDataUrl } from "@/components/image-dropzone";
import { formatUsPhone, US_STATES } from "@/lib/us-address";

export function BusinessForm({
  businessName,
  businessEmail,
  businessLogoUrl,
  businessWordmarkUrl,
  businessLogoKind = "mark",
  phone,
  addressLine,
  addressLine2,
  city,
  region,
  postalCode,
}: {
  businessName?: string | null;
  businessEmail?: string | null;
  businessLogoUrl?: string | null;
  businessWordmarkUrl?: string | null;
  businessLogoKind?: string | null;
  phone?: string | null;
  addressLine?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
}) {
  const [state, action, pending] = useActionState(updateBusinessAction, null);
  const [logoState, logoAction, logoPending] = useActionState(updateBusinessLogoAction, null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [kind, setKind] = useState(businessLogoKind === "wide" ? "wide" : "mark");
  const [phoneValue, setPhoneValue] = useState(formatUsPhone(phone ?? ""));

  async function onLogoFile(which: "mark" | "wide", file: File) {
    setLogoError(null);
    if (!file.type.startsWith("image/")) {
      setLogoError("Choose a JPG or PNG logo.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      const form = new FormData();
      form.set("logoUrl", dataUrl);
      form.set("kind", which);
      logoAction(form);
      setKind(which);
    } catch {
      setLogoError("Could not read that image. Try a JPG or PNG.");
    }
  }

  function pickKind(next: "mark" | "wide") {
    setKind(next);
    void updateBusinessLogoKindAction(next);
  }

  return (
    <form action={action} className="paper compact-fields space-y-1 rounded-3xl p-6">
      <div>
        <h2 className="text-xl">Who gets paid</h2>
        <p className="mt-1 text-sm text-muted">
          This is the name and contact on the invoice. Use your name, or a company name
          if you have one.
        </p>
      </div>
      <FormBanner state={logoError ? { error: logoError } : logoState ?? state} />
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3">
        <ImageDropzone
          label="Mark"
          hint="Square"
          variant="square"
          value={businessLogoUrl}
          pending={logoPending}
          onFile={(file) => onLogoFile("mark", file)}
          onRemove={
            businessLogoUrl
              ? () => {
                  const form = new FormData();
                  form.set("kind", "mark");
                  void removeBusinessLogoAction(form);
                }
              : undefined
          }
        />
        <ImageDropzone
          label="Wide logo"
          hint="Drop a horizontal logo"
          variant="wide"
          value={businessWordmarkUrl}
          pending={logoPending}
          onFile={(file) => onLogoFile("wide", file)}
          onRemove={
            businessWordmarkUrl
              ? () => {
                  const form = new FormData();
                  form.set("kind", "wide");
                  void removeBusinessLogoAction(form);
                }
              : undefined
          }
        />
      </div>
      <fieldset className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Use on invoices
        </legend>
        <label className="inline-flex items-center gap-1.5">
          <input
            type="radio"
            name="businessLogoKind"
            value="mark"
            checked={kind === "mark"}
            onChange={() => pickKind("mark")}
          />
          Square mark
        </label>
        <label className="inline-flex items-center gap-1.5">
          <input
            type="radio"
            name="businessLogoKind"
            value="wide"
            checked={kind === "wide"}
            onChange={() => pickKind("wide")}
          />
          Wide logo
        </label>
      </fieldset>
      <div className="field">
        <label htmlFor="businessName">Name or company</label>
        <input
          id="businessName"
          name="businessName"
          defaultValue={businessName ?? ""}
          autoComplete="organization"
          placeholder="Who should they write the check to?"
        />
      </div>
      <div className="field">
        <label htmlFor="businessEmail">Email</label>
        <input
          id="businessEmail"
          name="businessEmail"
          type="email"
          defaultValue={businessEmail ?? ""}
          autoComplete="email"
          placeholder="Where they can write you back"
        />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phoneValue}
          onChange={(event) => setPhoneValue(formatUsPhone(event.target.value))}
          placeholder="(555) 555-5555"
        />
      </div>
      <div className="field">
        <label htmlFor="addressLine">Address</label>
        <input
          id="addressLine"
          name="addressLine"
          defaultValue={addressLine ?? ""}
          autoComplete="address-line1"
          placeholder="123 Main St"
        />
      </div>
      <div className="field">
        <label htmlFor="addressLine2">Apt, suite, etc.</label>
        <input
          id="addressLine2"
          name="addressLine2"
          defaultValue={addressLine2 ?? ""}
          autoComplete="address-line2"
          placeholder="Suite 200"
        />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_6.5rem] gap-1.5">
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            defaultValue={city ?? ""}
            autoComplete="address-level2"
            placeholder="Houston"
          />
        </div>
        <div className="field">
          <label htmlFor="region">State</label>
          <select id="region" name="region" defaultValue={region ?? ""} autoComplete="address-level1">
            <option value="">ST</option>
            {US_STATES.map(([code, stateName]) => (
              <option key={code} value={code} title={stateName}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="postalCode">ZIP</label>
          <input
            id="postalCode"
            name="postalCode"
            defaultValue={postalCode ?? ""}
            autoComplete="postal-code"
            inputMode="numeric"
            placeholder="12345"
          />
        </div>
      </div>
      <div className="pt-3">
        <button className="btn btn-primary w-full" disabled={pending}>
          Save
        </button>
      </div>
    </form>
  );
}
