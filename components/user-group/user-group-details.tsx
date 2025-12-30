import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { useUserGroup } from "@/hooks/use-user-group";
import { useUserGroupMember } from "@/hooks/use-user-group-member";
import React from "react";

interface UserGroupDetailsProps {
  userGroup: UserGroupWithMembers;
}

export const UserGroupDetails = ({ userGroup }: UserGroupDetailsProps) => {
  const {updateUserGroup, deleteUserGroup} = useUserGroup();
  const {addMember, removeMember} = useUserGroupMember();
  return <div>UserGroupDetail</div>;
};
