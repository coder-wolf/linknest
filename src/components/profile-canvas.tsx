"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Music, Play } from "lucide-react";
import { PlatformIcon, platformLabel } from "@/components/social-icons";
import { resolveEmbed } from "@/lib/embeds";
import {
  avatarRadius,
  buttonStyle,
  cardStyle,
  fontStack,
  mix,
  readableOn,
  shadowValue,
  shapeRadius,
  textureStyle,
  type Theme,
} from "@/lib/themes";
import {
  isWidgetType,
  parseWidgetConfig,
  type WidgetConfigMap,
  type WidgetType,
} from "@/lib/widgets";
import { cn, initials } from "@/lib/utils";

export type CanvasProfile = {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type CanvasLink = {
  id?: string;
  title: string;
  description?: string | null;
  iconUrl?: string | null;
};

export type CanvasSocial = {
  id?: string;
  platform: string;
  url?: string | null;
};

export type CanvasWidget = {
  id: string;
  type: string;
  isVisible?: boolean;
  config: unknown;
};

type ProfileCanvasProps = {
  profile: CanvasProfile;
  links: CanvasLink[];
  socials: CanvasSocial[];
  widgets: CanvasWidget[];
  theme: Theme;
  showBranding?: boolean;
  interactive?: boolean;
  className?: string;
};

export function ProfileCanvas({
  profile,
  links,
  socials,
  widgets,
  theme,
  showBranding = true,
  interactive = true,
  className,
}: ProfileCanvasProps) {
  const visible = widgets.filter((widget) => widget.isVisible !== false);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: theme.background,
        color: theme.textColor,
        fontFamily: fontStack(theme.font),
      }}
    >
      {theme.backgroundImageUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${theme.backgroundImageUrl})`, opacity: 0.55 }}
        />
      ) : null}

      {theme.texture !== "none" ? (
        <div aria-hidden className="pointer-events-none absolute inset-0" style={textureStyle(theme)} />
      ) : null}

      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-12 sm:px-6 sm:py-16">
        <div
          className={cn(
            "w-full",
            theme.layout === "card"
              ? "max-w-[440px] rounded-[30px] px-6 py-8 sm:px-7"
              : "max-w-[440px]",
          )}
          style={theme.layout === "card" ? cardStyle(theme) : undefined}
        >
          <div className="flex flex-col gap-6">
            {visible.map((widget) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                profile={profile}
                links={links}
                socials={socials}
                theme={theme}
                interactive={interactive}
              />
            ))}
          </div>

          {showBranding ? (
            <div className="mt-7 flex justify-center">
              {interactive ? (
                <Link
                  href="/"
                  className="text-[10px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
                  style={{ color: theme.mutedColor }}
                >
                  Made with LinkNest
                </Link>
              ) : (
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: theme.mutedColor }}
                >
                  Made with LinkNest
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WidgetRenderer({
  widget,
  profile,
  links,
  socials,
  theme,
  interactive,
}: {
  widget: CanvasWidget;
  profile: CanvasProfile;
  links: CanvasLink[];
  socials: CanvasSocial[];
  theme: Theme;
  interactive: boolean;
}) {
  if (!isWidgetType(widget.type)) return null;

  switch (widget.type as WidgetType) {
    case "header":
      return <HeaderWidget config={parseWidgetConfig("header", widget.config)} profile={profile} theme={theme} />;
    case "links":
      return (
        <LinksWidget
          config={parseWidgetConfig("links", widget.config)}
          links={links}
          theme={theme}
          interactive={interactive}
        />
      );
    case "socials":
      return (
        <SocialsWidget
          config={parseWidgetConfig("socials", widget.config)}
          socials={socials}
          theme={theme}
          interactive={interactive}
        />
      );
    case "text":
      return <TextWidget config={parseWidgetConfig("text", widget.config)} theme={theme} />;
    case "image":
      return (
        <ImageWidget
          config={parseWidgetConfig("image", widget.config)}
          theme={theme}
          interactive={interactive}
        />
      );
    case "video":
      return (
        <VideoWidget
          config={parseWidgetConfig("video", widget.config)}
          theme={theme}
          interactive={interactive}
        />
      );
    case "music":
      return (
        <MusicWidget
          config={parseWidgetConfig("music", widget.config)}
          theme={theme}
          interactive={interactive}
        />
      );
    case "button":
      return (
        <ButtonWidget
          config={parseWidgetConfig("button", widget.config)}
          theme={theme}
          interactive={interactive}
        />
      );
    case "divider":
      return <DividerWidget config={parseWidgetConfig("divider", widget.config)} theme={theme} />;
    default:
      return null;
  }
}

function HeaderWidget({
  config,
  profile,
  theme,
}: {
  config: WidgetConfigMap["header"];
  profile: CanvasProfile;
  theme: Theme;
}) {
  const centered = config.align === "center";

  return (
    <div className={cn("flex flex-col", centered ? "items-center text-center" : "items-start text-left")}>
      {config.showAvatar ? (
        <div
          className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden text-2xl font-semibold"
          style={{
            borderRadius: avatarRadius(theme.avatarShape),
            background: mix(theme.textColor, 12),
            border: `1px solid ${mix(theme.textColor, 16)}`,
            boxShadow: theme.shadow === "soft" ? "0 16px 32px -22px rgba(0,0,0,0.6)" : "none",
          }}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="size-full object-cover"
            />
          ) : (
            initials(profile.displayName || profile.username || "LN")
          )}
        </div>
      ) : null}

      <h1 className="mt-4 text-[1.45rem] font-semibold leading-tight tracking-[-0.02em]">
        {profile.displayName}
      </h1>

      {config.showUsername ? (
        <p className="mt-0.5 text-[13px]" style={{ color: theme.mutedColor }}>
          @{profile.username}
        </p>
      ) : null}

      {config.showBio && profile.bio ? (
        <p
          className="mt-3 max-w-[340px] text-sm leading-relaxed"
          style={{ color: theme.mutedColor }}
        >
          {profile.bio}
        </p>
      ) : null}
    </div>
  );
}

function LinksWidget({
  config,
  links,
  theme,
  interactive,
}: {
  config: WidgetConfigMap["links"];
  links: CanvasLink[];
  theme: Theme;
  interactive: boolean;
}) {
  if (links.length === 0) {
    return (
      <div
        className="border border-dashed px-4 py-5 text-center text-sm"
        style={{
          borderRadius: shapeRadius(theme.buttonShape),
          borderColor: mix(theme.textColor, 22),
          color: theme.mutedColor,
        }}
      >
        Links will appear here once you add them.
      </div>
    );
  }

  return (
    <div
      className={cn(
        config.layout === "grid" ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2.5",
      )}
    >
      {links.map((link, index) => {
        const content = (
          <>
            {config.showIcons ? (
              link.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={link.iconUrl}
                  alt=""
                  className="size-6 shrink-0 rounded-md object-cover"
                />
              ) : (
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: theme.accentColor }}
                />
              )
            ) : null}

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold leading-snug">{link.title}</span>
              {config.showDescriptions && link.description ? (
                <span className="mt-0.5 block truncate text-[11px] opacity-70">
                  {link.description}
                </span>
              ) : null}
            </span>

            <ExternalLink className="size-3.5 shrink-0 opacity-45" />
          </>
        );

        const classes = cn(
          "group flex w-full items-center gap-3 text-left",
          config.layout === "grid" ? "px-3 py-3" : "px-4 py-3.5",
          interactive && "hover:-translate-y-0.5 hover:brightness-[1.03] active:translate-y-0",
        );

        const style = buttonStyle(theme);

        return interactive && link.id ? (
          <a
            key={link.id ?? index}
            href={`/l/${link.id}`}
            target="_blank"
            rel="noreferrer"
            className={classes}
            style={style}
          >
            {content}
          </a>
        ) : (
          <div key={link.id ?? index} className={classes} style={style}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

function SocialsWidget({
  config,
  socials,
  theme,
  interactive,
}: {
  config: WidgetConfigMap["socials"];
  socials: CanvasSocial[];
  theme: Theme;
  interactive: boolean;
}) {
  if (socials.length === 0) return null;

  const alignment = config.align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", alignment)}>
      {socials.map((social, index) => {
        const label = platformLabel(social.platform);
        const content =
          config.style === "pills" ? (
            <>
              <PlatformIcon platform={social.platform} className="size-4" />
              <span className="text-xs font-medium">{label}</span>
            </>
          ) : (
            <PlatformIcon platform={social.platform} className="size-4" />
          );

        const className = cn(
          "inline-flex items-center justify-center transition",
          config.style === "pills" ? "h-9 gap-2 px-3.5" : "size-10",
          interactive && "hover:-translate-y-0.5 hover:opacity-90",
        );

        const style = {
          borderRadius: "999px",
          background: mix(theme.textColor, 10),
          border: `1px solid ${mix(theme.textColor, 18)}`,
          color: theme.textColor,
        };

        const key = social.id ?? `${social.platform}-${index}`;

        return interactive && social.url ? (
          <a
            key={key}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={className}
            style={style}
          >
            {content}
          </a>
        ) : (
          <span key={key} className={className} style={style} aria-label={label}>
            {content}
          </span>
        );
      })}
    </div>
  );
}

function TextWidget({
  config,
  theme,
}: {
  config: WidgetConfigMap["text"];
  theme: Theme;
}) {
  if (!config.heading && !config.body) return null;

  return (
    <div
      className={cn("w-full", config.align === "center" ? "mx-auto max-w-[360px] text-center" : "text-left")}
    >
      {config.heading ? <h2 className="text-base font-semibold">{config.heading}</h2> : null}
      {config.body ? (
        <p
          className="mt-1.5 whitespace-pre-line text-sm leading-relaxed"
          style={{ color: theme.mutedColor }}
        >
          {config.body}
        </p>
      ) : null}
    </div>
  );
}

function ImageWidget({
  config,
  theme,
  interactive,
}: {
  config: WidgetConfigMap["image"];
  theme: Theme;
  interactive: boolean;
}) {
  if (!config.url) {
    return (
      <div
        className="flex aspect-[4/3] items-center justify-center border border-dashed text-xs"
        style={{
          borderRadius: shapeRadius(theme.buttonShape),
          borderColor: mix(theme.textColor, 22),
          color: theme.mutedColor,
        }}
      >
        Add an image URL to show it here
      </div>
    );
  }

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={config.url}
      alt={config.alt}
      className="max-h-[340px] w-full object-cover"
      style={{ borderRadius: shapeRadius(theme.buttonShape) }}
    />
  );

  return (
    <figure>
      {config.href && interactive ? (
        <a href={config.href} target="_blank" rel="noreferrer" className="block">
          {image}
        </a>
      ) : (
        image
      )}
      {config.caption ? (
        <figcaption className="mt-2 text-center text-xs" style={{ color: theme.mutedColor }}>
          {config.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function VideoWidget({
  config,
  theme,
  interactive,
}: {
  config: WidgetConfigMap["video"];
  theme: Theme;
  interactive: boolean;
}) {
  const embed = resolveEmbed(config.url);
  const radius = shapeRadius(theme.buttonShape);

  if (embed) {
    return (
      <figure>
        <div
          className="overflow-hidden"
          style={{ borderRadius: radius, border: `1px solid ${mix(theme.textColor, 16)}` }}
        >
          <div className="aspect-video w-full">
            <iframe
              src={embed.src}
              title={config.title || "Embedded video"}
              className="size-full"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
        {config.caption ? (
          <figcaption className="mt-2 text-center text-xs" style={{ color: theme.mutedColor }}>
            {config.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (!config.url) {
    return (
      <div
        className="flex aspect-video items-center justify-center gap-2 border border-dashed text-xs"
        style={{
          borderRadius: radius,
          borderColor: mix(theme.textColor, 22),
          color: theme.mutedColor,
        }}
      >
        <Play className="size-3.5" />
        Paste a YouTube or Vimeo link
      </div>
    );
  }

  return (
    <SmartLinkCard
      href={config.url}
      title={config.title || "Watch the video"}
      caption={config.caption}
      icon={<Play className="size-4" />}
      theme={theme}
      interactive={interactive}
    />
  );
}

function MusicWidget({
  config,
  theme,
  interactive,
}: {
  config: WidgetConfigMap["music"];
  theme: Theme;
  interactive: boolean;
}) {
  const embed = resolveEmbed(config.url);
  const radius = shapeRadius(theme.buttonShape);

  if (embed && embed.kind === "spotify") {
    return (
      <div
        className="overflow-hidden"
        style={{ borderRadius: radius, border: `1px solid ${mix(theme.textColor, 16)}` }}
      >
        <iframe
          src={embed.src}
          title={config.title || "Embedded track"}
          width="100%"
          height={embed.height ?? 152}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (!config.url) {
    return (
      <div
        className="flex h-16 items-center justify-center gap-2 border border-dashed text-xs"
        style={{
          borderRadius: radius,
          borderColor: mix(theme.textColor, 22),
          color: theme.mutedColor,
        }}
      >
        <Music className="size-3.5" />
        Paste a Spotify link
      </div>
    );
  }

  return (
    <SmartLinkCard
      href={config.url}
      title={config.title || "Listen"}
      icon={<Music className="size-4" />}
      theme={theme}
      interactive={interactive}
    />
  );
}

function ButtonWidget({
  config,
  theme,
  interactive,
}: {
  config: WidgetConfigMap["button"];
  theme: Theme;
  interactive: boolean;
}) {
  const label = config.label || "Learn more";
  const className =
    "flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition";
  const style = {
    borderRadius: shapeRadius(theme.buttonShape),
    background: theme.accentColor,
    color: readableOn(theme.accentColor, theme.buttonTextColor),
    border: "1px solid transparent",
    boxShadow: shadowValue(theme),
  };

  const content = (
    <>
      {label}
      <ArrowUpRight className="size-4" />
    </>
  );

  if (interactive && config.url) {
    return (
      <a href={config.url} target="_blank" rel="noreferrer" className={className} style={style}>
        {content}
      </a>
    );
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

function DividerWidget({
  config,
  theme,
}: {
  config: WidgetConfigMap["divider"];
  theme: Theme;
}) {
  if (config.style === "space") return <div className="h-2" />;

  if (config.style === "dots") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1 rounded-full"
            style={{ background: mix(theme.textColor, 35) }}
          />
        ))}
      </div>
    );
  }

  return <div className="h-px w-full" style={{ background: mix(theme.textColor, 18) }} />;
}

function SmartLinkCard({
  href,
  title,
  caption,
  icon,
  theme,
  interactive,
}: {
  href: string;
  title: string;
  caption?: string;
  icon: ReactNode;
  theme: Theme;
  interactive: boolean;
}) {
  const className = "flex w-full items-center gap-3 px-4 py-3.5 text-left";
  const style = buttonStyle(theme);
  const content = (
    <>
      <span className="shrink-0 opacity-80">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{title}</span>
        {caption ? <span className="mt-0.5 block truncate text-[11px] opacity-70">{caption}</span> : null}
      </span>
      <ArrowUpRight className="size-4 shrink-0 opacity-60" />
    </>
  );

  return interactive ? (
    <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
      {content}
    </a>
  ) : (
    <div className={className} style={style}>
      {content}
    </div>
  );
}
