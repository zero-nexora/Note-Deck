import { workspaceRepository } from "../repositories/workspace.repository";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import Stripe from "stripe";
import { db } from "@/db";
import { workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  Plan,
  PLAN,
  SUBSCRIPTION_STATUS,
  SubscriptionStatus,
} from "@/lib/constants";
import { CreateSubscriptionInput } from "../schemas/stripe.schema";

export const stripeService = {
  create: async (data: CreateSubscriptionInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    const plan = data.plan;

    let customerId = workspace?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { workspaceId: data.workspaceId },
      });

      customerId = customer.id;

      await db
        .update(workspaces)
        .set({ stripeCustomerId: customerId })
        .where(eq(workspaces.id, data.workspaceId));
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PLANS[plan].priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/workspaces/${data.workspaceId}/billing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/workspaces/${data.workspaceId}/billing/cancel`,
      metadata: { workspaceId: data.workspaceId, plan },
      subscription_data: { metadata: { workspaceId: data.workspaceId, plan } },
    });

    return session;
  },

  handleSubscriptionCreated: async (session: Stripe.Checkout.Session) => {
    const workspaceId = session.metadata!.workspaceId;
    const plan = session.metadata!.plan as Plan;

    if (!workspaceId || !plan) throw new Error("Missing subscription metadata");

    await workspaceRepository.update(workspaceId, {
      plan,
      stripeSubscriptionId: session.subscription as string,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      limits: STRIPE_PLANS[plan].limits,
    });
  },

  handleSubscriptionUpdated: async (subscription: Stripe.Subscription) => {
    const workspaceId = subscription.metadata.workspaceId;
    if (!workspaceId) throw new Error("Missing subscription metadata");

    await workspaceRepository.update(workspaceId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status as SubscriptionStatus,
    });
  },

  handleSubscriptionDeleted: async (subscription: Stripe.Subscription) => {
    const workspaceId = subscription.metadata.workspaceId;
    if (!workspaceId) throw new Error("Missing subscription metadata");

    const plan = PLAN.FREE;

    await workspaceRepository.update(workspaceId, {
      plan,
      stripeSubscriptionId: null,
      subscriptionStatus: SUBSCRIPTION_STATUS.CANCELED,
      limits: STRIPE_PLANS[plan].limits,
    });
  },

  getCustomerPortalUrl: async (workspaceId: string) => {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace?.stripeCustomerId)
      throw new Error("Workspace does not have a Stripe Customer ID");

    const session = await stripe.billingPortal.sessions.create({
      customer: workspace.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/workspaces/${workspaceId}`,
    });

    return session.url;
  },
};
