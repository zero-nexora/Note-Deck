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
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{count}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardContent>
  </Card>
);
