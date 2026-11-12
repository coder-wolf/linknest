import type { ReactNode } from "react";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A detailed, theme-aware phone mockup used across the marketing site.
 * The screen content is rendered edge-to-edge under a status bar, camera
 * island and home indicator so previews feel like a real device.
 */
export function PhoneFrame({
  children,
  statusColor,
  aspect = "aspect-[393/852]",
  width = "w-[286px] sm:w-[302px]",
  compact = false,
  className,
}: {
  children: ReactNode;
  statusColor: string;
  aspect?: string;
  width?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto", width, className)}>
      <div
        aria-hidden
        className="absolute -bottom-6 left-1/2 -z-10 h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-2xl"
      />

      {/* Side buttons */}
      <span
        aria-hidden
        className={cn(
          "absolute -left-[3px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#6a6a73] via-[#1a1a1f] to-[#3c3c43]",
          compact ? "top-[12%] h-5" : "top-[13%] h-7",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute -left-[3px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#55555c] via-[#141418] to-[#35353b]",
          compact ? "top-[20%] h-8" : "top-[20%] h-10",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute -left-[3px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#55555c] via-[#141418] to-[#35353b]",
          compact ? "top-[28%] h-8" : "top-[28%] h-10",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute -right-[3px] w-[3px] rounded-r-[2px] bg-gradient-to-b from-[#6a6a73] via-[#1a1a1f] to-[#3c3c43]",
          compact ? "top-[23%] h-10" : "top-[23%] h-14",
        )}
      />

      {/* Titanium rail + black bezel */}
      <div className="relative rounded-[52px] bg-[linear-gradient(145deg,#77777f_0%,#1c1c20_16%,#08080a_48%,#2f2f35_82%,#0c0c0f_100%)] p-[2px] shadow-[0_55px_110px_-40px_rgba(23,22,15,0.7),0_18px_40px_-24px_rgba(0,0,0,0.7)] ring-1 ring-black/50">
        <div className="rounded-[50px] bg-[#050506] p-[8px] ring-1 ring-white/10">
          <div
            className={cn(
              "relative overflow-hidden rounded-[42px] bg-black ring-1 ring-black/80",
              aspect,
            )}
          >
            <div className="absolute inset-0">{children}</div>

            {/* Screen glare */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_16%,transparent_38%)] opacity-40 mix-blend-screen"
            />

            {/* Status bar */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between font-semibold",
                compact ? "px-5 pt-2 text-[8px]" : "px-6 pt-3 text-[10px]",
              )}
              style={{ color: statusColor }}
            >
              <span className="tracking-tight">9:41</span>
              <span className="flex items-center gap-1.5 opacity-90">
                <span className="flex items-end gap-[1.5px]" aria-hidden>
                  {[3, 5, 7, 9].map((height) => (
                    <span
                      key={height}
                      className="w-[2px] rounded-[1px] bg-current"
                      style={{ height }}
                    />
                  ))}
                </span>
                <Wifi className={compact ? "size-2.5" : "size-3"} strokeWidth={2.6} />
                <span
                  className={cn(
                    "relative rounded-[3px] border border-current",
                    compact ? "h-2 w-4" : "h-2.5 w-5",
                  )}
                  style={{ opacity: 0.75 }}
                  aria-hidden
                >
                  <span className="absolute inset-[1.5px] right-[4px] rounded-[1px] bg-current" />
                  <span
                    className="absolute -right-[2px] top-1/2 h-1 w-[2px] -translate-y-1/2 rounded-r-sm bg-current"
                    style={{ opacity: 0.7 }}
                  />
                </span>
              </span>
            </div>

            {/* Camera island */}
            <div
              className={cn(
                "absolute left-1/2 z-40 flex -translate-x-1/2 items-center justify-end rounded-full bg-black",
                compact ? "top-[7px] h-[20px] w-[66px] pr-1.5" : "top-[9px] h-[26px] w-[92px] pr-2",
              )}
            >
              <span
                className={cn(
                  "relative rounded-full bg-[#0a0f1c] ring-1 ring-white/15",
                  compact ? "size-[7px]" : "size-[9px]",
                )}
              >
                <span className="absolute inset-[20%] rounded-full bg-[#182a49]" />
                <span className="absolute left-[22%] top-[18%] size-[22%] rounded-full bg-[#7fd4ff]/70" />
              </span>
            </div>

            {/* Home indicator */}
            <div
              aria-hidden
              className="absolute bottom-[6px] left-1/2 z-30 h-[4px] w-[94px] -translate-x-1/2 rounded-full opacity-35"
              style={{ background: statusColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
