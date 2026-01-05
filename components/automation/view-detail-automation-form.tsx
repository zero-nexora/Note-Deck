import { AutomationDetails } from "@/domain/types/automation.type";
import { useModal } from "@/stores/modal-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Zap, ArrowRight } from "lucide-react";
import { AUTOMATION_ACTIONS, AUTOMATION_TRIGGERS } from "@/lib/automation";
import { LabelDetail } from "@/domain/types/label.type";
import { BoardWithUser } from "@/domain/types/board-member.type";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ViewDetailAutomationFormProps {
  automation: AutomationDetails;
  boardMembers: BoardWithUser[];
  labels: LabelDetail[];
}

export const ViewDetailAutomationForm = ({
  automation,
  boardMembers,
  labels,
}: ViewDetailAutomationFormProps) => {
  const { close } = useModal();

  const triggerData = automation.trigger as any;
  const actionsData = automation.actions as any[];

  const trigger = AUTOMATION_TRIGGERS.find((t) => t.id === triggerData?.type);

  const getUserName = (userId: string) => {
    const member = boardMembers.find((m) => m.userId === userId);
    return member?.user.name || member?.user.email || "Unknown User";
  };

  const getLabelName = (labelId: string) => {
    const label = labels.find((l) => l.id === labelId);
    return label?.name || "Unknown Label";
  };

  const renderTriggerValue = (fieldName: string, value: any) => {
    if (!value) return null;
    if (fieldName === "userId") return getUserName(value);
    if (fieldName === "labelId") return getLabelName(value);
    return value;
  };

  const renderActionValue = (fieldName: string, value: any) => {
    if (!value) return null;
    if (fieldName === "userId") return getUserName(value);
    if (fieldName === "labelId") return getLabelName(value);

    if (fieldName === "notificationType") {
      const typeLabels: Record<string, string> = {
        mention: "Mention",
        due_date: "Due Date",
        assignment: "Assignment",
        comment: "Comment",
        card_moved: "Card Moved",
      };
      return typeLabels[value] || value;
    }

    return value;
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            {automation.name}
          </h2>
        </div>
        <Badge
          className={
            automation.isActive
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }
        >
          {automation.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Separator className="bg-border" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
            1
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            When this happens...
          </h3>
        </div>

        {trigger && (
          <Card className="border-border bg-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {trigger.icon && (
                  <trigger.icon className="h-5 w-5 text-primary" />
                )}
                <CardTitle className="text-base text-foreground">
                  {trigger.name}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {trigger.description}
              </CardDescription>
            </CardHeader>
            {trigger.fields && trigger.fields.length > 0 && (
              <CardContent className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Configuration:
                </p>
                {trigger.fields.map((field) => {
                  const value = triggerData[field.name];
                  if (!value) return null;

                  return (
                    <div
                      key={field.name}
                      className="flex items-center justify-between p-3 bg-background rounded-md border border-border"
                    >
                      <span className="text-sm text-muted-foreground">
                        {field.label}:
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {renderTriggerValue(field.name, value)}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            )}
          </Card>
        )}
      </div>

      <div className="flex items-center justify-center">
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
            2
          </div>
          <h3 className="text-lg font-semibold text-foreground">Do this...</h3>
        </div>

        {actionsData.length === 0 ? (
          <Card className="border-2 border-dashed border-border bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No actions configured
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {actionsData.map((actionData, index) => {
              const action = AUTOMATION_ACTIONS.find(
                (a) => a.id === actionData.type
              );
              if (!action) return null;

              return (
                <Card key={index} className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {action.icon && (
                        <action.icon className="h-5 w-5 text-primary" />
                      )}
                      <CardTitle className="text-base text-foreground">
                        Action {index + 1}: {action.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  {action.fields && action.fields.length > 0 && (
                    <CardContent className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        Configuration:
                      </p>
                      {action.fields.map((field) => {
                        const value = actionData[field.name];
                        if (!value) return null;

                        return (
                          <div
                            key={field.name}
                            className="space-y-1 p-3 bg-muted/50 rounded-md"
                          >
                            <span className="text-xs text-muted-foreground">
                              {field.label}:
                            </span>
                            <p className="text-sm font-medium text-foreground wrap-break-word">
                              {renderActionValue(field.name, value)}
                            </p>
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Separator className="bg-border" />

      <div className="flex justify-end sticky bottom-0 bg-background pt-4">
        <Button
          variant="outline"
          onClick={close}
          className="border-border text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
