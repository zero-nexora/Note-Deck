"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STRIPE_PLANS } from "@/lib/constants";
import { useConfirm } from "@/stores/confirm-store";
import { useStripe } from "@/hooks/use-stripe";
import { Check } from "lucide-react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import clsx from "clsx";

interface BillingTabProps {
  workspace: WorkspaceWithOwnerMembers;
}

const formatPrice = (price: number) => {
  if (price === 0) return "Free";
  return `$${price}/month`;
};

export const BillingTab = ({ workspace }: BillingTabProps) => {
  const { open } = useConfirm();
  const { checkout } = useStripe();

  const currentPlan = workspace.plan;

  const handleUpgrade = (plan: "pro" | "enterprise") => {
    const planData = STRIPE_PLANS[plan];

    open({
      title: `Upgrade to ${planData.name}`,
      description: `You will be charged $${planData.price}/month. Do you want to continue?`,
      onConfirm: async () => {
        await checkout(workspace.id, plan);
      },
    });
  };

  const renderActionButton = (plan: "free" | "pro" | "enterprise") => {
    if (plan === currentPlan) {
      return (
        <Button variant="outline" size="sm" disabled>
          Current plan
        </Button>
      );
    }

    if (plan === "free") {
      return null;
    }

    return (
      <Button
        size="sm"
        variant={plan === "enterprise" ? "outline" : "default"}
        onClick={() => handleUpgrade(plan)}
      >
        Upgrade
      </Button>
    );
  };

  const renderPlanCard = (
    plan: "free" | "pro" | "enterprise",
    features: React.ReactNode
  ) => {
    const planData = STRIPE_PLANS[plan];
    const isCurrent = plan === currentPlan;

    return (
      <div
        className={clsx(
          "p-4 rounded-lg border",
          isCurrent && "border-primary bg-primary/5",
          !isCurrent && "border-border"
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{planData.name}</h3>
            <p
              className={clsx(
                "text-2xl font-bold",
                isCurrent ? "text-primary" : "text-muted-foreground"
              )}
            >
              {formatPrice(planData.price)}
            </p>
          </div>

          {renderActionButton(plan)}
        </div>

        <ul className="space-y-2">{features}</ul>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and payment methods
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Free */}
        {renderPlanCard(
          "free",
          <>
            <Feature>{STRIPE_PLANS.free.limits.boards} boards</Feature>
            <Feature>
              {STRIPE_PLANS.free.limits.cardsPerBoard} cards per board
            </Feature>
            <Feature>
              {STRIPE_PLANS.free.limits.membersPerWorkspace} members
            </Feature>
          </>
        )}

        {/* Pro */}
        {renderPlanCard(
          "pro",
          <>
            <Feature>{STRIPE_PLANS.pro.limits.boards} boards</Feature>
            <Feature>
              {STRIPE_PLANS.pro.limits.cardsPerBoard} cards per board
            </Feature>
            <Feature>
              {STRIPE_PLANS.pro.limits.membersPerWorkspace} members
            </Feature>
          </>
        )}

        {/* Enterprise */}
        {renderPlanCard(
          "enterprise",
          <>
            <Feature>Unlimited boards</Feature>
            <Feature>Unlimited cards</Feature>
            <Feature>Unlimited members</Feature>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Feature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2 text-sm">
    <Check className="h-4 w-4 text-primary" />
    <span>{children}</span>
  </li>
);
