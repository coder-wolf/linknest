import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl bg-ink text-white",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M9.5 14.5 14.5 9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.2 16.9 6.6 18.5a3.6 3.6 0 0 1-5.1-5.1l3.2-3.2a3.6 3.6 0 0 1 5.1 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform="translate(3 -1)"
        />
        <path
          d="M15.8 7.1l1.6-1.6a3.6 3.6 0 0 1 5.1 5.1l-3.2 3.2a3.6 3.6 0 0 1-5.1 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform="translate(-3 1)"
        />
      </svg>
    </span>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">LinkNest</span>
    </Link>
  );
}
