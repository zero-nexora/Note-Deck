import { WorkspaceMemberWithUser } from "@/domain/types/workspace-member.type";
import { useWorkspaceMember } from "@/hooks/use-workspace-member";
import { useConfirm } from "@/stores/confirm-store";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown, Shield, Eye, LogOut, Trash2, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { ActionItem, ActionsMenu } from "../common/actions-menu";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import { WorkspaceWithLimits } from "@/domain/types/workspace.type";

interface WorkspaceMemberListProps {
  workspaceMembers: WorkspaceMemberWithUser[];
  workspaceLimits: WorkspaceWithLimits | null;
}

export const WorkspaceMemberListForm = ({
  workspaceMembers: initialMembers,
  workspaceLimits,
}: WorkspaceMemberListProps) => {
  const { data: session } = useSession();
  const { open } = useConfirm();
  const [members, setMembers] =
    useState<WorkspaceMemberWithUser[]>(initialMembers);

  const {
    leaveWorkspace,
    changeWorkspaceMemberRole,
    removeWorkspaceMember,
    transferWorkspaceOwnership,
  } = useWorkspaceMember();

  const currentUserId = session?.user?.id;
  const currentMember = members.find((m) => m.userId === currentUserId);
  const isOwner = currentMember?.role === "admin";

  const getRoleBadge = (role: string) => {
    const config = {
      admin: {
        icon: Crown,
        className: "bg-primary text-primary-foreground",
        label: "Admin",
      },
      normal: {
        icon: Shield,
        className: "bg-secondary text-secondary-foreground",
        label: "Member",
      },
      observer: {
        icon: Eye,
        className: "bg-muted text-muted-foreground",
        label: "Observer",
      },
    };

    const {
      icon: Icon,
      className,
      label,
    } = config[role as keyof typeof config];

    return (
      <Badge className={`gap-1.5 ${className}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const handleChangeRole = (
    memberId: string,
    workspaceId: string,
    newRole: "admin" | "normal" | "observer",
  ) => {
    open({
      title: "Change member role",
      description: `Are you sure you want to change this member's role to ${newRole}?`,
      onConfirm: async () => {
        const result = await changeWorkspaceMemberRole({
          workspaceId,
          userId: memberId,
          role: newRole,
        });

        if (result) {
          setMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.userId === memberId
                ? { ...member, role: newRole }
                : member,
            ),
          );
        }
      },
    });
  };

  const handleRemoveMember = (
    memberId: string,
    workspaceId: string,
    memberName: string,
  ) => {
    open({
      title: "Remove member",
      description: `Are you sure you want to remove ${memberName} from this workspace?`,
      variant: "destructive",
      onConfirm: async () => {
        await removeWorkspaceMember({
          workspaceId,
          userId: memberId,
        });

        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.userId !== memberId),
        );
      },
    });
  };

  const handleTransferOwnership = (
    memberId: string,
    workspaceId: string,
    memberName: string,
  ) => {
    open({
      title: "Transfer ownership",
      description: `Are you sure you want to transfer workspace ownership to ${memberName}? You will lose admin privileges.`,
      variant: "warning",
      onConfirm: async () => {
        await transferWorkspaceOwnership({
          workspaceId,
          newOwnerId: memberId,
        });

        setMembers((prevMembers) =>
          prevMembers.map((member) => {
            if (member.userId === memberId) {
              return { ...member, role: "admin" as const };
            }
            if (member.userId === currentUserId) {
              return { ...member, role: "normal" as const };
            }
            return member;
          }),
        );
      },
    });
  };

  const handleLeaveWorkspace = (workspaceId: string) => {
    open({
      title: "Leave workspace",
      description:
        "Are you sure you want to leave this workspace? You will need an invitation to rejoin.",
      variant: "destructive",
      onConfirm: async () => {
        await leaveWorkspace({ workspaceId });

        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.userId !== currentUserId),
        );
      },
    });
  };

  const getMemberActions = (member: (typeof members)[0]): ActionItem[] => {
    const isCurrentUser = member.userId === currentUserId;
    const canManage = isOwner && !isCurrentUser;

    if (isCurrentUser && member.role !== "admin") {
      return [
        {
          label: "Leave Workspace",
          icon: LogOut,
          onClick: () => handleLeaveWorkspace(member.workspaceId),
          variant: "destructive",
        },
      ];
    }

    if (canManage) {
      return [
        {
          label: "Make Admin",
          icon: Crown,
          onClick: () =>
            handleChangeRole(member.userId, member.workspaceId, "admin"),
          disabled: member.role === "admin",
        },
        {
          label: "Make Member",
          icon: Shield,
          onClick: () =>
            handleChangeRole(member.userId, member.workspaceId, "normal"),
          disabled: member.role === "normal",
        },
        {
          label: "Make Observer",
          icon: Eye,
          onClick: () =>
            handleChangeRole(member.userId, member.workspaceId, "observer"),
          disabled: member.role === "observer",
        },
        {
          label: "Transfer Ownership",
          icon: Crown,
          onClick: () =>
            handleTransferOwnership(
              member.userId,
              member.workspaceId,
              member.user.name || "this user",
            ),
          separator: true,
        },
        {
          label: "Remove Member",
          icon: Trash2,
          onClick: () =>
            handleRemoveMember(
              member.userId,
              member.workspaceId,
              member.user.name || "this user",
            ),
          variant: "destructive",
          separator: true,
        },
      ];
    }

    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <p className="font-medium text-foreground">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        {workspaceLimits && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="font-normal">
              {workspaceLimits.limits.membersPerWorkspace === -1
                ? "Unlimited"
                : `${workspaceLimits.usage.members}/${workspaceLimits.limits.membersPerWorkspace}`}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {workspaceLimits.plan}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const actions = getMemberActions(member);

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarImage src={member.user.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getInitials(member.user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">
                      {member.user.name || "Unknown User"}
                    </p>
                    {isCurrentUser && (
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/50 text-primary"
                      >
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {member.user.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getRoleBadge(member.role)}
                  {actions.length > 0 && <ActionsMenu actions={actions} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
