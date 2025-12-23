"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AutomationItemProps {
  automation: {
    id: string;
    name: string;
    trigger: string;
    action: string;
    enabled: boolean;
  };
}

export const AutomationListItem = ({ automation }: AutomationItemProps) => (
  <div className="p-4 hover:bg-secondary/50 transition-colors flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-semibold">{automation.name}</h3>
        <Badge
          variant={automation.enabled ? "default" : "secondary"}
          className={cn(
            automation.enabled && "gradient-primary text-primary-foreground"
          )}
        >
          {automation.enabled ? "Active" : "Paused"}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="bg-secondary px-2 py-1 rounded">
          {automation.trigger}
        </span>
        <ChevronRight className="w-4 h-4" />
        <span className="bg-secondary px-2 py-1 rounded">
          {automation.action}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Switch checked={automation.enabled} />
      <Button variant="ghost" size="icon">
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
