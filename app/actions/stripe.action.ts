"use server";

import { stripeService } from "@/domain/services/stripe.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createStripeCheckoutAction = async (
  workspaceId: string,
  plan: "pro" | "enterprise"
) => {
  try {
    await requireAuth();

    if (!workspaceId || !plan) {
      return error("Invalid input");
    }

    const session = await stripeService.create(workspaceId, plan);

    return success("Checkout session created", {
      url: session.url,
    });
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getStripeCustomerPortalAction = async (workspaceId: string) => {
  try {
    await requireAuth();

    if (!workspaceId) {
      return error("Invalid workspace ID");
    }

    const url = await stripeService.getCustomerPortalUrl(workspaceId);

    return success("Customer portal URL retrieved", { url });
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
