import { Zap } from "lucide-react";
import { AutomationListItem } from "./automation-item";

interface AutomationDetails {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  trigger: unknown;
  actions: unknown;
  isActive: boolean;
}

interface AutomationListProps {
  automations: AutomationDetails[];
}

export const AutomationList = ({ automations }: AutomationListProps) => {
  if (automations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No automations yet
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Create your first automation to streamline your workflow
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {automations.map((automation) => (
        <AutomationListItem key={automation.id} automation={automation} />
      ))}
    </div>
  );
};