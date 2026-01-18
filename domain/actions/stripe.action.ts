"use server";

import { stripeService } from "@/domain/services/stripe.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";
import {
  CreateSubscriptionSchema,
  CreateSubscriptionInput,
  CheckSessionInput,
  CheckSessionSchema,
} from "@/domain/schemas/stripe.schema";

export const createStripeCheckoutAction = async (
  input: CreateSubscriptionInput,
) => {
  try {
    await requireAuth();

    const parsed = CreateSubscriptionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const session = await stripeService.create(parsed.data);

    return success("Checkout session created", { url: session.url });
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

export const checkStripeCheckoutSessionAction = async (
  input: CheckSessionInput,
) => {
  try {
    await requireAuth();

    const parsed = CheckSessionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const isValid = await stripeService.checkSession(parsed.data);

    return success("Session checked", { valid: isValid });
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
