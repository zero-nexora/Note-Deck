import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceStats } from "@/domain/types/analytics.type";
import {
  CheckSquare,
  LayoutGrid,
  TrendingUp,
  Users,
  AlertCircle,
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
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Cards",
      value: stats.totalCards,
      icon: CheckSquare,
      description: "All cards created",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      icon: Users,
      description: `${stats.activeMembers} active members`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed",
      value: stats.completedCards,
      icon: CheckSquare,
      description: "Cards finished",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Overdue",
      value: stats.overdueCards,
      icon: AlertCircle,
      description: "Need attention",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      alert: stats.overdueCards > 0,
    },
    {
      title: "This Month",
      value: stats.cardsCreatedThisMonth,
      icon: TrendingUp,
      description: `${stats.cardsCreatedThisWeek} this week`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`border-border hover:border-primary/50 transition-all duration-200 ${
              stat.alert ? "border-destructive/50 bg-destructive/5" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
