"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { ProfileCanvas, type CanvasWidget } from "@/components/profile-canvas";
import { PhoneFrame } from "@/components/phone-frame";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Card, CardBody, CardHeader } from "@/components/ui/card";
import { FieldHint, Input, Label, Select } from "@/components/ui/field";
import { updateThemeAction, type ThemeState } from "./actions";
import {
  AVATAR_SHAPES,
  BUTTON_STYLES,
  FONT_OPTIONS,
  SHADOW_OPTIONS,
  SHAPE_OPTIONS,
  TEXTURE_OPTIONS,
  THEME_PRESETS,
  THEME_PRESET_KEYS,
  miniButtonStyle,
  presetSwatchStyle,
  type Theme,
  type ThemePresetKey,
} from "@/lib/themes";
import { STARTER_WIDGETS } from "@/lib/widgets";
import {
  FREE_FONTS,
  FREE_THEME_PRESETS,
  UPGRADE_HREF,
  isPaidPlan,
  themeAccessIssue,
} from "@/lib/plan-access";
import { cn } from "@/lib/utils";

const initialState: ThemeState = {};

function themeFormData(theme: Theme) {
  const formData = new FormData();
  formData.set("preset", theme.preset);
  formData.set("background", theme.background);
  formData.set("textColor", theme.textColor);
  formData.set("mutedColor", theme.mutedColor);
  formData.set("accentColor", theme.accentColor);
  formData.set("buttonColor", theme.buttonColor);
  formData.set("buttonTextColor", theme.buttonTextColor);
  formData.set("cardColor", theme.cardColor);
  formData.set("buttonStyle", theme.buttonStyle);
  formData.set("buttonShape", theme.buttonShape);
  formData.set("shadow", theme.shadow);
  formData.set("font", theme.font);
  formData.set("layout", theme.layout);
  formData.set("texture", theme.texture);
  formData.set("avatarShape", theme.avatarShape);
  formData.set("backgroundImageUrl", theme.backgroundImageUrl ?? "");
  return formData;
}

type PreviewProfile = {
  displayName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  isPublished: boolean;
};

