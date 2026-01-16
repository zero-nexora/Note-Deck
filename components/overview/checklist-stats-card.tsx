"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, ListTodo, CheckCircle2, TrendingUp } from "lucide-react";

interface ChecklistStats {
  totalChecklists: number;
  totalItems: number;
  completedItems: number;
  completionRate: number;
  averageItemsPerChecklist: number;
}

interface ChecklistStatsCardProps {
  stats: ChecklistStats | null;
}

export const ChecklistStatsCard = ({ stats }: ChecklistStatsCardProps) => {
  if (!stats) return null;

  const pendingItems = stats.totalItems - stats.completedItems;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-primary" />
          Checklist Progress
        </CardTitle>
        <CardDescription className="text-base">
          Overall checklist completion statistics
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Completion
            </span>
            <div className="text-right">
              <span className="text-3xl font-bold text-foreground">
                {stats.completionRate.toFixed(1)}
              </span>
              <span className="text-xl font-semibold text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <div className="relative">
            <Progress value={stats.completionRate} className="h-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-foreground drop-shadow">
                {stats.completedItems} / {stats.totalItems}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <ListTodo className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Checklists
              </span>
            </div>
            <p className="text-3xl font-bold text-primary">
              {stats.totalChecklists}
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="w-5 h-5 text-accent-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Items
              </span>
            </div>
            <p className="text-3xl font-bold text-accent-foreground">
              {stats.totalItems}
            </p>
          </div>

          <div className="bg-secondary p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Completed
              </span>
            </div>
            <p className="text-3xl font-bold text-primary">
              {stats.completedItems}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingItems} pending
            </p>
          </div>

          <div className="bg-accent p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-accent-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Avg Items/List
              </span>
            </div>
            <p className="text-3xl font-bold text-accent-foreground">
              {stats.averageItemsPerChecklist.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Progress Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Progress Status
          </h4>
          <div
            className={`p-4 rounded-lg border ${
              stats.completionRate >= 75
                ? "bg-accent border-border"
                : stats.completionRate >= 50
                ? "bg-muted border-border"
                : "bg-secondary border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  stats.completionRate >= 75
                    ? "bg-primary"
                    : stats.completionRate >= 50
                    ? "bg-accent-foreground"
                    : "bg-muted-foreground"
                }`}
              />
              <div>
                <p className="font-semibold text-foreground">
                  {stats.completionRate >= 75
                    ? "Excellent Progress! 🎉"
                    : stats.completionRate >= 50
                    ? "Good Progress 👍"
                    : stats.completionRate >= 25
                    ? "Keep Going 💪"
                    : "Just Started 🚀"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.completionRate >= 75
                    ? "You're doing great! Most items are completed."
                    : stats.completionRate >= 50
                    ? "You're halfway there. Keep up the momentum!"
                    : stats.completionRate >= 25
                    ? "Making progress. Stay focused on your goals."
                    : "Start checking off items to build momentum."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {(stats.completedItems / stats.totalChecklists || 0).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Done per list</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-2xl font-bold text-primary">
              {Math.ceil(pendingItems / stats.totalChecklists) || 0}
            </p>
            <p className="text-xs text-muted-foreground">Left per list</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {stats.totalChecklists > 0
                ? Math.ceil((pendingItems / stats.totalChecklists) * 24)
                : 0}
              h
            </p>
            <p className="text-xs text-muted-foreground">Est. time left</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
