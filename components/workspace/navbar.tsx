"use client";

import { useState } from "react";
import { ThemeToggle } from "../common/theme-toggle";
import { WorkspaceInviteMember } from "./workspace-invite-member";
import { WorkspaceWithMember } from "@/domain/types/workspace.type";
import { UserSession } from "@/domain/types/user.type";
import { NotificationWithUser } from "@/domain/types/notification.type";
import { useWorkspace } from "@/hooks/use-workspace";
import { useNotification } from "@/hooks/use-notification";
import { useConfirm } from "@/stores/confirm-store";
import { useStripe } from "@/hooks/use-stripe";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { WorkspaceNameEditor } from "./workspace-name-editor";
import { WorkspaceTitle } from "./workspace-title";
import { NotificationPopover } from "./notification-popover";
import { UserMenu } from "./user-menu";

interface NavbarProps {
  notifications: NotificationWithUser[];
  workspace: WorkspaceWithMember;
  user: UserSession;
}

export const Navbar = ({ notifications, workspace, user }: NavbarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateWorkspaceName } = useWorkspace();
  const { markAsRead, markAllAsRead } = useNotification();
  const { open } = useConfirm();
  const { openCustomerPortal } = useStripe();

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-6">
        {isEditing ? (
          <WorkspaceNameEditor
            name={workspace.name}
            onSubmit={async (v) => {
              await updateWorkspaceName(workspace.id, v);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <WorkspaceTitle
            name={workspace.name}
            plan={workspace.plan}
            onEdit={() => setIsEditing(true)}
          />
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button onClick={() => openCustomerPortal(workspace.id)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Billing
          </Button>

          <WorkspaceInviteMember workspaceId={workspace.id} />

          <NotificationPopover
            notifications={notifications}
            onRead={(id) => markAsRead({ id })}
            onReadAll={markAllAsRead}
          />

          <UserMenu
            user={user}
            workspaceId={workspace.id}
            onSignOut={() =>
              open({
                title: "Sign out",
                description: "Are you sure?",
                onConfirm: () => signOut(),
              })
            }
          />
        </div>
      </div>
    </header>
  );
};
