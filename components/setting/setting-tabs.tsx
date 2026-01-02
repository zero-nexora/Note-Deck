"use client";

import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./profile-tab";
import { NotificationsTab } from "./notification-tab";
import { SecurityTab } from "./security-tab";
import { BillingTab } from "./billing-tab";
import { UserSession } from "@/domain/types/user.type";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

interface SettingTapsProps {
  workspace: WorkspaceWithOwnerMembers;
  user: UserSession;
}

export const SettingTabs = ({ user, workspace }: SettingTapsProps) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab user={user} />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab workspace={workspace} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
