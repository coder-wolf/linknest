"use client";

import { useState, useTransition } from "react";
import { Pencil, X } from "lucide-react";
import { AvatarUploadField } from "@/components/avatar-upload-field";
import { Alert, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { updateIdentityAction, type IdentityState } from "./actions";

const initialState: IdentityState = {};

export function ProfileIdentity({
  displayName,
  username,
  bio,
  avatarUrl,
  isPublished,
}: {
  displayName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  isPublished: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<IdentityState>(initialState);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateIdentityAction(state, formData);
      setState(result);
      if (result.success) setEditing(false);
    });
  }

  if (editing) {
    return (
      <form action={handleSubmit} className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">Edit profile</p>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Cancel editing"
          >
            <X className="size-4" />
          </button>
        </div>

        {state.error ? <Alert tone="error">{state.error}</Alert> : null}

        <div>
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={displayName}
            maxLength={60}
            required
            autoFocus
          />
          {state.fieldErrors?.displayName ? (
            <FieldError>{state.fieldErrors.displayName}</FieldError>
          ) : null}
        </div>

        <AvatarUploadField initialUrl={avatarUrl} compact />

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-lg font-semibold">{displayName}</p>
        {isPublished ? <Badge tone="success">Live</Badge> : <Badge tone="warning">Draft</Badge>}
        <button
          type="button"
          onClick={() => {
            setState(initialState);
            setEditing(true);
          }}
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
        >
          <Pencil className="size-3" />
          Edit
        </button>
      </div>
      <p className="text-sm text-muted">@{username}</p>
      {bio ? (
        <p className="mt-2 max-w-xl text-sm text-muted">{bio}</p>
      ) : (
        <p className="mt-2 text-sm text-muted">No bio yet — add one in settings.</p>
      )}
    </div>
  );
}
