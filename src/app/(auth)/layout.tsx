import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div className="absolute -left-24 top-24 size-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-20 right-0 size-80 rounded-full bg-[#7c5cff]/20 blur-3xl" />

        <Logo className="relative z-10 [&_span:last-child]:text-white" />

        <div className="relative z-10 max-w-md">
          <p className="font-serif text-4xl leading-tight">
            &ldquo;One link for everything I make. It finally feels like mine.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              MS
            </span>
            <div>
              <p className="text-sm font-medium">Mima Sánchez</p>
              <p className="text-sm text-white/60">Illustrator · 12.4k followers</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-sm text-white/60">
          <span>Free forever plan</span>
          <span>·</span>
          <span>No credit card</span>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-5 py-5 lg:hidden">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            Back home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-12 pt-4 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
