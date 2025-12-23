"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[
            { id: "mentions", label: "Mentions", description: "When someone mentions you in a comment" },
            { id: "assignments", label: "Card Assignments", description: "When you are assigned to a card" },
            { id: "due_dates", label: "Due Date Reminders", description: "Reminders before a card is due" },
            { id: "comments", label: "Comment Replies", description: "When someone replies to your comment" },
            { id: "updates", label: "Board Updates", description: "When changes are made to boards you follow" },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Email Digest</h3>
          <Select defaultValue="daily">
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
