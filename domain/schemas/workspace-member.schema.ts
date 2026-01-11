import { z } from "zod";
import { DEFAULT_WORKSPACE_MEMBER_ROLE, ROLE } from "@/lib/constants";

export const AddMemberSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid workspaceId" }),
  userId: z.string().uuid({ message: "Invalid userId" }),
  role: z.nativeEnum(ROLE).default(DEFAULT_WORKSPACE_MEMBER_ROLE),
});

export const RemoveMemberSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid workspaceId" }),
  userId: z.string().uuid({ message: "Invalid userId" }),
});

export const ChangeMemberRoleSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid workspaceId" }),
  userId: z.string().uuid({ message: "Invalid userId" }),
  role: z.nativeEnum(ROLE),
});

export const TransferOwnershipSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  newOwnerId: z.string().uuid({ message: "Invalid UUID for newOwnerId" }),
});

export const ListMembersSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid workspaceId" }),
});

export const LeaveWorkspaceSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid workspaceId" }),
});

export type AddMemberInput = z.infer<typeof AddMemberSchema>;
export type RemoveMemberInput = z.infer<typeof RemoveMemberSchema>;
export type ChangeMemberRoleInput = z.infer<typeof ChangeMemberRoleSchema>;
export type TransferOwnershipInput = z.infer<typeof TransferOwnershipSchema>;
export type ListMembersInput = z.infer<typeof ListMembersSchema>;
export type LeaveWorkspaceInput = z.infer<typeof LeaveWorkspaceSchema>;
