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
      "Unlimited basic links",
      "Basic themes",
      "Basic analytics",
      "LinkNest branding",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    price: "$5",
    cadence: "per month",
    description: "For creators and professionals.",
    recommended: true,
    features: [
      "Everything in Free",
      "Remove LinkNest branding",
      "Advanced themes & fonts",
      "Custom backgrounds",
      "Advanced analytics",
      "Scheduled links",
    ],
  },
  {
    key: "BUSINESS",
    name: "Business",
    price: "$12",
    cadence: "per month",
    description: "For businesses and power users.",
    features: [
      "Everything in Pro",
      "Custom domains",
      "Multiple profiles",
      "Lead capture",
      "Email integrations",
      "Team collaboration",
    ],
  },
];
