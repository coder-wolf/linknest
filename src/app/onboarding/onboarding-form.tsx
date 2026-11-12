"use client";

import { useActionState, useState } from "react";
import { completeOnboardingAction, type OnboardingState } from "./actions";
import { ProfilePreview } from "@/components/profile-preview";
import { Alert } from "@/components/ui/card";
import { FieldError, FieldHint, Input, Label, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { DEFAULT_THEME } from "@/lib/themes";
import { PLATFORMS } from "@/lib/validation";

const initialState: OnboardingState = {};

export function OnboardingForm({ suggestedName }: { suggestedName: string }) {
  const [state, formAction] = useActionState(completeOnboardingAction, initialState);

  const [displayName, setDisplayName] = useState(suggestedName);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [socialPlatform, setSocialPlatform] = useState<string>("instagram");
  const [socialUrl, setSocialUrl] = useState("");

  const previewLinks = linkTitle || linkUrl ? [{ title: linkTitle || linkUrl }] : [];
  const previewSocials = socialUrl ? [{ platform: socialPlatform }] : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form action={formAction} className="space-y-6">
        {state.error ? <Alert tone="error">{state.error}</Alert> : null}

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
              1
            </span>
            <h2 className="text-sm font-semibold">Claim your link</h2>
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-surface focus-within:border-ink/40 focus-within:ring-4 focus-within:ring-ink/5">
              <span className="flex items-center border-r border-border bg-surface-muted px-3 text-sm text-muted">
                linknest.com/
              </span>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value.toLowerCase())}
                placeholder="yourname"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted/70"
                required
              />
            </div>
            {state.fieldErrors?.username ? (
              <FieldError>{state.fieldErrors.username}</FieldError>
            ) : (
              <FieldHint>3–30 characters. Letters, numbers, hyphens and underscores.</FieldHint>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
              2
            </span>
            <h2 className="text-sm font-semibold">Set up your profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Mima Sánchez"
                maxLength={60}
                required
              />
              {state.fieldErrors?.displayName ? (
                <FieldError>{state.fieldErrors.displayName}</FieldError>
              ) : null}
            </div>

            <div>
              <Label htmlFor="bio">Short bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Illustrator, daydreamer, and maker of small things."
                maxLength={280}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <FieldHint>Optional. 280 characters max.</FieldHint>
                <span className="mt-1.5 text-xs text-muted">{bio.length}/280</span>
              </div>
            </div>

            <div>
              <Label htmlFor="avatarUrl">Profile picture URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://example.com/avatar.jpg"
                inputMode="url"
              />
              <FieldHint>Optional. Paste a public image URL for now.</FieldHint>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
              3
            </span>
            <h2 className="text-sm font-semibold">Add your first content</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="linkTitle">Link title</Label>
              <Input
                id="linkTitle"
                name="linkTitle"
                value={linkTitle}
                onChange={(event) => setLinkTitle(event.target.value)}
                placeholder="My portfolio"
                maxLength={80}
              />
              {state.fieldErrors?.linkTitle ? (
                <FieldError>{state.fieldErrors.linkTitle}</FieldError>
              ) : null}
            </div>
            <div>
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input
                id="linkUrl"
                name="linkUrl"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://your-site.com"
                inputMode="url"
              />
              {state.fieldErrors?.linkUrl ? (
                <FieldError>{state.fieldErrors.linkUrl}</FieldError>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
            <div>
              <Label htmlFor="socialPlatform">Social platform</Label>
              <Select
                id="socialPlatform"
                name="socialPlatform"
                value={socialPlatform}
                onChange={(event) => setSocialPlatform(event.target.value)}
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform.key} value={platform.key}>
                    {platform.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="socialUrl">Social profile URL</Label>
              <Input
                id="socialUrl"
                name="socialUrl"
                value={socialUrl}
                onChange={(event) => setSocialUrl(event.target.value)}
                placeholder="https://instagram.com/yourname"
                inputMode="url"
              />
              {state.fieldErrors?.socialUrl ? (
                <FieldError>{state.fieldErrors.socialUrl}</FieldError>
              ) : null}
            </div>
          </div>

          <FieldHint>You can add more links and socials from your dashboard.</FieldHint>
        </section>

        <SubmitButton className="w-full sm:w-auto" pendingLabel="Building your page…">
          Create my page
        </SubmitButton>
        <p className="text-xs text-muted">
          Your page starts unpublished. Preview it first, then publish when you&apos;re ready.
        </p>
      </form>

      <div className="lg:sticky lg:top-8">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Live preview
        </p>
        <ProfilePreview
          displayName={displayName}
          username={username || "yourname"}
          bio={bio}
          avatarUrl={avatarUrl}
          links={previewLinks}
          socials={previewSocials}
          theme={DEFAULT_THEME}
        />
      </div>
    </div>
  );
}
