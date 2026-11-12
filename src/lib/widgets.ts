import { z } from "zod";
import { httpUrlSchema } from "@/lib/validation";

export const WIDGET_TYPES = [
  "header",
  "links",
  "socials",
  "text",
  "image",
  "video",
  "music",
  "button",
  "divider",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export const WIDGET_META: Record<WidgetType, { label: string; description: string }> = {
  header: {
    label: "Profile header",
    description: "Avatar, name, handle and bio.",
  },
  links: {
    label: "Links",
    description: "Your tracked link buttons.",
  },
  socials: {
    label: "Social icons",
    description: "A row of platform links.",
  },
  text: {
    label: "Text block",
    description: "A heading and a short paragraph.",
  },
  image: {
    label: "Image",
    description: "A photo or artwork with caption.",
  },
  video: {
    label: "Video",
    description: "YouTube or Vimeo embed.",
  },
  music: {
    label: "Music",
    description: "Spotify embed or a link card.",
  },
  button: {
    label: "Call to action",
    description: "A single prominent button.",
  },
  divider: {
    label: "Divider",
    description: "A line, dots or breathing room.",
  },
};

const align = z.enum(["center", "left"]);
const optionalUrl = z.union([z.literal(""), httpUrlSchema]);

export const widgetConfigSchemas = {
  header: z.object({
    align,
    showAvatar: z.boolean(),
    showUsername: z.boolean(),
    showBio: z.boolean(),
  }),
  links: z.object({
    layout: z.enum(["stack", "grid"]),
    showDescriptions: z.boolean(),
    showIcons: z.boolean(),
  }),
  socials: z.object({
    style: z.enum(["icons", "pills"]),
    align,
  }),
  text: z.object({
    heading: z.string().trim().max(80),
    body: z.string().trim().max(400),
    align,
  }),
  image: z.object({
    url: optionalUrl,
    alt: z.string().trim().max(120),
    caption: z.string().trim().max(160),
    href: optionalUrl,
  }),
  video: z.object({
    url: optionalUrl,
    title: z.string().trim().max(80),
    caption: z.string().trim().max(160),
  }),
  music: z.object({
    url: optionalUrl,
    title: z.string().trim().max(80),
  }),
  button: z.object({
    label: z.string().trim().max(40),
    url: optionalUrl,
  }),
  divider: z.object({
    style: z.enum(["line", "dots", "space"]),
  }),
} as const;

export type WidgetConfigMap = {
  [K in WidgetType]: z.infer<(typeof widgetConfigSchemas)[K]>;
};

export type WidgetConfig = WidgetConfigMap[WidgetType];

export const DEFAULT_WIDGET_CONFIGS: WidgetConfigMap = {
  header: { align: "center", showAvatar: true, showUsername: true, showBio: true },
  links: { layout: "stack", showDescriptions: true, showIcons: true },
  socials: { style: "icons", align: "center" },
  text: { heading: "A little about me", body: "Use this space for a note, a schedule or a thank you.", align: "center" },
  image: { url: "", alt: "", caption: "", href: "" },
  video: { url: "", title: "Watch the latest", caption: "" },
  music: { url: "", title: "Now playing" },
  button: { label: "Get in touch", url: "" },
  divider: { style: "line" },
};

export function isWidgetType(value: string): value is WidgetType {
  return (WIDGET_TYPES as readonly string[]).includes(value);
}

export function parseWidgetConfig<K extends WidgetType>(
  type: K,
  value: unknown,
): WidgetConfigMap[K] {
  const result = widgetConfigSchemas[type].safeParse(value);
  return (result.success ? result.data : DEFAULT_WIDGET_CONFIGS[type]) as WidgetConfigMap[K];
}

export type WidgetRecord = {
  id: string;
  type: WidgetType;
  position: number;
  isVisible: boolean;
  config: unknown;
};

export const STARTER_WIDGETS: Array<{ type: WidgetType; config: WidgetConfig }> = [
  { type: "header", config: DEFAULT_WIDGET_CONFIGS.header },
  { type: "socials", config: DEFAULT_WIDGET_CONFIGS.socials },
  { type: "links", config: DEFAULT_WIDGET_CONFIGS.links },
];

export function widgetSummary(type: WidgetType, config: unknown) {
  switch (type) {
    case "header": {
      const parsed = parseWidgetConfig("header", config);
      return parsed.showBio ? "Avatar, name and bio" : "Avatar and name";
    }
    case "links": {
      const parsed = parseWidgetConfig("links", config);
      return parsed.layout === "grid" ? "Two-column grid" : "Stacked buttons";
    }
    case "socials": {
      const parsed = parseWidgetConfig("socials", config);
      return parsed.style === "pills" ? "Labelled pills" : "Icon row";
    }
    case "text": {
      const parsed = parseWidgetConfig("text", config);
      return parsed.heading || "Empty text block";
    }
    case "image": {
      const parsed = parseWidgetConfig("image", config);
      return parsed.url ? "Image added" : "No image yet";
    }
    case "video": {
      const parsed = parseWidgetConfig("video", config);
      return parsed.url ? parsed.title || "Embedded video" : "No video yet";
    }
    case "music": {
      const parsed = parseWidgetConfig("music", config);
      return parsed.url ? parsed.title || "Embedded track" : "No track yet";
    }
    case "button": {
      const parsed = parseWidgetConfig("button", config);
      return parsed.label || "Untitled button";
    }
    case "divider": {
      const parsed = parseWidgetConfig("divider", config);
      return parsed.style === "space"
        ? "Extra space"
        : parsed.style === "dots"
          ? "Dot divider"
          : "Hairline";
    }
  }
}
