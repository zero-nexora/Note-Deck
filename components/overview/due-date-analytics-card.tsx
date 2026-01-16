"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, AlertCircle, Clock, AlertTriangle } from "lucide-react";

interface DueDateAnalytics {
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  dueThisMonth: number;
  noDueDate: number;
}

interface DueDateAnalyticsCardProps {
  analytics: DueDateAnalytics | null;
}

export const DueDateAnalyticsCard = ({
  analytics,
}: DueDateAnalyticsCardProps) => {
  if (!analytics) return null;

  const total =
    analytics.overdue +
    analytics.dueToday +
    analytics.dueThisWeek +
    analytics.dueThisMonth +
    analytics.noDueDate;

  const dueDateData = [
    {
      label: "Overdue",
      value: analytics.overdue,
      percentage: total > 0 ? (analytics.overdue / total) * 100 : 0,
      color: "bg-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      textColor: "text-destructive",
      icon: AlertCircle,
    },
    {
      label: "Due Today",
      value: analytics.dueToday,
      percentage: total > 0 ? (analytics.dueToday / total) * 100 : 0,
      color: "bg-primary",
      bgColor: "bg-accent",
      borderColor: "border-border",
      textColor: "text-primary",
      icon: AlertTriangle,
    },
    {
      label: "Due This Week",
      value: analytics.dueThisWeek,
      percentage: total > 0 ? (analytics.dueThisWeek / total) * 100 : 0,
      color: "bg-accent-foreground",
      bgColor: "bg-muted",
      borderColor: "border-border",
      textColor: "text-accent-foreground",
      icon: Clock,
    },
    {
      label: "Due This Month",
      value: analytics.dueThisMonth,
      percentage: total > 0 ? (analytics.dueThisMonth / total) * 100 : 0,
      color: "bg-primary",
      bgColor: "bg-secondary",
      borderColor: "border-border",
      textColor: "text-primary",
      icon: Calendar,
    },
    {
      label: "No Due Date",
      value: analytics.noDueDate,
      percentage: total > 0 ? (analytics.noDueDate / total) * 100 : 0,
      color: "bg-muted-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-border",
      textColor: "text-muted-foreground",
      icon: Calendar,
    },
  ];

  const urgentCards = analytics.overdue + analytics.dueToday;
  const upcomingCards = analytics.dueThisWeek + analytics.dueThisMonth;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Due Date Breakdown
        </CardTitle>
        <CardDescription className="text-base">
          Card distribution by due date status
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert Banner */}
        {urgentCards > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">
                Attention Required!
              </p>
              <p className="text-sm text-destructive/80 mt-1">
                {urgentCards} {urgentCards === 1 ? "card needs" : "cards need"}{" "}
                immediate attention
                {analytics.overdue > 0 && ` (${analytics.overdue} overdue)`}
              </p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">
                Urgent
              </span>
            </div>
            <p className="text-2xl font-bold text-destructive">{urgentCards}</p>
          </div>
          <div className="bg-accent p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Upcoming
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">{upcomingCards}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Unscheduled
              </span>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">
              {analytics.noDueDate}
            </p>
          </div>
        </div>

        {/* Due Date Progress Bars */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">
            Detailed Breakdown
          </h4>
          {dueDateData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.textColor}`} />
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {item.value} cards
                    </span>
                    <span
                      className={`font-semibold ${item.textColor} min-w-[50px] text-right`}
                    >
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={item.percentage} className="h-3" />
                  <div
                    className={`absolute left-0 top-0 h-3 rounded-full transition-all ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cards List */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Quick Overview
          </h4>
          <div className="grid gap-2">
            {dueDateData
              .filter((item) => item.value > 0)
              .map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${item.bgColor} ${item.borderColor} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <Icon className={`w-5 h-5 ${item.textColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.percentage.toFixed(1)}% of total cards
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${item.textColor}`}>
                      {item.value}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Time Management Tip */}
        <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-semibold text-foreground">Tip:</span> Focus
            on the {urgentCards} urgent {urgentCards === 1 ? "card" : "cards"}{" "}
            first, then plan for the {upcomingCards} upcoming{" "}
            {upcomingCards === 1 ? "task" : "tasks"} to stay ahead of deadlines.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
