"use client";

import { UserGroupCard } from "./user-group-card";
import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { CreatUserGroup } from "./create-user-group";
import { useState, useEffect } from "react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

interface UserGroupsListProps {
  workspaceId: string;
  userGroups: UserGroupWithMembers[];
   workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const UserGroupsList = ({
  userGroups: initialUserGroups,
  workspaceId,
  workspaceMembers,
}: UserGroupsListProps) => {
  const [userGroups, setUserGroups] = useState(initialUserGroups);

  useEffect(() => {
    setUserGroups(initialUserGroups);
  }, [initialUserGroups]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userGroups.map((userGroup) => (
        <UserGroupCard workspaceMembers={workspaceMembers} key={userGroup.id} userGroup={userGroup} />
      ))}

      <CreatUserGroup workspaceId={workspaceId} />
    </div>
  );
};
