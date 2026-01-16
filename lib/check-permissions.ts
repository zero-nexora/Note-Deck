import { db } from "@/db";
import {
  boardMembers,
  userGroupMembers,
  userGroups,
  workspaceMembers,
  workspaces,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Permission, Role } from "./constants";

const roleHierarchy: Record<Role, number> = {
  admin: 3,
  normal: 2,
  observer: 1,
};

const hasRole = (role: Role, required: Role) =>
  roleHierarchy[role] >= roleHierarchy[required];

export async function canUser(
  userId: string,
  params: {
    workspaceId: string;
    workspaceRole?: Role;
    boardId?: string;
    boardRole?: Role;
    permission?: Permission;
  }
): Promise<boolean> {
  const { workspaceId, workspaceRole, boardId, boardRole, permission } = params;

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    columns: { ownerId: true },
  });

  if (!workspace) return false;

  if (workspace.ownerId === userId) return true;

  const workspaceMember = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  });

  if (!workspaceMember) return false;

  if (workspaceRole && !hasRole(workspaceMember.role, workspaceRole)) {
    return false;
  }

  if (boardId) {
    const boardMember = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, userId)
      ),
    });

    if (!boardMember) return false;

    if (boardRole && !hasRole(boardMember.role, boardRole)) {
      return false;
    }
  }

  if (permission) {
    const groups = await db.query.userGroups.findMany({
      where: eq(userGroups.workspaceId, workspaceId),
      with: {
        members: {
          where: eq(userGroupMembers.userId, userId),
        },
      },
    });

    for (const group of groups) {
      if (group.members.length === 0) continue;

      const permissions = group.permissions as Record<string, boolean>;
      if (permissions[permission] === true) return true;
    }

    return false;
  }

  return true;
}

export async function assertOwner(
  userId: string,
  workspaceId: string
): Promise<void> {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    columns: { ownerId: true },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Only workspace owner can perform this action");
  }
}
