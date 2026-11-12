"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useActionState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Alert, Badge, Card, CardBody, CardHeader } from "@/components/ui/card";
import { FieldError, FieldHint, Input, Label, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import {
  createLinkAction,
  deleteLinkAction,
  reorderLinksAction,
  toggleLinkAction,
  updateLinkAction,
  type LinkFormState,
} from "./actions";

export type ManagedLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  clicks: number;
};

const initialState: LinkFormState = {};

export function LinkManager({ links }: { links: ManagedLink[] }) {
  const [order, setOrder] = useState(links.map((link) => link.id));
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createLinkAction, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const linkMap = useMemo(() => new Map(links.map((link) => [link.id, link])), [links]);
  const ordered = order.map((id) => linkMap.get(id)).filter((link): link is ManagedLink => Boolean(link));

  function persistOrder(nextIds: string[]) {
    setOrder(nextIds);
    startTransition(async () => {
      await reorderLinksAction(nextIds);
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...order];
    const from = next.indexOf(dragId);
    const to = next.indexOf(targetId);
    if (from === -1 || to === -1) return;
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    setDragId(null);
    persistOrder(next);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold">Add a link</h2>
          <p className="text-xs text-muted">
            Paste any destination — a portfolio, shop, video, booking page or article.
          </p>
        </CardHeader>
        <CardBody>
          <form ref={formRef} action={formAction} className="space-y-3">
            {state.error ? <Alert tone="error">{state.error}</Alert> : null}
            {state.success ? <Alert tone="success">{state.success}</Alert> : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="My latest project" required />
                {state.fieldErrors?.title ? (
                  <FieldError>{state.fieldErrors.title}</FieldError>
                ) : null}
              </div>
              <div>
                <Label htmlFor="url">Destination URL</Label>
                <Input id="url" name="url" placeholder="https://…" inputMode="url" required />
                {state.fieldErrors?.url ? (
                  <FieldError>{state.fieldErrors.url}</FieldError>
                ) : null}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="A short line shown under the title"
                maxLength={160}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <FieldHint className="mt-0">Links open in a new tab for visitors.</FieldHint>
              <SubmitButton size="sm" pendingLabel="Adding…">
                <Plus className="size-3.5" /> Add link
              </SubmitButton>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Your links</h2>
            <p className="text-xs text-muted">
              Drag to reorder, or use the arrows for keyboard-friendly reordering.
            </p>
          </div>
          <Badge>{links.length} links</Badge>
        </CardHeader>
        <CardBody className="space-y-2">
          {ordered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No links yet. Add your first one above.
            </p>
          ) : (
            ordered.map((link, index) => (
              <LinkRow
                key={link.id}
                link={link}
                index={index}
                total={ordered.length}
                dragging={dragId === link.id}
                onDragStart={() => setDragId(link.id)}
                onDragEnd={() => setDragId(null)}
                onDrop={() => handleDrop(link.id)}
                onMove={move}
              />
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function LinkRow({
  link,
  index,
  total,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
}: {
  link: ManagedLink;
  index: number;
  total: number;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<LinkFormState>({});
  const [pending, startTransition] = useTransition();

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateLinkAction(state, formData);
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
        !link.isActive && "bg-surface-muted/50",
      )}
    >
      <div className="flex items-center gap-2 px-2.5 py-2.5 sm:gap-3">
        <div className="flex flex-col items-center text-muted">
          <GripVertical className="size-4 cursor-grab" />
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="rounded p-0.5 text-muted hover:bg-surface-muted disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="rounded p-0.5 text-muted hover:bg-surface-muted disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium">{link.title}</p>
            {!link.isActive ? <Badge>Hidden</Badge> : null}
          </div>
          <p className="truncate text-xs text-muted">{link.url}</p>
        </div>

        <span className="hidden shrink-0 text-xs text-muted sm:block">
          {formatNumber(link.clicks)} clicks
        </span>

        <div className="flex shrink-0 items-center gap-0.5">
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Open link"
          >
            <ExternalLink className="size-4" />
          </a>
          <form action={toggleLinkAction}>
            <input type="hidden" name="linkId" value={link.id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
              aria-label={link.isActive ? "Hide link" : "Show link"}
            >
              {link.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setState({});
              setEditing((value) => !value);
            }}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Edit link"
          >
            <Pencil className="size-4" />
          </button>
          <form
            action={deleteLinkAction}
            onSubmit={(event) => {
              if (!window.confirm(`Delete “${link.title}”? This can't be undone.`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="linkId" value={link.id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
              aria-label="Delete link"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </div>
      </div>

      {editing ? (
        <form action={handleUpdate} className="space-y-3 border-t border-border px-3.5 py-4">
          <input type="hidden" name="linkId" value={link.id} />
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`title-${link.id}`}>Title</Label>
              <Input
                id={`title-${link.id}`}
                name="title"
                defaultValue={link.title}
                required
              />
            </div>
            <div>
              <Label htmlFor={`url-${link.id}`}>URL</Label>
              <Input id={`url-${link.id}`} name="url" defaultValue={link.url} required />
            </div>
          </div>
          <div>
            <Label htmlFor={`description-${link.id}`}>Description</Label>
            <Textarea
              id={`description-${link.id}`}
              name="description"
              defaultValue={link.description ?? ""}
              rows={2}
              maxLength={160}
            />
          </div>
          <div>
            <Label htmlFor={`icon-${link.id}`}>Thumbnail / icon URL (optional)</Label>
            <Input
              id={`icon-${link.id}`}
              name="iconUrl"
              defaultValue={link.iconUrl ?? ""}
              placeholder="https://…"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
