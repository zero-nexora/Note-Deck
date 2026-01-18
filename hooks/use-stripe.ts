"use client";

import {
  checkStripeCheckoutSessionAction,
  createStripeCheckoutAction,
  getStripeCustomerPortalAction,
} from "@/domain/actions/stripe.action";
import { CreateSubscriptionInput } from "@/domain/schemas/stripe.schema";
import { toast } from "sonner";

export function useStripe() {
  const checkout = async (input: CreateSubscriptionInput) => {
    const result = await createStripeCheckoutAction(input);
    if (!result.success) return toast.error(result.message);
    if (result.data?.url) {
      window.location.href = result.data.url;
    }
  };

  const openCustomerPortal = async (workspaceId: string) => {
    const result = await getStripeCustomerPortalAction(workspaceId);
    if (!result.success) return toast.error(result.message);
    if (result.data?.url) {
      window.location.href = result.data.url;
    }
  };

  const checkCheckoutSession = async (sessionId: string) => {
    const result = await checkStripeCheckoutSessionAction({ sessionId });

    if (!result.success) {
      toast.error(result.message);
      return false;
    }

    return result.data?.valid === true;
  };

  return {
    checkout,
    openCustomerPortal,
    checkCheckoutSession,
  };
}
