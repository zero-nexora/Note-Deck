"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserSession } from "@/domain/types/user.type";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface SettingTapsProps {
  user: UserSession;
}

export const SecurityTab = ({ user }: SettingTapsProps) => {
  const form = useForm({
    defaultValues: {
      password: "••••••••••••",
    },
  });

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
          <Form {...form}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      disabled
                      className="cursor-not-allowed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
          <Button variant="outline">Change Password</Button>
        </div>

        {/* Two-Factor */}
        <div className="space-y-4">
          <h3 className="font-semibold">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
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
          <div className="rounded-lg bg-secondary p-4">
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
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
