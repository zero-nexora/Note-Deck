"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const SecurityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password */}
        <div className="space-y-4">
          <h3 className="font-semibold">Password</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
          </div>
          <Button variant="outline">Update Password</Button>
        </div>

        {/* Two-Factor */}
        <div className="space-y-4">
          <h3 className="font-semibold">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <p className="font-medium">2FA is not enabled</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button>Enable 2FA</Button>
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-4">
          <h3 className="font-semibold">Sessions</h3>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current session</p>
                <p className="text-sm text-muted-foreground">
                  Last active: Just now
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
