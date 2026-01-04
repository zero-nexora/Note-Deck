import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceStats } from "@/domain/types/analytics.type";
import {
  CheckSquare,
  Clock,
  LayoutGrid,
  TrendingUp,
  Users,
} from "lucide-react";

interface WorkspaceStatsCardsProps {
  stats: WorkspaceStats | null;
}

export const WorkspaceStatsCards = ({ stats }: WorkspaceStatsCardsProps) => {
  if (!stats) return null;

  const statsData = [
    {
      title: "Total Boards",
      value: stats.totalBoards,
      icon: LayoutGrid,
      description: "Active boards in workspace",
    },
    {
      title: "Total Cards",
      value: stats.totalCards,
      icon: CheckSquare,
      description: "All cards created",
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      icon: Users,
      description: `${stats.activeMembers} active members`,
    },
    {
      title: "Completed",
      value: stats.completedCards,
      icon: CheckSquare,
      description: "Cards finished",
    },
    {
      title: "Overdue",
      value: stats.overdueCards,
      icon: Clock,
      description: "Need attention",
    },
    {
      title: "This Month",
      value: stats.cardsCreatedThisMonth,
      icon: TrendingUp,
      description: `${stats.cardsCreatedThisWeek} this week`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
