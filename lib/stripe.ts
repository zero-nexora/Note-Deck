import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export const STRIPE_PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: process.env.STRIPE_FREE_PRICE_ID!,
    limits: {
      boards: 10,
      cardsPerBoard: 100,
      membersPerWorkspace: 10,
    },
  },

  pro: {
    name: "Pro",
    price: 12,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      boards: 100,
      cardsPerBoard: 1000,
      membersPerWorkspace: 50,
    },
  },

  enterprise: {
    name: "Enterprise",
    price: 40,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    limits: {
      boards: -1,
      cardsPerBoard: -1,
      membersPerWorkspace: -1,
    },
  },
} as const;