export function AppearanceForm({
  initialTheme,
  profile,
  links,
  socials,
  widgets,
  plan,
}: {
  initialTheme: Theme;
  profile: PreviewProfile;
  links: Array<{ id: string; title: string; description: string | null; iconUrl: string | null }>;
  socials: Array<{ id: string; platform: string; url: string }>;
  widgets: Array<{ id: string; type: string; isVisible: boolean; config: unknown }>;
  plan: string;
}) {
  const paid = isPaidPlan(plan);
  const baselineTheme: Theme = paid
    ? initialTheme
    : { ...initialTheme, backgroundImageUrl: null };
  const [theme, setTheme] = useState<Theme>(() => baselineTheme);
  const [state, setState] = useState<ThemeState>(initialState);
  const [pending, startTransition] = useTransition();
  const accessIssue = themeAccessIssue(theme, plan);
  const dirty = JSON.stringify(theme) !== JSON.stringify(baselineTheme);
  const lockedPreview =
    !paid && theme.preset !== "custom" && !FREE_THEME_PRESETS.includes(theme.preset);

  function saveTheme(next: Theme) {
    startTransition(async () => {
      const result = await updateThemeAction(state, themeFormData(next));
      setState(result);
    });
  }

  async function handleSubmit(formData: FormData) {
    const result = await updateThemeAction(state, formData);
    setState(result);
  }

  function applyPreset(key: ThemePresetKey) {
    const preset = THEME_PRESETS[key].theme;
    const next = {
      ...preset,
      backgroundImageUrl: paid ? theme.backgroundImageUrl : null,
    };
    setTheme(next);

    // Free users can preview Pro themes, but only save themes their plan allows.
    if (!paid && !FREE_THEME_PRESETS.includes(key)) return;
    saveTheme(next);
  }

  function update<K extends keyof Theme>(key: K, value: Theme[K]) {
    setTheme((current) => {
      // Keep a locked Pro preset attached while the user previews it, so
      // editing a color can't turn it into a saveable "custom" theme.
      const keepLockedPreset =
        !paid &&
        current.preset !== "custom" &&
        !FREE_THEME_PRESETS.includes(current.preset);

      return {
        ...current,
        preset: keepLockedPreset ? current.preset : "custom",
        [key]: value,
      };
    });
  }

  const canvasWidgets: CanvasWidget[] =
    widgets.length > 0
      ? widgets
      : STARTER_WIDGETS.map((widget, index) => ({
          id: `starter-${index}`,
          type: widget.type,
          isVisible: true,
          config: widget.config,
        }));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="preset" value={theme.preset} />
        <input type="hidden" name="background" value={theme.background} />
        <input type="hidden" name="textColor" value={theme.textColor} />
        <input type="hidden" name="mutedColor" value={theme.mutedColor} />
        <input type="hidden" name="accentColor" value={theme.accentColor} />
        <input type="hidden" name="buttonColor" value={theme.buttonColor} />
        <input type="hidden" name="buttonTextColor" value={theme.buttonTextColor} />
        <input type="hidden" name="cardColor" value={theme.cardColor} />
        <input type="hidden" name="buttonStyle" value={theme.buttonStyle} />
        <input type="hidden" name="buttonShape" value={theme.buttonShape} />
        <input type="hidden" name="shadow" value={theme.shadow} />
        <input type="hidden" name="font" value={theme.font} />
        <input type="hidden" name="layout" value={theme.layout} />
        <input type="hidden" name="texture" value={theme.texture} />
        <input type="hidden" name="avatarShape" value={theme.avatarShape} />

        {state.error ? <Alert tone="error">{state.error}</Alert> : null}
        {state.success ? <Alert tone="success">{state.success}</Alert> : null}
        {dirty && !pending && !lockedPreview ? (
          <Alert tone="info">
            You have unsaved theme changes. Save the theme to see them on your live page.
          </Alert>
        ) : null}
        {!paid && accessIssue ? (
          <Alert tone="info">
            <span className="font-medium">View only.</span> {accessIssue}{" "}
            <Link href={UPGRADE_HREF} className="font-semibold underline underline-offset-4">
              See Pro
            </Link>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Theme presets</h2>
            <p className="text-xs text-muted">
              Twenty starting points — pick one, then tune every detail below.
            </p>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {THEME_PRESET_KEYS.map((key) => {
              const preset = THEME_PRESETS[key];
              const active = theme.preset === key;
              const locked = !paid && !FREE_THEME_PRESETS.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  disabled={pending}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border p-2.5 text-left transition disabled:opacity-60",
                    active ? "border-ink ring-2 ring-ink/10" : "border-border hover:border-ink/30",
                  )}
                >
                  {locked ? (
                    <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                      <Lock className="size-2.5" />
                      Pro
                    </span>
                  ) : null}
                  <span
                    className="flex h-20 w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg px-3"
                    style={presetSwatchStyle(preset.theme)}
                  >
                    <span className="size-4 rounded-full" style={{ background: preset.theme.accentColor }} />
                    <span
                      className="h-1.5 w-10 rounded-full"
                      style={{ background: preset.theme.textColor, opacity: 0.85 }}
                    />
                    <span
                      className="mt-0.5 flex h-4 w-16 items-center justify-center text-[7px] font-semibold"
                      style={miniButtonStyle(preset.theme)}
                    >
                      Link
                    </span>
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-1">
                    <span className="text-xs font-medium">{preset.label}</span>
                    <span className="flex items-center gap-1">
                      {active ? <Check className="size-3.5 shrink-0 text-ink" /> : null}
                      {locked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
                          <Lock className="size-3" />
                          Pro
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[10px] leading-snug text-muted">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Colors</h2>
            <p className="text-xs text-muted">
              Any CSS color works — hex, <code className="rounded bg-surface-muted px-1">rgba()</code>,
              or a gradient for the background.
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label htmlFor="background">Background</Label>
              <div className="flex gap-2">
                <Input
                  id="background"
                  value={theme.background}
                  onChange={(event) => update("background", event.target.value)}
                  placeholder="#f7f3ea or linear-gradient(…)"
                />
                <input
                  type="color"
                  aria-label="Pick background color"
                  value={/^#[0-9a-f]{6}$/i.test(theme.background) ? theme.background : "#f7f3ea"}
                  onChange={(event) => update("background", event.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ColorField
                label="Text"
                value={theme.textColor}
                onChange={(value) => update("textColor", value)}
              />
              <ColorField
                label="Muted text"
                value={theme.mutedColor}
                onChange={(value) => update("mutedColor", value)}
              />
              <ColorField
                label="Accent"
                value={theme.accentColor}
                onChange={(value) => update("accentColor", value)}
              />
              <ColorField
                label="Button"
                value={theme.buttonColor}
                onChange={(value) => update("buttonColor", value)}
              />
              <ColorField
                label="Button text"
                value={theme.buttonTextColor}
                onChange={(value) => update("buttonTextColor", value)}
              />
              <ColorField
                label="Card surface"
                value={theme.cardColor}
                onChange={(value) => update("cardColor", value)}
              />
            </div>

            {paid ? (
              <div>
                <Label htmlFor="backgroundImageUrl">Background image URL (optional)</Label>
                <Input
                  id="backgroundImageUrl"
                  name="backgroundImageUrl"
                  defaultValue={theme.backgroundImageUrl ?? ""}
                  placeholder="https://example.com/texture.jpg"
                  onChange={(event) => update("backgroundImageUrl", event.target.value || null)}
                />
                <FieldHint>The image is layered behind your colors at reduced opacity.</FieldHint>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 p-4">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Lock className="size-3.5" /> Custom background images
                </p>
                <p className="mt-1 text-xs text-muted">
                  Add a photo or texture behind your theme on Pro.
                </p>
                <Link
                  href={UPGRADE_HREF}
                  className="mt-2 inline-flex text-xs font-semibold text-foreground underline underline-offset-4"
                >
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Surface &amp; detail</h2>
            <p className="text-xs text-muted">
              Button treatment, depth, texture and the shape of your avatar.
            </p>
          </CardHeader>
          <CardBody className="space-y-5">
            <Segmented>
              <SegmentedLabel>Button style</SegmentedLabel>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BUTTON_STYLES.map((option) => (
                  <OptionButton
                    key={option.key}
                    active={theme.buttonStyle === option.key}
                    onClick={() => update("buttonStyle", option.key)}
                    label={option.label}
                    hint={option.description}
                  />
                ))}
              </div>
            </Segmented>

            <div className="grid gap-5 sm:grid-cols-2">
              <Segmented>
                <SegmentedLabel>Corner shape</SegmentedLabel>
                <div className="grid grid-cols-3 gap-2">
                  {SHAPE_OPTIONS.map((shape) => (
                    <button
                      key={shape.key}
                      type="button"
                      onClick={() => update("buttonShape", shape.key)}
                      className={cn(
                        "border px-2 py-2.5 text-xs font-medium transition",
                        theme.buttonShape === shape.key
                          ? "border-ink bg-ink text-white"
                          : "border-border hover:border-ink/30",
                      )}
                      style={{ borderRadius: shape.radius }}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </Segmented>

              <Segmented>
                <SegmentedLabel>Shadow</SegmentedLabel>
                <div className="grid grid-cols-3 gap-2">
                  {SHADOW_OPTIONS.map((option) => (
                    <OptionButton
                      key={option.key}
                      active={theme.shadow === option.key}
                      onClick={() => update("shadow", option.key)}
                      label={option.label}
                    />
                  ))}
                </div>
              </Segmented>

              <Segmented>
                <SegmentedLabel>Avatar shape</SegmentedLabel>
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_SHAPES.map((option) => (
                    <OptionButton
                      key={option.key}
                      active={theme.avatarShape === option.key}
                      onClick={() => update("avatarShape", option.key)}
                      label={option.label}
                    />
                  ))}
                </div>
              </Segmented>

              <Segmented>
                <SegmentedLabel>Texture</SegmentedLabel>
                <div className="grid grid-cols-2 gap-2">
                  {TEXTURE_OPTIONS.map((option) => (
                    <OptionButton
                      key={option.key}
                      active={theme.texture === option.key}
                      onClick={() => update("texture", option.key)}
                      label={option.label}
                    />
                  ))}
                </div>
              </Segmented>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Type &amp; layout</h2>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="font">Font</Label>
              <Select
                id="font"
                value={theme.font}
                onChange={(event) => update("font", event.target.value as Theme["font"])}
              >
                {FONT_OPTIONS.map((font) => {
                  const locked = !paid && !FREE_FONTS.includes(font.key);
                  return (
                    <option key={font.key} value={font.key} disabled={locked}>
                      {font.label}
                      {locked ? " — Pro" : ""}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select
                id="layout"
                value={theme.layout}
                onChange={(event) => update("layout", event.target.value as Theme["layout"])}
              >
                <option value="classic">Classic — open page</option>
                <option value="card">Card — framed profile</option>
              </Select>
            </div>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Theme presets apply instantly. Save to keep color, type and layout tweaks.
          </p>
          <SubmitButton
            pendingLabel="Saving…"
            disabled={pending || (!paid && Boolean(accessIssue))}
          >
            Save appearance
          </SubmitButton>
        </div>
      </form>

      <div className="lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-center gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Live preview
          </p>
          {lockedPreview ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              <Lock className="size-2.5" />
              Pro theme
            </span>
          ) : null}
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

function Segmented({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function SegmentedLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-medium">{children}</p>;
}

function OptionButton({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2 py-2 text-left text-xs font-medium transition",
        active ? "border-ink bg-ink text-white" : "border-border hover:border-ink/30",
      )}
    >
      <span className="block leading-tight">{label}</span>
      {hint ? (
        <span className={cn("mt-0.5 block text-[10px] font-normal leading-snug", active ? "text-white/70" : "text-muted")}>
          {hint}
        </span>
      ) : null}
    </button>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
        <input
          type="color"
          aria-label={`Pick ${label.toLowerCase()} color`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-11 shrink-0 cursor-pointer rounded-lg"
        />
      </div>
    </div>
  );
}
