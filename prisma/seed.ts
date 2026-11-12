import { PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

let seed = 42;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function pick<T>(items: T[]) {
  return items[Math.floor(random() * items.length)];
}

async function main() {
  const email = "demo@linknest.com";
  const password = "password123";

  await prisma.user.deleteMany({ where: { email } });

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      subscription: { create: { plan: "FREE" } },
      profile: {
        create: {
          username: "mima",
          displayName: "Mima Sánchez",
          bio: "Illustrator & printmaker. Small things, made slowly. Currently in Lisbon.",
          isPublished: true,
          theme: {
            preset: "bloom",
            background:
              "radial-gradient(110% 90% at 18% 0%, #ffe4ee 0%, transparent 58%), linear-gradient(160deg, #fdf3f7 0%, #f6dcea 55%, #edd4e8 100%)",
            textColor: "#4a2039",
            mutedColor: "#8a5f7b",
            accentColor: "#d23f7a",
            buttonColor: "#ffffff",
            buttonTextColor: "#4a2039",
            cardColor: "rgba(255, 255, 255, 0.66)",
            buttonStyle: "glass",
            buttonShape: "pill",
            shadow: "soft",
            font: "serif",
            layout: "card",
            texture: "noise",
            avatarShape: "circle",
            backgroundImageUrl: null,
          },
          widgets: {
            create: [
              {
                type: "header",
                position: 0,
                config: { align: "center", showAvatar: true, showUsername: true, showBio: true },
              },
              {
                type: "socials",
                position: 1,
                config: { style: "icons", align: "center" },
              },
              {
                type: "text",
                position: 2,
                config: {
                  heading: "In the studio",
                  body: "Lisbon · open for two commissions this month.",
                  align: "center",
                },
              },
              {
                type: "links",
                position: 3,
                config: { layout: "stack", showDescriptions: true, showIcons: true },
              },
              {
                type: "music",
                position: 4,
                config: {
                  url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
                  title: "Studio playlist",
                },
              },
              {
                type: "button",
                position: 5,
                config: { label: "Book a commission", url: "https://example.com/commissions" },
              },
            ],
          },
          links: {
            create: [
              {
                title: "Latest print drop",
                url: "https://example.com/prints",
                description: "Six new risograph pieces",
                position: 0,
              },
              {
                title: "Portfolio & case studies",
                url: "https://example.com/portfolio",
                description: "Selected client work",
                position: 1,
              },
              {
                title: "Watch the studio tour",
                url: "https://example.com/studio",
                description: "12 minutes, very cozy",
                position: 2,
              },
              {
                title: "Book a commission",
                url: "https://example.com/commissions",
                description: "Two slots open this month",
                position: 3,
              },
            ],
          },
          socials: {
            create: [
              { platform: "instagram", url: "https://instagram.com/example", position: 0 },
              { platform: "x", url: "https://x.com/example", position: 1 },
              { platform: "youtube", url: "https://youtube.com/@example", position: 2 },
              { platform: "spotify", url: "https://open.spotify.com/artist/example", position: 3 },
            ],
          },
        },
      },
    },
    include: { profile: { include: { links: true } } },
  });

  const profile = user.profile;
  if (!profile) throw new Error("Seed profile missing");

  const devices = ["mobile", "mobile", "mobile", "desktop", "tablet"];
  const referrers = ["instagram.com", "x.com", "google.com", null, null, "youtube.com"];
  const events: Prisma.AnalyticsEventCreateManyInput[] = [];

  for (let daysAgo = 13; daysAgo >= 0; daysAgo -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(9, 0, 0, 0);

    const viewCount = Math.round(18 + random() * 42);
    const clickCount = Math.round(viewCount * (0.22 + random() * 0.18));

    for (let index = 0; index < viewCount; index += 1) {
      events.push({
        profileId: profile.id,
        type: "VIEW",
        createdAt: new Date(date.getTime() + Math.round(random() * 12 * 60 * 60 * 1000)),
        device: pick(devices),
        referrer: pick(referrers),
        visitorId: `seed-${daysAgo}-${index % Math.max(1, Math.round(viewCount * 0.7))}`,
      });
    }

    for (let index = 0; index < clickCount; index += 1) {
      events.push({
        profileId: profile.id,
        type: "CLICK",
        linkId: pick(profile.links).id,
        createdAt: new Date(date.getTime() + Math.round(random() * 12 * 60 * 60 * 1000)),
        device: pick(devices),
        referrer: pick(referrers),
        visitorId: `seed-${daysAgo}-${index % Math.max(1, Math.round(clickCount * 0.7))}`,
      });
    }
  }

  await prisma.analyticsEvent.createMany({ data: events });

  const clickCounts = new Map<string, number>();
  for (const event of events) {
    if (event.type === "CLICK" && event.linkId) {
      clickCounts.set(event.linkId, (clickCounts.get(event.linkId) ?? 0) + 1);
    }
  }
  await Promise.all(
    [...clickCounts].map(([id, count]) =>
      prisma.link.update({ where: { id }, data: { clicks: count } }),
    ),
  );

  console.info(`Seeded demo account: ${email} / ${password}`);
  console.info(`Public page: /mima`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
