"use client";
import { UserGroupCard } from "./user-group-card";
import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { CreatUserGroup } from "./create-user-group";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { Shield } from "lucide-react";

interface UserGroupsListProps {
  workspaceId: string;
  userGroups: UserGroupWithMembers[];
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const UserGroupsList = ({
  userGroups,
  workspaceId,
  workspaceMembers,
}: UserGroupsListProps) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            User Groups
          </h1>
          <p className="text-muted-foreground">
            Manage teams and their permissions in your workspace
          </p>
        </div>
        <CreatUserGroup workspaceId={workspaceId} />
      </div>

      {userGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-border rounded-lg">
          <Shield className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No user groups yet
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Create your first user group to organize team members and manage
            permissions efficiently
          </p>
          <CreatUserGroup workspaceId={workspaceId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGroups.map((userGroup) => (
            <UserGroupCard
              workspaceMembers={workspaceMembers}
              key={userGroup.id}
              userGroup={userGroup}
            />
          ))}
        </div>
      )}
    </div>
  );
};
