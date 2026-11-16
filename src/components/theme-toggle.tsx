"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    root.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("linknest-theme", next ? "dark" : "light");
    } catch {
      // Storage can be unavailable in private browsing; the class still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:bg-surface-muted hover:text-foreground",
        className,
      )}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}
