"use client";

import { useFormStatus } from "react-dom";

export function AuthSubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button className="button auth-submit" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "A processar…" : children}
    </button>
  );
}
