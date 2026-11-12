"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Link2,
  Minus,
  MousePointerClick,
  Music2,
  Pencil,
  Plus,
  Share2,
  Sparkles,
  Trash2,
  Type,
  UserRound,
  Video,
} from "lucide-react";
import {
  ProfileCanvas,
  type CanvasLink,
  type CanvasSocial,
  type CanvasWidget,
} from "@/components/profile-canvas";
import { PhoneFrame } from "@/components/phone-frame";
import { Button } from "@/components/ui/button";
import { Alert, Badge, Card, CardBody, CardHeader, EmptyState } from "@/components/ui/card";
import { FieldHint, Input, Label, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/themes";
import {
  parseWidgetConfig,
  WIDGET_META,
  WIDGET_TYPES,
  widgetSummary,
  type WidgetConfigMap,
  type WidgetType,
} from "@/lib/widgets";
import {
  addWidgetAction,
  createStarterWidgetsAction,
  deleteWidgetAction,
  reorderWidgetsAction,
  toggleWidgetAction,
  updateWidgetAction,
  type WidgetState,
} from "./actions";

export type ManagedWidget = {
  id: string;
  type: WidgetType;
  position: number;
  isVisible: boolean;
  config: unknown;
};

const WIDGET_ICONS: Record<WidgetType, LucideIcon> = {
  header: UserRound,
  links: Link2,
  socials: Share2,
  text: Type,
  image: ImageIcon,
  video: Video,
  music: Music2,
  button: MousePointerClick,
  divider: Minus,
};

const initialState: WidgetState = {};

export function WidgetManager({
  widgets,
  profile,
  links,
  socials,
  theme,
  plan,
}: {
  widgets: ManagedWidget[];
  profile: {
    displayName: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    isPublished: boolean;
  };
  links: CanvasLink[];
  socials: CanvasSocial[];
  theme: Theme;
  plan: string;
}) {
  const [order, setOrder] = useState(widgets.map((widget) => widget.id));
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [addState, addAction] = useActionState(addWidgetAction, initialState);

  const widgetMap = useMemo(
    () => new Map(widgets.map((widget) => [widget.id, widget])),
    [widgets],
  );

  const serverIds = widgets.map((widget) => widget.id);
  const orderedIds = [
    ...order.filter((id) => serverIds.includes(id)),
    ...serverIds.filter((id) => !order.includes(id)),
  ];
  const ordered = orderedIds
    .map((id) => widgetMap.get(id))
    .filter((widget): widget is ManagedWidget => Boolean(widget));

  const canvasWidgets: CanvasWidget[] = ordered.map((widget) => ({
    id: widget.id,
    type: widget.type,
    isVisible: widget.isVisible,
    config: widget.config,
  }));

  function persistOrder(nextIds: string[]) {
    setOrder(nextIds);
    startTransition(async () => {
      await reorderWidgetsAction(nextIds);
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...orderedIds];
    const from = next.indexOf(dragId);
    const to = next.indexOf(targetId);
    if (from === -1 || to === -1) return;
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    setDragId(null);
    persistOrder(next);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Add a widget</h2>
            <p className="text-xs text-muted">
              Stack sections to build your page. Drag the handles to reorder — the public page
              updates instantly.
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            {addState.error ? <Alert tone="error">{addState.error}</Alert> : null}
            {addState.success ? <Alert tone="success">{addState.success}</Alert> : null}

            <AddWidgetGrid action={addAction} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Page layout</h2>
              <p className="text-xs text-muted">
                Drag to reorder, or use the arrows. Hidden widgets stay in the list but not on your
                page.
              </p>
            </div>
            <Badge>{widgets.length} widgets</Badge>
          </CardHeader>
          <CardBody className="space-y-2">
            {ordered.length === 0 ? (
              <EmptyState
                title="Your page is empty"
                description="Start with the classic profile, socials and links layout, then add anything else."
                action={
                  <form action={createStarterWidgetsAction}>
                    <SubmitButton size="sm" pendingLabel="Building…">
                      <Sparkles className="size-3.5" /> Generate starter layout
                    </SubmitButton>
                  </form>
                }
              />
            ) : (
              ordered.map((widget, index) => (
                <WidgetRow
                  key={widget.id}
                  widget={widget}
                  index={index}
                  total={ordered.length}
                  dragging={dragId === widget.id}
                  onDragStart={() => setDragId(widget.id)}
                  onDragEnd={() => setDragId(null)}
                  onDrop={() => handleDrop(widget.id)}
                  onMove={move}
                />
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <div className="xl:sticky xl:top-24">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Live preview</p>
          <span className="text-xs text-muted">
            {profile.isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <PhoneFrame width="w-full max-w-[340px]" statusColor={theme.textColor}>
          <div className="no-scrollbar h-full overflow-y-auto">
            <ProfileCanvas
              profile={{
                displayName: profile.displayName,
                username: profile.username,
                bio: profile.bio,
                avatarUrl: profile.avatarUrl,
              }}
              links={links}
              socials={socials}
              widgets={canvasWidgets}
              theme={theme}
              showBranding={plan === "FREE"}
              interactive={false}
              compact
              safeArea
              className="min-h-full"
            />
          </div>
        </PhoneFrame>
        <p className="mt-3 text-center text-xs text-muted">
          Preview only — links are not clickable here.
        </p>
      </div>
    </div>
  );
}

function AddWidgetGrid({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {WIDGET_TYPES.map((type) => {
        const Icon = WIDGET_ICONS[type];
        return (
          <AddWidgetButton key={type} type={type}>
            <Icon className="size-4" />
            <span className="text-left text-xs font-medium leading-tight">
              {WIDGET_META[type].label}
            </span>
          </AddWidgetButton>
        );
      })}
    </form>
  );
}

function AddWidgetButton({ type, children }: { type: WidgetType; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="type"
      value={type}
      disabled={pending}
      className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-foreground transition hover:border-ink/25 hover:bg-surface-muted disabled:opacity-50"
    >
      {children}
      <Plus className="ml-auto size-3.5 shrink-0 text-muted" />
    </button>
  );
}

function WidgetRow({
  widget,
  index,
  total,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
}: {
  widget: ManagedWidget;
  index: number;
  total: number;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<WidgetState>({});
  const [pending, startTransition] = useTransition();
  const Icon = WIDGET_ICONS[widget.type];

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateWidgetAction(state, formData);
      setState(result);
      if (result.success) setEditing(false);
    });
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      className={cn(
        "rounded-xl border border-border bg-surface transition",
        dragging && "opacity-50",
        !widget.isVisible && "bg-surface-muted/50",
      )}
    >
      <div className="flex items-center gap-2 px-2.5 py-2.5 sm:gap-3">
        <GripVertical className="size-4 shrink-0 cursor-grab text-muted" />

        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="rounded p-0.5 text-muted hover:bg-surface-muted disabled:opacity-30"
            aria-label="Move widget up"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="rounded p-0.5 text-muted hover:bg-surface-muted disabled:opacity-30"
            aria-label="Move widget down"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted">
          <Icon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{WIDGET_META[widget.type].label}</p>
            {!widget.isVisible ? <Badge>Hidden</Badge> : null}
          </div>
          <p className="truncate text-xs text-muted">{widgetSummary(widget.type, widget.config)}</p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <form action={toggleWidgetAction}>
            <input type="hidden" name="widgetId" value={widget.id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
              aria-label={widget.isVisible ? "Hide widget" : "Show widget"}
            >
              {widget.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setState({});
              setEditing((value) => !value);
            }}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Edit widget"
          >
            <Pencil className="size-4" />
          </button>
          <form
            action={deleteWidgetAction}
            onSubmit={(event) => {
              if (!window.confirm(`Remove the ${WIDGET_META[widget.type].label.toLowerCase()}?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="widgetId" value={widget.id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
              aria-label="Delete widget"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </div>
      </div>

      {editing ? (
        <form action={handleUpdate} className="space-y-3 border-t border-border px-3.5 py-4">
          <input type="hidden" name="widgetId" value={widget.id} />
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state.success ? <Alert tone="success">{state.success}</Alert> : null}

          <WidgetFields widget={widget} />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Saving…" : "Save widget"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function WidgetFields({ widget }: { widget: ManagedWidget }) {
  switch (widget.type) {
    case "header": {
      const config = parseWidgetConfig("header", widget.config);
      return (
        <>
          <div>
            <Label htmlFor={`align-${widget.id}`}>Alignment</Label>
            <Select id={`align-${widget.id}`} name="align" defaultValue={config.align}>
              <option value="center">Centered</option>
              <option value="left">Left aligned</option>
            </Select>
          </div>
          <Checkbox name="showAvatar" label="Show avatar" defaultChecked={config.showAvatar} />
          <Checkbox name="showUsername" label="Show @handle" defaultChecked={config.showUsername} />
          <Checkbox name="showBio" label="Show bio" defaultChecked={config.showBio} />
        </>
      );
    }
    case "links": {
      const config = parseWidgetConfig("links", widget.config);
      return (
        <>
          <div>
            <Label htmlFor={`layout-${widget.id}`}>Layout</Label>
            <Select id={`layout-${widget.id}`} name="layout" defaultValue={config.layout}>
              <option value="stack">Stacked buttons</option>
              <option value="grid">Two-column grid</option>
            </Select>
          </div>
          <Checkbox
            name="showDescriptions"
            label="Show descriptions"
            defaultChecked={config.showDescriptions}
          />
          <Checkbox name="showIcons" label="Show icons" defaultChecked={config.showIcons} />
          <FieldHint>Manage the links themselves on the My links page.</FieldHint>
        </>
      );
    }
    case "socials": {
      const config = parseWidgetConfig("socials", widget.config);
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`style-${widget.id}`}>Style</Label>
            <Select id={`style-${widget.id}`} name="style" defaultValue={config.style}>
              <option value="icons">Icon row</option>
              <option value="pills">Labelled pills</option>
            </Select>
          </div>
          <div>
            <Label htmlFor={`align-${widget.id}`}>Alignment</Label>
            <Select id={`align-${widget.id}`} name="align" defaultValue={config.align}>
              <option value="center">Centered</option>
              <option value="left">Left aligned</option>
            </Select>
          </div>
        </div>
      );
    }
    case "text": {
      const config = parseWidgetConfig("text", widget.config);
      return (
        <>
          <div>
            <Label htmlFor={`heading-${widget.id}`}>Heading</Label>
            <Input
              id={`heading-${widget.id}`}
              name="heading"
              defaultValue={config.heading}
              maxLength={80}
              placeholder="A little about me"
            />
          </div>
          <div>
            <Label htmlFor={`body-${widget.id}`}>Body</Label>
            <Textarea
              id={`body-${widget.id}`}
              name="body"
              defaultValue={config.body}
              rows={3}
              maxLength={400}
              placeholder="A note, a schedule, or a thank you."
            />
          </div>
          <div>
            <Label htmlFor={`align-${widget.id}`}>Alignment</Label>
            <Select id={`align-${widget.id}`} name="align" defaultValue={config.align}>
              <option value="center">Centered</option>
              <option value="left">Left aligned</option>
            </Select>
          </div>
        </>
      );
    }
    case "image": {
      const config = parseWidgetConfig("image", widget.config);
      return (
        <>
          <div>
            <Label htmlFor={`url-${widget.id}`}>Image URL</Label>
            <Input
              id={`url-${widget.id}`}
              name="url"
              defaultValue={config.url}
              placeholder="https://example.com/photo.jpg"
              inputMode="url"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`alt-${widget.id}`}>Alt text</Label>
              <Input id={`alt-${widget.id}`} name="alt" defaultValue={config.alt} maxLength={120} />
            </div>
            <div>
              <Label htmlFor={`href-${widget.id}`}>Link (optional)</Label>
              <Input
                id={`href-${widget.id}`}
                name="href"
                defaultValue={config.href}
                placeholder="https://…"
                inputMode="url"
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`caption-${widget.id}`}>Caption</Label>
            <Input
              id={`caption-${widget.id}`}
              name="caption"
              defaultValue={config.caption}
              maxLength={160}
            />
          </div>
        </>
      );
    }
    case "video": {
      const config = parseWidgetConfig("video", widget.config);
      return (
        <>
          <div>
            <Label htmlFor={`url-${widget.id}`}>YouTube or Vimeo URL</Label>
            <Input
              id={`url-${widget.id}`}
              name="url"
              defaultValue={config.url}
              placeholder="https://youtube.com/watch?v=…"
              inputMode="url"
            />
            <FieldHint>We embed YouTube, Vimeo and Spotify links automatically.</FieldHint>
          </div>
          <div>
            <Label htmlFor={`title-${widget.id}`}>Title</Label>
            <Input id={`title-${widget.id}`} name="title" defaultValue={config.title} maxLength={80} />
          </div>
          <div>
            <Label htmlFor={`caption-${widget.id}`}>Caption</Label>
            <Input
              id={`caption-${widget.id}`}
              name="caption"
              defaultValue={config.caption}
              maxLength={160}
            />
          </div>
        </>
      );
    }
    case "music": {
      const config = parseWidgetConfig("music", widget.config);
      return (
        <>
          <div>
            <Label htmlFor={`url-${widget.id}`}>Spotify or music URL</Label>
            <Input
              id={`url-${widget.id}`}
              name="url"
              defaultValue={config.url}
              placeholder="https://open.spotify.com/track/…"
              inputMode="url"
            />
            <FieldHint>Spotify links become a player; other links become a card.</FieldHint>
          </div>
          <div>
            <Label htmlFor={`title-${widget.id}`}>Title</Label>
            <Input id={`title-${widget.id}`} name="title" defaultValue={config.title} maxLength={80} />
          </div>
        </>
      );
    }
    case "button": {
      const config = parseWidgetConfig("button", widget.config);
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`label-${widget.id}`}>Label</Label>
            <Input
              id={`label-${widget.id}`}
              name="label"
              defaultValue={config.label}
              maxLength={40}
            />
          </div>
          <div>
            <Label htmlFor={`url-${widget.id}`}>Destination URL</Label>
            <Input
              id={`url-${widget.id}`}
              name="url"
              defaultValue={config.url}
              placeholder="https://…"
              inputMode="url"
            />
          </div>
        </div>
      );
    }
    case "divider": {
      const config = parseWidgetConfig("divider", widget.config);
      return (
        <div>
          <Label htmlFor={`style-${widget.id}`}>Style</Label>
          <Select id={`style-${widget.id}`} name="style" defaultValue={config.style}>
            <option value="line">Hairline</option>
            <option value="dots">Three dots</option>
            <option value="space">Extra space</option>
          </Select>
        </div>
      );
    }
    default:
      return null;
  }
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: keyof WidgetConfigMap["header"] | keyof WidgetConfigMap["links"];
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 rounded border-border accent-ink"
      />
      {label}
    </label>
  );
}
