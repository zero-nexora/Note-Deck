import { db } from "@/db";
import { boardMembers, workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Role } from "./constants";

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

  const roleHierarchy = { admin: 3, normal: 2, observer: 1 };

  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
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

  const roleHierarchy = { admin: 3, normal: 2, observer: 1 };

  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
};
