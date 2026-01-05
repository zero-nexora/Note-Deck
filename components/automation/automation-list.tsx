import { AutomationDetails } from "@/domain/types/automation.type";
import { AutomationListItem } from "./automation-item";
import { BoardWithUser } from "@/domain/types/board-member.type";
import { LabelDetail } from "@/domain/types/label.type";
import { Zap } from "lucide-react";

interface AutomationListProps {
  automations: AutomationDetails[];
  boardMembers: BoardWithUser[];
  labels: LabelDetail[];
}

export const AutomationList = ({
  automations,
  boardMembers,
  labels,
}: AutomationListProps) => {
  // if (automations.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-border rounded-lg">
  //       <Zap className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
  //       <h3 className="text-xl font-semibold text-foreground mb-2">
  //         No automations yet
  //       </h3>
  //       <p className="text-muted-foreground text-center max-w-md">
  //         Create your first automation to streamline your workflow
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-4">
      {automations.map((automation) => (
        <AutomationListItem
          key={automation.id}
          boardMembers={boardMembers}
          labels={labels}
          automation={automation}
        />
      ))}
    </div>
  );
};
