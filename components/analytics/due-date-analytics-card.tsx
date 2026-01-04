"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DueDateAnalytics } from "@/domain/types/analytics.type";
import { Calendar, AlertCircle } from "lucide-react";

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
      percentage: (analytics.overdue / total) * 100,
      color: "bg-red-500",
    },
    {
      label: "Due Today",
      value: analytics.dueToday,
      percentage: (analytics.dueToday / total) * 100,
      color: "bg-orange-500",
    },
    {
      label: "Due This Week",
      value: analytics.dueThisWeek,
      percentage: (analytics.dueThisWeek / total) * 100,
      color: "bg-yellow-500",
    },
    {
      label: "Due This Month",
      value: analytics.dueThisMonth,
      percentage: (analytics.dueThisMonth / total) * 100,
      color: "bg-blue-500",
    },
    {
      label: "No Due Date",
      value: analytics.noDueDate,
      percentage: (analytics.noDueDate / total) * 100,
      color: "bg-gray-400",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Due Date Breakdown
        </CardTitle>
        <CardDescription>Card distribution by due date status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analytics.overdue > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {analytics.overdue} cards are overdue
            </span>
          </div>
        )}
        {dueDateData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                {item.label}
              </span>
              <span className="font-medium">
                {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
