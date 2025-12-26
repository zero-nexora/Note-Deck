import { z } from "zod";
import { RoleEnum } from "@/db/enum";

export const AddMemberSchema = z.object({
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  role: RoleEnum.optional().default("normal"),
});

export const RemoveMemberSchema = z.object({
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
});

export const ChangeMemberRoleSchema = z.object({
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  role: RoleEnum,
});

export const ListMembersSchema = z.object({
  workspaceId: z.string().min(1),
});

export const LeaveWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
});

export type AddMemberInput = z.infer<typeof AddMemberSchema>;
export type RemoveMemberInput = z.infer<typeof RemoveMemberSchema>;
export type ChangeMemberRoleInput = z.infer<typeof ChangeMemberRoleSchema>;
export type ListMembersInput = z.infer<typeof ListMembersSchema>;
export type LeaveWorkspaceInput = z.infer<typeof LeaveWorkspaceSchema>;
