"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ profileId }: { profileId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profileId }),
      keepalive: true,
    }).catch(() => {
      // Analytics failures should never affect the visitor's experience.
    });
  }, [profileId]);

  return null;
}
