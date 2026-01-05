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
import { LogOut, Lock, Shield as ShieldIcon, Key } from "lucide-react";
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
import { useConfirm } from "@/stores/confirm-store";

interface SettingTapsProps {
  user: UserSession;
}

export const SecurityTab = ({ user }: SettingTapsProps) => {
  const { open } = useConfirm();

  const form = useForm({
    defaultValues: {
      password: "••••••••••••",
    },
  });

  const handleSignOut = () => {
    open({
      title: "Sign out",
      description: "Are you sure you want to sign out?",
      onConfirm: () => signOut(),
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Security</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Password</h3>
          </div>
          <Form {...form}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      disabled
                      className="bg-muted border-border text-muted-foreground cursor-not-allowed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
          <Button
            variant="outline"
            className="border-border hover:bg-accent hover:text-accent-foreground"
          >
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </div>

        <div className="space-y-4 p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              Two-Factor Authentication
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">2FA is not enabled</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
              Enable 2FA
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
          <h3 className="font-semibold text-foreground">Sessions</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Current session</p>
              <p className="text-sm text-muted-foreground">
                Last active: Just now
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
