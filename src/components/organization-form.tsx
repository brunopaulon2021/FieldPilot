"use client";

import { useState } from "react";
import { createOrganization } from "@/app/onboarding/actions";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { slugifyOrganizationName } from "@/lib/auth/slug";

export function OrganizationForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  return (
    <form action={createOrganization} className="auth-form">
      <label>
        Nome da empresa
        <input
          name="name"
          value={name}
          onChange={(event) => {
            const nextName = event.target.value;
            setName(nextName);
            if (!slugEdited) setSlug(slugifyOrganizationName(nextName));
          }}
          autoComplete="organization"
          required
          minLength={2}
          maxLength={120}
        />
      </label>
      <label>
        Identificador
        <div className="slug-field"><span>fieldpilot.pt/</span><input name="slug" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(slugifyOrganizationName(event.target.value)); }} required minLength={2} maxLength={64} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></div>
      </label>
      <small className="field-hint">Será usado em ligações e convites. Pode alterar o nome da empresa depois.</small>
      <AuthSubmitButton>Criar empresa</AuthSubmitButton>
    </form>
  );
}
