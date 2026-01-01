"use client";

import { AutomationDetails } from "@/domain/types/automation.type";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Calendar, ChevronRight, Pencil, Trash2, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

interface AutomationItemProps {
  automation: AutomationDetails;
}

export const AutomationListItem = ({ automation }: AutomationItemProps) => {
  const [isActive, setIsActive] = useState(automation.isActive);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    
    setIsLoading(false);
  };

  const handleEdit = () => {
    
  };

  const handleDelete = () => {
    
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground leading-tight mb-1">
                {automation.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDate(automation.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="shrink-0"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 text-xs"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("View details:", automation.id)}
            className="h-8 text-xs"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}