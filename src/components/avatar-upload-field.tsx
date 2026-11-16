"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { FieldHint, Input, Label } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/**
 * File input with a live preview. The parent action receives the file as
 * `avatarFile`; this component only manages the preview and remove toggle.
 */
export function AvatarUploadField({
  initialUrl,
  onPreviewChange,
  compact,
}: {
  initialUrl?: string | null;
  onPreviewChange?: (url: string | null) => void;
  compact?: boolean;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = remove ? null : (objectUrl ?? initialUrl ?? null);
  const hasExisting = Boolean(initialUrl);

  return (
    <div>
      <Label htmlFor="avatarFile">Profile photo</Label>
      <div className={cn("flex items-center gap-4", compact && "gap-3")}>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-muted text-muted",
            compact ? "size-14" : "size-20",
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Profile photo preview" className="size-full object-cover" />
          ) : (
            <UserRound className={compact ? "size-6" : "size-8"} />
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <Input
            id="avatarFile"
            name="avatarFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-white"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              if (objectUrl) URL.revokeObjectURL(objectUrl);
              const next = URL.createObjectURL(file);
              setObjectUrl(next);
              setRemove(false);
              onPreviewChange?.(next);
            }}
          />
          <FieldHint className="mt-0">
            JPG, PNG, WebP, GIF or AVIF up to 5 MB. Square images look best.
          </FieldHint>

          {hasExisting ? (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                name="removeAvatar"
                checked={remove}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRemove(checked);
                  onPreviewChange?.(checked ? null : (objectUrl ?? initialUrl ?? null));
                }}
                className="size-3.5 rounded border-border accent-ink"
              />
              Remove current photo
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}
