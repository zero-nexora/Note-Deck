"use client";

import React from "react";
import { Shield, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { useModal } from "@/stores/modal-store";
import { UserGroupDetails } from "./user-group-details";

interface UserGroupCardProps {
  userGroup: UserGroupWithMembers;
}

export const UserGroupCard = ({ userGroup }: UserGroupCardProps) => {
  const { open } = useModal();

  const handleViewDetailsUserGroup = () => {
    open({
      title: "User Group Details",
      description: "View details of the user group",
      children: <UserGroupDetails userGroup={userGroup} />,
    });
  };

  const permissions = Object.entries(userGroup.permissions ?? {})
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  return (
    <Card
      className="group hover:shadow-lg hover:border-primary/50 transition-all"
      onClick={handleViewDetailsUserGroup}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {userGroup.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {userGroup.members.length} member
                {userGroup.members.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Permissions
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {permissions?.slice(0, 4).map((permission) => (
              <Badge
                key={permission}
                variant="secondary"
                className="text-xs font-normal"
              >
                {permission.split(".").pop()?.replace(/_/g, " ")}
              </Badge>
            ))}
            {permissions.length > 4 && (
              <Badge
                variant="secondary"
                className="text-xs font-normal cursor-pointer hover:bg-primary/10"
              >
                +{permissions.length - 4} more
              </Badge>
            )}
          </div>
          {permissions.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No permissions set
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Members
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
            >
              <Users className="w-3 h-3 mr-1" />
              Manage
            </Button>
          </div>

          {userGroup.members.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {userGroup.members.slice(0, 5).map((member) => (
                  <Avatar
                    key={member.id}
                    className="w-8 h-8 border-2 border-card"
                  >
                    <AvatarImage src={member.user.image ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {member.user.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {userGroup.members.length > 5 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{userGroup.members.length - 5}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-dashed border-border">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">No members yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
