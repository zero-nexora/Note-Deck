"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChecklistStats } from "@/domain/types/analytics.type";
import { CheckSquare } from "lucide-react";

interface ChecklistStatsCardProps {
  stats: ChecklistStats | null;
}

export const ChecklistStatsCard = ({ stats }: ChecklistStatsCardProps) => {
  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Checklist Progress
        </CardTitle>
        <CardDescription>
          Overall checklist completion statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Completion</span>
            <span className="font-medium">
              {stats.completionRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={stats.completionRate} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Checklists</p>
            <p className="text-2xl font-bold">{stats.totalChecklists}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed Items</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completedItems}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Items/List</p>
            <p className="text-2xl font-bold">
              {stats.averageItemsPerChecklist.toFixed(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
