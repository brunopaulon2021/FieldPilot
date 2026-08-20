"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { isThemePreference, nextThemePreference, type ThemePreference } from "@/lib/theme";

const labels: Record<ThemePreference, string> = {
  system: "Tema do sistema",
  light: "Tema claro",
  dark: "Tema escuro",
};

function applyTheme(preference: ThemePreference) {
  const resolved = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem("fieldpilot-theme");
    const initial = isThemePreference(stored) ? stored : "system";
    queueMicrotask(() => setPreference(initial));
    applyTheme(initial);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = window.localStorage.getItem("fieldpilot-theme");
      if (!isThemePreference(current) || current === "system") applyTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const Icon = preference === "dark" ? Moon : preference === "light" ? Sun : Laptop;

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`${labels[preference]}. Alterar tema.`}
      title={labels[preference]}
      onClick={() => {
        const next = nextThemePreference(preference);
        window.localStorage.setItem("fieldpilot-theme", next);
        setPreference(next);
        applyTheme(next);
      }}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}
