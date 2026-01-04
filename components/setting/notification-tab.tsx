"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Mail } from "lucide-react";

export const NotificationsTab = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[
            {
              id: "mentions",
              label: "Mentions",
              description: "When someone mentions you in a comment",
            },
            {
              id: "assignments",
              label: "Card Assignments",
              description: "When you are assigned to a card",
            },
            {
              id: "due_dates",
              label: "Due Date Reminders",
              description: "Reminders before a card is due",
            },
            {
              id: "comments",
              label: "Comment Replies",
              description: "When someone replies to your comment",
            },
            {
              id: "updates",
              label: "Board Updates",
              description: "When changes are made to boards you follow",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Email Digest</h3>
          </div>
          <Select defaultValue="daily">
            <SelectTrigger className="bg-background border-border hover:bg-accent focus:ring-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem
                value="never"
                className="hover:bg-accent focus:bg-accent cursor-pointer"
              >
                Never
              </SelectItem>
              <SelectItem
                value="instant"
                className="hover:bg-accent focus:bg-accent cursor-pointer"
              >
                Instant
              </SelectItem>
              <SelectItem
                value="daily"
                className="hover:bg-accent focus:bg-accent cursor-pointer"
              >
                Daily
              </SelectItem>
              <SelectItem
                value="weekly"
                className="hover:bg-accent focus:bg-accent cursor-pointer"
              >
                Weekly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
