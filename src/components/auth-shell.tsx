import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link className="brand" href="/" aria-label="FieldPilot, início">
          <span className="brand-mark" aria-hidden="true"><MapPin size={17} /></span>
          FieldPilot
        </Link>
        <ThemeToggle />
      </header>
      <section className="auth-layout">
        <div className="auth-context">
          <span className="auth-context-icon"><ShieldCheck size={22} /></span>
          <p>Operações de campo organizadas com dados separados por empresa e permissões por função.</p>
        </div>
        {children}
      </section>
    </main>
  );
}
