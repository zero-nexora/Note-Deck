"use client";
import React from "react";
import { Shield, Users, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { useModal } from "@/stores/modal-store";
import { UserGroupDetails } from "./user-group-details";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

interface UserGroupCardProps {
  userGroup: UserGroupWithMembers;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const UserGroupCard = ({
  userGroup,
  workspaceMembers,
}: UserGroupCardProps) => {
  const { open } = useModal();

  const handleViewDetailsUserGroup = () => {
    open({
      title: "User Group Details",
      description: "View and manage user group details",
      children: (
        <UserGroupDetails
          workspaceMembers={workspaceMembers}
          userGroup={userGroup}
        />
      ),
    });
  };

  const permissions = Object.entries(userGroup.permissions ?? {})
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  return (
    <Card
      onClick={handleViewDetailsUserGroup}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border hover:border-primary/50 bg-card group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {userGroup.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {userGroup.members.length} member
                {userGroup.members.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Permissions
          </h4>
          <div className="flex flex-wrap gap-2">
            {permissions?.slice(0, 4).map((permission) => (
              <Badge
                key={permission}
                variant="secondary"
                className="bg-secondary text-secondary-foreground text-xs"
              >
                {permission.split(".").pop()?.replace(/_/g, " ")}
              </Badge>
            ))}
            {permissions.length > 4 && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-xs"
              >
                +{permissions.length - 4} more
              </Badge>
            )}
          </div>
          {permissions.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No permissions set
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Members
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetailsUserGroup();
              }}
            >
              Manage
            </Button>
          </div>

          {userGroup.members.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {userGroup.members.slice(0, 5).map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-8 w-8 border-2 border-card"
                  >
                    <AvatarImage src={member.user.image ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {member.user.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {userGroup.members.length > 5 && (
                <span className="text-sm text-muted-foreground font-medium">
                  +{userGroup.members.length - 5}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Users className="h-4 w-4" />
              <p className="text-sm">No members yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
