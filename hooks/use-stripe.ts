"use client";

import {
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

  return {
    checkout,
    openCustomerPortal,
  };
}
