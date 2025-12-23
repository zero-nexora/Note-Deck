import { AutomationList } from "@/components/automation/automation-list";
import { AutomationStatsCard } from "@/components/automation/automation-stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, Zap } from "lucide-react";

const AutomationsPage = () => {
  const mockAutomations = [
    {
      id: "a1",
      name: "Move to Done when all checklists complete",
      trigger: "When all checklist items are checked",
      action: 'Move card to "Done" list',
      enabled: true,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "a2",
      name: "Assign reviewer on PR",
      trigger: 'When card is moved to "Review"',
      action: "Assign team lead as member",
      enabled: true,
      createdAt: "2024-02-01T10:00:00Z",
    },
    {
      id: "a3",
      name: "Due date reminder",
      trigger: "24 hours before due date",
      action: "Send notification to all members",
      enabled: false,
      createdAt: "2024-02-15T10:00:00Z",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AutomationStatsCard title="Total Automations" count={mockAutomations.length} icon={<Zap className="w-6 h-6 text-primary" />} />
        <AutomationStatsCard title="Active" count={mockAutomations.filter(a => a.enabled).length} icon={<Play className="w-6 h-6 text-label-green" />} />
        <AutomationStatsCard title="Paused" count={mockAutomations.filter(a => !a.enabled).length} icon={<Pause className="w-6 h-6 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
          <CardDescription>Manage your automation rules</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AutomationList automations={mockAutomations} />
        </CardContent>
      </Card>
      
    </div>
  );
};

export default AutomationsPage;
