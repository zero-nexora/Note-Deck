import { workspacePendingInvite } from "@/domain/types/workspace-invite.type";
import { useWorkspaceInvite } from "@/hooks/use-workspace-invite";
import { useConfirm } from "@/stores/confirm-store";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Crown, Shield, Eye, Mail, Clock, XCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ActionItem, ActionsMenu } from "../common/actions-menu";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

interface WorkspacePendingInviteMemberListProps {
  workspacePendingInvite: workspacePendingInvite[];
}

export const WorkspaceInviteListForm = ({
  workspacePendingInvite: initialInvites,
}: WorkspacePendingInviteMemberListProps) => {
  const { open } = useConfirm();
  const [invites, setInvites] =
    useState<workspacePendingInvite[]>(initialInvites);
  const { expireWorkspaceInvite, resendWorkspaceInvite } = useWorkspaceInvite();

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

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  const handleResendInvite = (id: string, email: string) => {
    open({
      title: "Resend invitation",
      description: `Are you sure you want to resend the invitation to ${email}?`,
      onConfirm: async () => {
        const result = await resendWorkspaceInvite({ id });

        if (result) {
          setInvites((prevInvites) =>
            prevInvites.map((invite) =>
              invite.id === id
                ? {
                    ...invite,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    createdAt: new Date(),
                  }
                : invite
            )
          );
        }
      },
    });
  };

  const handleExpireInvite = (id: string, email: string) => {
    open({
      title: "Cancel invitation",
      description: `Are you sure you want to cancel the invitation to ${email}?`,
      variant: "destructive",
      onConfirm: async () => {
        const result = await expireWorkspaceInvite({ id });

        if (result !== undefined) {
          setInvites((prevInvites) =>
            prevInvites.filter((invite) => invite.id !== id)
          );
        }
      },
    });
  };

  const getInviteActions = (invite: workspacePendingInvite): ActionItem[] => {
    const expired = isExpired(invite.expiresAt);

    return [
      {
        label: "Resend Invite",
        icon: Send,
        onClick: () => handleResendInvite(invite.id, invite.email),
        disabled: expired,
      },
      {
        label: "Cancel Invite",
        icon: XCircle,
        onClick: () => handleExpireInvite(invite.id, invite.email),
        variant: "destructive",
        separator: true,
      },
    ];
  };

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Mail className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No pending invitations
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          All workspace invitations have been accepted or expired
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <p className="font-medium text-foreground">
            {invites.length} pending{" "}
            {invites.length === 1 ? "invitation" : "invitations"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {invites.map((invite) => {
          const expired = isExpired(invite.expiresAt);
          const actions = getInviteActions(invite);

          return (
            <div
              key={invite.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                    {getInitials(invite.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">
                      {invite.email}
                    </p>
                    {expired && (
                      <Badge className="text-xs bg-destructive text-destructive-foreground">
                        Expired
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {expired
                        ? `Expired ${formatDistanceToNow(
                            new Date(invite.expiresAt)
                          )} ago`
                        : `Expires ${formatDistanceToNow(
                            new Date(invite.expiresAt),
                            { addSuffix: true }
                          )}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getRoleBadge(invite.role)}
                  <ActionsMenu actions={actions} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
