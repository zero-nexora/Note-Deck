import { AutomationDetails } from "@/domain/types/automation.type";
import { AutomationStatsCard } from "./automation-stats-card";
import { Pause, Play, Zap } from "lucide-react";

interface AutomationStatsProps {
  automation: AutomationDetails[];
}

export const AutomaitonStats = ({ automation }: AutomationStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AutomationStatsCard
        title="Total Automations"
        count={automation.length}
        icon={<Zap className="h-6 w-6 text-primary" />}
      />
      <AutomationStatsCard
        title="Active"
        count={automation.filter((a) => a.isActive).length}
        icon={<Play className="h-6 w-6 text-primary" />}
      />
      <AutomationStatsCard
        title="Paused"
        count={automation.filter((a) => !a.isActive).length}
        icon={<Pause className="h-6 w-6 text-primary" />}
      />
    </div>
  );
};
