"use client";

import { AutomationDetails } from "@/domain/types/automation.type";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Calendar, ChevronRight, Pencil, Trash2, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useAutomation } from "@/hooks/use-automation";
import { useConfirm } from "@/stores/confirm-store";
import { useModal } from "@/stores/modal-store";
import { UpdateAutomationForm } from "./update-automation-form";
import { BoardWithUser } from "@/domain/types/board-member.type";
import { LabelDetail } from "@/domain/types/label.type";
import { ViewDetailAutomationForm } from "./view-detail-automation-form";

interface AutomationItemProps {
  automation: AutomationDetails;
  boardMembers: BoardWithUser[];
  labels: LabelDetail[];
}

export const AutomationListItem = ({
  automation,
  boardMembers,
  labels,
}: AutomationItemProps) => {
  const { deleteAutomation, enableAutomation, disableAutomation } =
    useAutomation();
  const { open: openConfirm } = useConfirm();
  const { open: openModal } = useModal();

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await enableAutomation({ id: automation.id });
    } else {
      await disableAutomation({ id: automation.id });
    }
  };

  const handleEdit = () => {
    openModal({
      title: "Edit Automation",
      description: "Update your automation details",
      children: (
        <UpdateAutomationForm
          boardMembers={boardMembers}
          labels={labels}
          automation={automation}
        />
      ),
    });
  };

  const handleDelete = () => {
    openConfirm({
      title: "Delete Automation",
      description:
        "Are you sure you want to delete this automation? This action cannot be undone.",
      onConfirm: async () => {
        await deleteAutomation({ id: automation.id });
      },
    });
  };

  const handleViewDetailsAutomation = () => {
    openModal({
      title: "Automation Details",
      description: "View your automation details",
      children: (
        <ViewDetailAutomationForm
          boardMembers={boardMembers}
          labels={labels}
          automation={automation}
        />
      ),
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Zap className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                {automation.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    automation.isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }
                >
                  {automation.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDate(automation.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <Switch
            checked={automation.isActive}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetailsAutomation}
            className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
