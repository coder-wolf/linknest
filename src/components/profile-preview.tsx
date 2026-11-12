import { ProfileCanvas, type CanvasWidget } from "@/components/profile-canvas";
import { DEFAULT_WIDGET_CONFIGS } from "@/lib/widgets";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/themes";

export type PreviewLink = {
  id?: string;
  title: string;
  description?: string | null;
  iconUrl?: string | null;
};

export type PreviewSocial = {
  id?: string;
  platform: string;
  url?: string | null;
};

/**
 * Static, non-interactive rendering of a profile. Used on marketing pages and
 * in onboarding, where there is no saved widget list yet.
 */
export function ProfilePreview({
  displayName,
  username,
  bio,
  avatarUrl,
  links,
  socials,
  theme,
  showBranding = true,
  className,
}: {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  links: PreviewLink[];
  socials: PreviewSocial[];
  theme: Theme;
  showBranding?: boolean;
  className?: string;
}) {
  const widgets: CanvasWidget[] = [
    {
      id: "preview-header",
      type: "header",
      config: { ...DEFAULT_WIDGET_CONFIGS.header, showBio: Boolean(bio) },
    },
  ];

  if (socials.length > 0) {
    widgets.push({
      id: "preview-socials",
      type: "socials",
      config: DEFAULT_WIDGET_CONFIGS.socials,
    });
  }

  widgets.push({
    id: "preview-links",
    type: "links",
    config: DEFAULT_WIDGET_CONFIGS.links,
  });

  return (
    <ProfileCanvas
      profile={{ displayName: displayName || "Your name", username: username || "username", bio, avatarUrl }}
      links={links}
      socials={socials}
      widgets={widgets}
      theme={theme}
      showBranding={showBranding}
      interactive={false}
      className={cn("rounded-[28px] border border-black/10 shadow-xl", className)}
    />
  );
}
