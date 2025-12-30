"use client";

import { UserGroupCard } from "./user-group-card";
import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { CreatUserGroup } from "./create-user-group";
import { useState, useEffect } from "react";

interface UserGroupsListProps {
  workspaceId: string;
  userGroups: UserGroupWithMembers[];
}

export const UserGroupsList = ({
  userGroups: initialUserGroups,
  workspaceId,
}: UserGroupsListProps) => {
  const [userGroups, setUserGroups] = useState(initialUserGroups);

  useEffect(() => {
    setUserGroups(initialUserGroups);
  }, [initialUserGroups]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userGroups.map((userGroup) => (
        <UserGroupCard key={userGroup.id} userGroup={userGroup} />
      ))}

      <CreatUserGroup workspaceId={workspaceId} />
    </div>
  );
};
