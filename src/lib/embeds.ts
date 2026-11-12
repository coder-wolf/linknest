export type EmbedKind = "youtube" | "vimeo" | "spotify";

export type Embed = {
  kind: EmbedKind;
  src: string;
  /** Fixed height for audio embeds, aspect video otherwise. */
  height?: number;
};

function safeUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

const ID = /^[A-Za-z0-9_-]{2,}$/;

function youtubeId(url: URL) {
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID.test(id) ? id : null;
  }
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;

  if (url.pathname.startsWith("/shorts/")) {
    const id = url.pathname.split("/")[2];
    return id && ID.test(id) ? id : null;
  }
  if (url.pathname.startsWith("/embed/")) {
    const id = url.pathname.split("/")[2];
    return id && ID.test(id) ? id : null;
  }
  const id = url.searchParams.get("v");
  return id && ID.test(id) ? id : null;
}

function vimeoId(url: URL) {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const candidate = parts[0] === "video" ? parts[1] : parts[0];
  return candidate && /^\d{5,}$/.test(candidate) ? candidate : null;
}

function spotifyEmbed(url: URL) {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "open.spotify.com") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const [kind, id] = parts;
  const supported = ["track", "album", "playlist", "episode", "show", "artist"];
  if (!supported.includes(kind) || !ID.test(id)) return null;
  return {
    src: `https://open.spotify.com/embed/${kind}/${id}`,
    height: kind === "track" || kind === "episode" ? 152 : 352,
  };
}

/**
 * Turns a user-supplied URL into an allowlisted embed. Raw iframe URLs are
 * never rendered, which keeps the public page free of arbitrary embeds.
 */
export function resolveEmbed(value: string | null | undefined): Embed | null {
  if (!value) return null;
  const url = safeUrl(value);
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:")) return null;

  const youtube = youtubeId(url);
  if (youtube) {
    return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtube}` };
  }

  const vimeo = vimeoId(url);
  if (vimeo) {
    return { kind: "vimeo", src: `https://player.vimeo.com/video/${vimeo}` };
  }

  const spotify = spotifyEmbed(url);
  if (spotify) {
    return { kind: "spotify", src: spotify.src, height: spotify.height };
  }

  return null;
}

export function embedKindLabel(kind: EmbedKind) {
  if (kind === "spotify") return "Spotify";
  if (kind === "vimeo") return "Vimeo";
  return "YouTube";
}
