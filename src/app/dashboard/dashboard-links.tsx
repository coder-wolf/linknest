"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Pencil, X } from "lucide-react";
import { Alert, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { cn, formatNumber } from "@/lib/utils";
import { updateLinkAction, type LinkFormState } from "./links/actions";

export type DashboardLink = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  clicks: number;
};

export function DashboardLinks({ links }: { links: DashboardLink[] }) {
  return (
    <>
      {links.map((link) => (
        <DashboardLinkRow key={link.id} link={link} />
      ))}
    </>
  );
}

function DashboardLinkRow({ link }: { link: DashboardLink }) {
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
      className={cn(
        "rounded-xl border border-border px-3.5 py-3",
        !link.isActive && "bg-surface-muted/50",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{link.title}</p>
          <p className="truncate text-xs text-muted">{link.url}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
          {!link.isActive ? <Badge>Hidden</Badge> : null}
          <span>{formatNumber(link.clicks)} clicks</span>
          <button
            type="button"
            onClick={() => {
              setState({});
              setEditing((value) => !value);
            }}
            className="rounded-lg p-1.5 transition hover:bg-surface-muted hover:text-foreground"
            aria-label={`Edit ${link.title}`}
          >
            {editing ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
          </button>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-1.5 transition hover:bg-surface-muted hover:text-foreground"
            aria-label={`Open ${link.title}`}
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {editing ? (
        <form action={handleUpdate} className="mt-3 space-y-3 border-t border-border pt-3">
          <input type="hidden" name="linkId" value={link.id} />
          <input type="hidden" name="iconUrl" value={link.iconUrl ?? ""} />
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`dashboard-title-${link.id}`}>Title</Label>
              <Input
                id={`dashboard-title-${link.id}`}
                name="title"
                defaultValue={link.title}
                required
              />
            </div>
            <div>
              <Label htmlFor={`dashboard-url-${link.id}`}>URL</Label>
              <Input id={`dashboard-url-${link.id}`} name="url" defaultValue={link.url} required />
            </div>
          </div>

          <div>
            <Label htmlFor={`dashboard-description-${link.id}`}>Description</Label>
            <Textarea
              id={`dashboard-description-${link.id}`}
              name="description"
              defaultValue={link.description ?? ""}
              rows={2}
              maxLength={160}
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
