export type PlanKey = "FREE" | "PRO" | "BUSINESS";

export type Plan = {
  key: PlanKey;
  name: string;
  price: string;
  cadence: string;
  description: string;
  recommended?: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    key: "FREE",
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For casual users who want one tidy page.",
    features: [
      "One public profile",
      "Up to 10 basic links",
      "Up to 6 page-builder widgets",
      "Basic themes",
      "Basic analytics",
      "LinkNest branding",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    price: "$4",
    cadence: "per month",
    description: "For creators and professionals.",
    recommended: true,
    features: [
      "Everything in Free",
      "Up to 200 links",
      "Up to 24 page-builder widgets",
      "Remove LinkNest branding",
      "All 15 themes + premium mono font",
      "Custom background images",
      "Link thumbnails & icons",
      "Advanced analytics (30/90 days, devices, sources)",
      "Scheduled links (coming soon)",
    ],
  },
  {
    key: "BUSINESS",
    name: "Business",
    price: "$8",
    cadence: "per month",
    description: "For businesses and power users.",
    features: [
      "Everything in Pro",
      "Custom domains (coming soon)",
      "Multiple profiles (coming soon)",
      "Lead capture (coming soon)",
      "Email integrations (coming soon)",
      "Team collaboration (coming soon)",
    ],
  },
];
