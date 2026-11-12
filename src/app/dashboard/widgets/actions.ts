"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import {
  DEFAULT_WIDGET_CONFIGS,
  isWidgetType,
  STARTER_WIDGETS,
  widgetConfigSchemas,
  type WidgetType,
} from "@/lib/widgets";

export type WidgetState = {
  error?: string;
  success?: string;
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function revalidate(username: string) {
  revalidatePath("/dashboard/widgets");
  revalidatePath("/dashboard/appearance");
  revalidatePath("/dashboard");
  revalidatePath(`/${username}`);
}

async function nextPosition(profileId: string) {
  const last = await prisma.widget.findFirst({
    where: { profileId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return (last?.position ?? -1) + 1;
}

export async function addWidgetAction(
  _prev: WidgetState,
  formData: FormData,
): Promise<WidgetState> {
  const { profile } = await requireProfile();
  const type = text(formData, "type");
  if (!isWidgetType(type)) return { error: "Choose a widget type." };

  const count = await prisma.widget.count({ where: { profileId: profile.id } });
  if (count >= 24) return { error: "You can add up to 24 widgets." };

  await prisma.widget.create({
    data: {
      profileId: profile.id,
      type,
      position: await nextPosition(profile.id),
      config: DEFAULT_WIDGET_CONFIGS[type] as Prisma.InputJsonValue,
    },
  });

  revalidate(profile.username);
  return { success: `${type[0].toUpperCase()}${type.slice(1)} widget added` };
}

function configFromForm(type: WidgetType, formData: FormData): unknown {
  switch (type) {
    case "header":
      return {
        align: formData.get("align"),
        showAvatar: checkbox(formData, "showAvatar"),
        showUsername: checkbox(formData, "showUsername"),
        showBio: checkbox(formData, "showBio"),
      };
    case "links":
      return {
        layout: formData.get("layout"),
        showDescriptions: checkbox(formData, "showDescriptions"),
        showIcons: checkbox(formData, "showIcons"),
      };
    case "socials":
      return { style: formData.get("style"), align: formData.get("align") };
    case "text":
      return {
        heading: text(formData, "heading"),
        body: text(formData, "body"),
        align: formData.get("align"),
      };
    case "image":
      return {
        url: text(formData, "url"),
        alt: text(formData, "alt"),
        caption: text(formData, "caption"),
        href: text(formData, "href"),
      };
    case "video":
      return {
        url: text(formData, "url"),
        title: text(formData, "title"),
        caption: text(formData, "caption"),
      };
    case "music":
      return { url: text(formData, "url"), title: text(formData, "title") };
    case "button":
      return { label: text(formData, "label"), url: text(formData, "url") };
    case "divider":
      return { style: formData.get("style") };
  }
}

export async function updateWidgetAction(
  _prev: WidgetState,
  formData: FormData,
): Promise<WidgetState> {
  const { profile } = await requireProfile();
  const widgetId = text(formData, "widgetId");
  if (!widgetId) return { error: "Widget not found." };

  const widget = await prisma.widget.findFirst({
    where: { id: widgetId, profileId: profile.id },
    select: { id: true, type: true },
  });
  if (!widget) return { error: "Widget not found." };

  const parsed = widgetConfigSchemas[widget.type].safeParse(
    configFromForm(widget.type, formData),
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the widget settings." };
  }

  await prisma.widget.update({
    where: { id: widget.id },
    data: { config: parsed.data as Prisma.InputJsonValue },
  });

  revalidate(profile.username);
  return { success: "Widget updated" };
}

export async function deleteWidgetAction(formData: FormData) {
  const { profile } = await requireProfile();
  const widgetId = text(formData, "widgetId");
  if (!widgetId) return;

  const widget = await prisma.widget.findFirst({
    where: { id: widgetId, profileId: profile.id },
    select: { id: true, position: true },
  });
  if (!widget) return;

  await prisma.$transaction([
    prisma.widget.delete({ where: { id: widget.id } }),
    prisma.widget.updateMany({
      where: { profileId: profile.id, position: { gt: widget.position } },
      data: { position: { decrement: 1 } },
    }),
  ]);

  revalidate(profile.username);
}

export async function toggleWidgetAction(formData: FormData) {
  const { profile } = await requireProfile();
  const widgetId = text(formData, "widgetId");
  if (!widgetId) return;

  const widget = await prisma.widget.findFirst({
    where: { id: widgetId, profileId: profile.id },
    select: { id: true, isVisible: true },
  });
  if (!widget) return;

  await prisma.widget.update({
    where: { id: widget.id },
    data: { isVisible: !widget.isVisible },
  });

  revalidate(profile.username);
}

export async function reorderWidgetsAction(orderedIds: string[]) {
  const { profile } = await requireProfile();
  const owned = await prisma.widget.findMany({
    where: { profileId: profile.id },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((widget) => widget.id));
  const ids = orderedIds.filter((id) => ownedIds.has(id));
  if (ids.length === 0) return;

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.widget.update({ where: { id }, data: { position: index } }),
    ),
  );

  revalidate(profile.username);
}

export async function createStarterWidgetsAction() {
  const { profile } = await requireProfile();
  const count = await prisma.widget.count({ where: { profileId: profile.id } });
  if (count > 0) return;

  await prisma.widget.createMany({
    data: STARTER_WIDGETS.map((widget, index) => ({
      profileId: profile.id,
      type: widget.type,
      position: index,
      config: widget.config as Prisma.InputJsonValue,
    })),
  });

  revalidate(profile.username);
}
