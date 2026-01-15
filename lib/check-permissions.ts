import { db } from "@/db";
import {
  boardMembers,
  userGroupMembers,
  userGroups,
  workspaceMembers,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Role } from "./constants";

const roleHierarchy: Record<Role, number> = {
  admin: 3,
  normal: 2,
  observer: 1,
};

const hasRequiredRole = (memberRole: Role, requiredRole: Role) =>
  roleHierarchy[memberRole] >= roleHierarchy[requiredRole];

export const checkWorkspacePermission = async (
  userId: string,
  workspaceId: string,
  requiredRole: Role
): Promise<boolean> => {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  });

  if (!member) return false;

  return hasRequiredRole(member.role, requiredRole);
};

export const checkBoardPermission = async (
  userId: string,
  boardId: string,
  requiredRole: Role
): Promise<boolean> => {
  const member = await db.query.boardMembers.findFirst({
    where: and(
      eq(boardMembers.boardId, boardId),
      eq(boardMembers.userId, userId)
    ),
  });

  if (!member) return false;

  return hasRequiredRole(member.role, requiredRole);
};

export const checkUserGroupPermission = async (
  userId: string,
  workspaceId: string,
  requiredPermission: string
): Promise<boolean> => {
  const groups = await db.query.userGroups.findMany({
    where: eq(userGroups.workspaceId, workspaceId),
    with: {
      members: {
        where: eq(userGroupMembers.userId, userId),
      },
    },
  });

  return groups.some((group) => {
    if (group.members.length === 0) return false;

    const permissions = group.permissions as Record<string, boolean>;
    return permissions[requiredPermission] === true;
  });
};
