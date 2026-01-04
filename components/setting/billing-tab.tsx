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
import { Check, Crown, Zap, Rocket } from "lucide-react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

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
        <Button
          variant="outline"
          size="sm"
          disabled
          className="border-primary text-primary cursor-not-allowed"
        >
          <Check className="h-4 w-4 mr-2" />
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
        onClick={() => handleUpgrade(plan)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
      >
        Upgrade
      </Button>
    );
  };

  const getPlanIcon = (plan: "free" | "pro" | "enterprise") => {
    switch (plan) {
      case "free":
        return <Zap className="h-5 w-5 text-primary" />;
      case "pro":
        return <Crown className="h-5 w-5 text-primary" />;
      case "enterprise":
        return <Rocket className="h-5 w-5 text-primary" />;
    }
  };

  const renderPlanCard = (
    plan: "free" | "pro" | "enterprise",
    features: React.ReactNode
  ) => {
    const planData = STRIPE_PLANS[plan];
    const isCurrent = plan === currentPlan;

    return (
      <div
        className={`p-6 rounded-lg border transition-all ${
          isCurrent
            ? "border-primary bg-primary/5 shadow-lg"
            : "border-border bg-card hover:border-primary/50"
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getPlanIcon(plan)}
              <h3 className="font-bold text-xl text-foreground">
                {planData.name}
              </h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(planData.price)}
            </p>
          </div>
          {renderActionButton(plan)}
        </div>
        <ul className="space-y-3">{features}</ul>
      </div>
    );
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">
          Billing & Subscription
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your subscription and payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
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
    <Check className="h-4 w-4 text-primary shrink-0" />
    <span className="text-foreground">{children}</span>
  </li>
);
