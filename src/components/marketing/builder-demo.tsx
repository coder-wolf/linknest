"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Link2,
  Minus,
  MousePointerClick,
  Share2,
  Type,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ProfileCanvas, type CanvasWidget } from "@/components/profile-canvas";
import { PhoneFrame } from "@/components/marketing/phone-frame";
import { THEME_PRESETS } from "@/lib/themes";
import { DEFAULT_WIDGET_CONFIGS, type WidgetConfig, type WidgetType } from "@/lib/widgets";
import { cn } from "@/lib/utils";

type DemoItem = {
  key: WidgetType;
  label: string;
  icon: LucideIcon;
  visible: boolean;
};

const INITIAL: DemoItem[] = [
  { key: "header", label: "Profile header", icon: UserRound, visible: true },
  { key: "socials", label: "Social icons", icon: Share2, visible: true },
  { key: "text", label: "Text block", icon: Type, visible: false },
  { key: "links", label: "Links", icon: Link2, visible: true },
  { key: "button", label: "Call to action", icon: MousePointerClick, visible: true },
  { key: "divider", label: "Divider", icon: Minus, visible: false },
];

const CONFIGS: Record<WidgetType, WidgetConfig> = {
  ...DEFAULT_WIDGET_CONFIGS,
  links: { layout: "stack", showDescriptions: false, showIcons: true },
  text: {
    heading: "In the studio",
    body: "Lisbon · open for two commissions this month.",
    align: "center",
  },
  button: { label: "Book a commission", url: "https://example.com/commissions" },
};

const sampleLinks = [
  { title: "Latest print drop", description: "Six new risograph pieces" },
  { title: "Portfolio & case studies", description: "Selected client work" },
];

const sampleSocials = [
  { platform: "instagram" },
  { platform: "x" },
  { platform: "youtube" },
  { platform: "spotify" },
];

export function BuilderDemo() {
  const [items, setItems] = useState(INITIAL);
  const [dragKey, setDragKey] = useState<WidgetType | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function dropOn(targetKey: WidgetType) {
    if (!dragKey || dragKey === targetKey) return;
    const from = items.findIndex((item) => item.key === dragKey);
    const to = items.findIndex((item) => item.key === targetKey);
    setDragKey(null);
    if (from !== -1) move(from, to);
  }

  function toggle(key: WidgetType) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, visible: !item.visible } : item)),
    );
  }

  const widgets: CanvasWidget[] = items
    .filter((item) => item.visible)
    .map((item) => ({
      id: `demo-${item.key}`,
      type: item.key,
      config: CONFIGS[item.key],
    }));

  const visibleCount = items.filter((item) => item.visible).length;

  return (
    <div className="relative rounded-[30px] border border-white/12 bg-white/[0.06] p-3 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_262px] sm:items-center">
        <div className="rounded-2xl border border-black/5 bg-[#fbfaf6] p-3.5 text-foreground shadow-xl sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold">Page layout</p>
              <p className="text-[10px] text-muted">Drag rows, toggle what shows.</p>
            </div>
            <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] font-medium text-muted">
              {visibleCount} widgets
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            {items.map((item, index) => {
              const Icon = item.icon;
              const dragging = dragKey === item.key;
              return (
                <div
                  key={item.key}
                  draggable
                  onDragStart={() => setDragKey(item.key)}
                  onDragEnd={() => setDragKey(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    dropOn(item.key);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border bg-white px-2 py-2 transition",
                    dragging
                      ? "border-ink/30 opacity-50 shadow-lg"
                      : "border-border/80 hover:border-ink/20",
                    !item.visible && "bg-surface-muted/60",
                  )}
                >
                  <GripVertical className="size-3.5 shrink-0 cursor-grab text-muted/70" />
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                    <Icon className="size-3.5" />
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[11px] font-medium",
                      !item.visible && "text-muted line-through",
                    )}
                  >
                    {item.label}
                  </span>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                      className="rounded p-1 text-muted transition hover:bg-surface-muted hover:text-foreground disabled:opacity-25"
                      aria-label={`Move ${item.label} up`}
                    >
                      <ChevronUp className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="rounded p-1 text-muted transition hover:bg-surface-muted hover:text-foreground disabled:opacity-25"
                      aria-label={`Move ${item.label} down`}
                    >
                      <ChevronDown className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(item.key)}
                      className="rounded p-1 text-muted transition hover:bg-surface-muted hover:text-foreground"
                      aria-label={item.visible ? `Hide ${item.label}` : `Show ${item.label}`}
                      aria-pressed={item.visible}
                    >
                      {item.visible ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto w-[250px]">
          <PhoneFrame
            width="w-[250px]"
            compact
            statusColor={THEME_PRESETS.gradient.theme.textColor}
          >
            <ProfileCanvas
              profile={{
                displayName: "Mima Sánchez",
                username: "mima",
                bio: "Illustrator in Lisbon.",
              }}
              links={sampleLinks}
              socials={sampleSocials}
              widgets={widgets}
              theme={THEME_PRESETS.gradient.theme}
              showBranding={false}
              interactive={false}
              compact
              fullBleed
              safeArea
              className="h-full min-h-full"
            />
          </PhoneFrame>
          <p className="mt-2.5 text-center text-[10px] text-white/50">
            Live preview · updates instantly
          </p>
        </div>
      </div>
    </div>
  );
}
