"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AutomationStatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

export const AutomationStatsCard: React.FC<AutomationStatsCardProps> = ({
  title,
  count,
  icon,
}) => (
  <Card className="border-border bg-card hover:shadow-lg transition-all duration-200">
    <CardContent className="p-6 flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">{count}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardContent>
  </Card>
);
