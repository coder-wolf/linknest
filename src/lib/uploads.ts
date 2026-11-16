import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const IMAGE_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export class UploadError extends Error {}

function imageDetails(file: File) {
  const byType = IMAGE_TYPES[file.type];
  if (byType) return { extension: byType, contentType: file.type };

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const byExtension = IMAGE_EXTENSIONS[extension];
  if (byExtension) return { extension, contentType: byExtension };

  return null;
}

async function contentMatches(file: File, contentType: string) {
  const head = Buffer.from(await file.slice(0, 32).arrayBuffer());

  switch (contentType) {
    case "image/jpeg":
      return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
    case "image/png":
      return head.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
    case "image/gif": {
      const header = head.subarray(0, 6).toString("ascii");
      return header === "GIF87a" || header === "GIF89a";
    }
    case "image/webp":
      return (
        head.subarray(0, 4).toString("ascii") === "RIFF" &&
        head.subarray(8, 12).toString("ascii") === "WEBP"
      );
    case "image/avif": {
      if (head.subarray(4, 8).toString("ascii") !== "ftyp") return false;
      const brands = head.subarray(8).toString("ascii");
      return ["avif", "avis", "mif1", "msf1"].some((brand) => brands.includes(brand));
    }
    default:
      return false;
  }
}

/**
 * Stores a public avatar for a user in Vercel Blob. Previous uploads are
 * removed best-effort so profile photos don't pile up in storage.
 */
export async function uploadAvatar({
  userId,
  file,
  previousUrl,
}: {
  userId: string;
  file: File;
  previousUrl?: string | null;
}) {
  const details = imageDetails(file);
  if (!details) {
    throw new UploadError("Choose a JPG, PNG, WebP, GIF or AVIF image.");
  }
  if (file.size <= 0) {
    throw new UploadError("That image looks empty. Try another file.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new UploadError("Profile photos must be 5 MB or smaller.");
  }
  if (!(await contentMatches(file, details.contentType))) {
    throw new UploadError("That file doesn't look like a valid image.");
  }

  const limiter = rateLimit(await clientKey(`avatar:${userId}`), 20, 60 * 60 * 1000);
  if (!limiter.ok) {
    throw new UploadError("Too many photo uploads. Try again later.");
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new UploadError("Photo uploads aren't configured yet. Add a Vercel Blob token.");
  }

  const blob = await put(
    `avatars/${userId}/${randomUUID()}.${details.extension}`,
    file,
    {
      access: "public",
      contentType: details.contentType,
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    },
  );

  await removeAvatar(previousUrl);

  return blob.url;
}

/** Only deletes blobs in our own Vercel Blob store. */
export async function removeAvatar(url: string | null | undefined) {
  if (!url || !url.includes(".blob.vercel-storage.com")) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  try {
    await del(url);
  } catch (error) {
    console.error("Could not delete previous avatar", error);
  }
}
