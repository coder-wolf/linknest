import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiPinterest,
  SiSpotify,
  SiTelegram,
  SiTiktok,
  SiTwitch,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { PLATFORMS, type PlatformKey } from "@/lib/validation";

export const PLATFORM_ICONS: Record<PlatformKey, IconType> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  x: SiX,
  linkedin: FaLinkedinIn,
  github: SiGithub,
  pinterest: SiPinterest,
  twitch: SiTwitch,
  spotify: SiSpotify,
  discord: SiDiscord,
  telegram: SiTelegram,
  whatsapp: SiWhatsapp,
};

export function platformLabel(key: string) {
  return PLATFORMS.find((platform) => platform.key === key)?.label ?? key;
}

export function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = PLATFORM_ICONS[platform as PlatformKey];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden />;
}
