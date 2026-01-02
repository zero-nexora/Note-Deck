"use client";

import { createStripeCheckoutAction } from "@/app/actions/stripe.action";
import { toast } from "sonner";

export function useStripe() {
  const checkout = async (workspaceId: string, plan: "pro" | "enterprise") => {
    try {
      const result = await createStripeCheckoutAction(workspaceId, plan);

      if (result.success && result.data) {
        window.location.href = result.data.url as string;
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    checkout,
  };
}
