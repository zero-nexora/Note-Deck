import { AutomationDetails } from "@/domain/types/automation.type";
import { AutomationStatsCard } from "./automation-stats-card";
import { Pause, Play, Zap } from "lucide-react";

interface AutomationStatsProps {
  automation: AutomationDetails[];
}

export const AutomaitonStats = ({ automation }: AutomationStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <AutomationStatsCard
        title="Total Automations"
        count={automation.length}
        icon={<Zap className="w-6 h-6 text-primary" />}
      />
      <AutomationStatsCard
        title="Active"
        count={automation.filter((a) => a.isActive).length}
        icon={<Play className="w-6 h-6 text-label-green" />}
      />
      <AutomationStatsCard
        title="Paused"
        count={automation.filter((a) => !a.isActive).length}
        icon={<Pause className="w-6 h-6 text-muted-foreground" />}
      />
    </div>
  );
};
