import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  _stripe = new Stripe(secret, {
    apiVersion: "2025-11-17.clover",
    typescript: true,
  });

  return _stripe;
}

export const STRIPE_PLANS = {
  free: {
    name: "Free",
    priceId: process.env.STRIPE_FREE_PRICE_ID!,
    limits: {
      boards: 10,
      cardsPerBoard: 100,
      membersPerWorkspace: 10,
    },
  },

  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      boards: 100,
      cardsPerBoard: 1000,
      membersPerWorkspace: 50,
    },
  },

  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    limits: {
      boards: -1,
      cardsPerBoard: -1,
      membersPerWorkspace: -1,
    },
  },
} as const;
