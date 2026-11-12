"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useActionState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { PlatformIcon, platformLabel } from "@/components/social-icons";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Badge, Card, CardBody, CardHeader } from "@/components/ui/card";
import { FieldError, FieldHint, Input, Label, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLATFORMS } from "@/lib/validation";
import {
  createSocialAction,
  deleteSocialAction,
  reorderSocialsAction,
  toggleSocialAction,
  updateSocialAction,
  type SocialFormState,
} from "./actions";

export type ManagedSocial = {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
};

const initialState: SocialFormState = {};

export function SocialManager({ socials }: { socials: ManagedSocial[] }) {
  const [order, setOrder] = useState(socials.map((social) => social.id));
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createSocialAction, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const socialMap = useMemo(
    () => new Map(socials.map((social) => [social.id, social])),
    [socials],
  );
  const ordered = order
    .map((id) => socialMap.get(id))
    .filter((social): social is ManagedSocial => Boolean(social));

  function persistOrder(nextIds: string[]) {
    setOrder(nextIds);
    startTransition(async () => {
      await reorderSocialsAction(nextIds);
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
          <h2 className="text-sm font-semibold">Add a social account</h2>
          <p className="text-xs text-muted">
            Icons appear under your bio and open in a new tab.
          </p>
        </CardHeader>
        <CardBody>
          <form ref={formRef} action={formAction} className="space-y-3">
            {state.error ? <Alert tone="error">{state.error}</Alert> : null}
            {state.success ? <Alert tone="success">{state.success}</Alert> : null}
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select id="platform" name="platform" defaultValue="instagram">
                  {PLATFORMS.map((platform) => (
                    <option key={platform.key} value={platform.key}>
                      {platform.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="url">Profile URL</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://instagram.com/yourname"
                  inputMode="url"
                  required
                />
                {state.fieldErrors?.url ? (
                  <FieldError>{state.fieldErrors.url}</FieldError>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <FieldHint className="mt-0">Up to 20 accounts.</FieldHint>
              <SubmitButton size="sm" pendingLabel="Adding…">
                <Plus className="size-3.5" /> Add account
              </SubmitButton>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Connected accounts</h2>
            <p className="text-xs text-muted">Drag to reorder your icon row.</p>
          </div>
          <Badge>{socials.length} accounts</Badge>
        </CardHeader>
        <CardBody className="space-y-2">
          {ordered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No social accounts yet. Add one above.
            </p>
          ) : (
            ordered.map((social, index) => (
              <SocialRow
                key={social.id}
                social={social}
                index={index}
                total={ordered.length}
                dragging={dragId === social.id}
                onDragStart={() => setDragId(social.id)}
                onDragEnd={() => setDragId(null)}
                onDrop={() => handleDrop(social.id)}
                onMove={move}
              />
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function SocialRow({
  social,
  index,
  total,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
}: {
  social: ManagedSocial;
  index: number;
  total: number;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<SocialFormState>({});
  const [pending, startTransition] = useTransition();

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateSocialAction(state, formData);
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
        !social.isActive && "bg-surface-muted/50",
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

        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted">
          <PlatformIcon platform={social.platform} className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{platformLabel(social.platform)}</p>
            {!social.isActive ? <Badge>Hidden</Badge> : null}
          </div>
          <p className="truncate text-xs text-muted">{social.url}</p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <form action={toggleSocialAction}>
            <input type="hidden" name="socialId" value={social.id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
              aria-label={social.isActive ? "Hide account" : "Show account"}
            >
              {social.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setState({});
              setEditing((value) => !value);
            }}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Edit account"
          >
            <Pencil className="size-4" />
          </button>
          <form
            action={deleteSocialAction}
            onSubmit={(event) => {
              if (!window.confirm(`Remove ${platformLabel(social.platform)}?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="socialId" value={social.id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
              aria-label="Remove account"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </div>
      </div>

      {editing ? (
        <form action={handleUpdate} className="space-y-3 border-t border-border px-3.5 py-4">
          <input type="hidden" name="socialId" value={social.id} />
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div>
              <Label htmlFor={`platform-${social.id}`}>Platform</Label>
              <Select
                id={`platform-${social.id}`}
                name="platform"
                defaultValue={social.platform}
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform.key} value={platform.key}>
                    {platform.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor={`url-${social.id}`}>Profile URL</Label>
              <Input id={`url-${social.id}`} name="url" defaultValue={social.url} required />
            </div>
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
