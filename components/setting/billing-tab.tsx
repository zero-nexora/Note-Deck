"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useConfirm } from "@/stores/confirm-store";
import { useStripe } from "@/hooks/use-stripe";
import {
  Check,
  Crown,
  Zap,
  Rocket,
  CreditCard,
  LayoutGrid,
  Users,
} from "lucide-react";
import {
  WorkspaceWithLimits,
  WorkspaceWithOwnerMembers,
} from "@/domain/types/workspace.type";
import {
  CLIENT_STRIPE_PLANS,
  Plan,
  PLAN_HIERARCHY,
  UpgradePlan,
} from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

interface BillingTabProps {
  workspace: WorkspaceWithOwnerMembers;
  workspaceLimits: WorkspaceWithLimits | null;
}

export const BillingTab = ({ workspace, workspaceLimits }: BillingTabProps) => {
  const { open } = useConfirm();
  const { checkout } = useStripe();
  const currentPlan = workspace.plan;
  const { openCustomerPortal } = useStripe();

  const handleUpgrade = (plan: UpgradePlan) => {
    const planData = CLIENT_STRIPE_PLANS[plan];
    open({
      title: `Upgrade to ${planData.name}`,
      description: `You will be charged $${planData.price}/month. Do you want to continue?`,
      onConfirm: async () => {
        await checkout({ workspaceId: workspace.id, plan });
      },
    });
  };

  const renderActionButton = (plan: Plan) => {
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

    const isDowngrade = PLAN_HIERARCHY[plan] < PLAN_HIERARCHY[currentPlan];

    if (isDowngrade) {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="cursor-not-allowed"
        >
          Contact Support
        </Button>
      );
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

  const getPlanIcon = (plan: Plan) => {
    switch (plan) {
      case "free":
        return <Zap className="h-5 w-5 text-primary" />;
      case "pro":
        return <Crown className="h-5 w-5 text-primary" />;
      case "enterprise":
        return <Rocket className="h-5 w-5 text-primary" />;
    }
  };

  const getProgressVariant = (percentage: number) => {
    if (percentage >= 90) return "destructive";
    if (percentage >= 75) return "warning";
    return "default";
  };

  const renderUsageCard = (
    icon: React.ReactNode,
    label: string,
    current: number,
    limit: number,
  ) => {
    const isUnlimited = limit === -1;
    const percentage = isUnlimited ? 0 : (current / limit) * 100;
    const variant = getProgressVariant(percentage);

    return (
      <div className="p-4 rounded-lg border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-sm text-foreground">{label}</span>
          </div>
          <Badge
            variant={
              isUnlimited
                ? "secondary"
                : variant === "destructive"
                  ? "destructive"
                  : "secondary"
            }
            className="text-xs"
          >
            {isUnlimited ? "Unlimited" : `${current}/${limit}`}
          </Badge>
        </div>

        {!isUnlimited && (
          <>
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {percentage.toFixed(0)}% used
              {percentage >= 90 && " - Consider upgrading"}
            </p>
          </>
        )}

        {isUnlimited && (
          <p className="text-xs text-muted-foreground">
            No limits on {label.toLowerCase()}
          </p>
        )}
      </div>
    );
  };

  const renderPlanCard = (plan: Plan, features: React.ReactNode) => {
    const planData = CLIENT_STRIPE_PLANS[plan];
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
    <div className="space-y-6">
      {workspaceLimits && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Current Usage</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monitor your workspace resource consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {renderUsageCard(
              <LayoutGrid className="h-4 w-4 text-primary" />,
              "Boards",
              workspaceLimits.usage.boards,
              workspaceLimits.limits.boards,
            )}
            {renderUsageCard(
              <Users className="h-4 w-4 text-primary" />,
              "Members",
              workspaceLimits.usage.members,
              workspaceLimits.limits.membersPerWorkspace,
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-foreground">
              Billing & Subscription
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your subscription and payment methods
            </CardDescription>
          </div>

          <Button
            onClick={() => openCustomerPortal(workspace.id)}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Manage Billing
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {renderPlanCard(
            "free",
            <>
              <Feature>{CLIENT_STRIPE_PLANS.free.limits.boards} boards</Feature>
              <Feature>
                {CLIENT_STRIPE_PLANS.free.limits.cardsPerBoard} cards per board
              </Feature>
              <Feature>
                {CLIENT_STRIPE_PLANS.free.limits.membersPerWorkspace} members
              </Feature>
            </>,
          )}

          {renderPlanCard(
            "pro",
            <>
              <Feature>{CLIENT_STRIPE_PLANS.pro.limits.boards} boards</Feature>
              <Feature>
                {CLIENT_STRIPE_PLANS.pro.limits.cardsPerBoard} cards per board
              </Feature>
              <Feature>
                {CLIENT_STRIPE_PLANS.pro.limits.membersPerWorkspace} members
              </Feature>
            </>,
          )}

          {renderPlanCard(
            "enterprise",
            <>
              <Feature>Unlimited boards</Feature>
              <Feature>Unlimited cards</Feature>
              <Feature>Unlimited members</Feature>
            </>,
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Feature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2 text-sm">
    <Check className="h-4 w-4 text-primary shrink-0" />
    <span className="text-foreground">{children}</span>
  </li>
);
