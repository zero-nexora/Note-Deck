import { z } from "zod";
import { RoleEnum } from "@/db/enum";

export const AddBoardMemberSchema = z.object({
  boardId: z.string().min(1),
  userId: z.string().min(1),
  role: RoleEnum.optional().default("normal"),
});

export const RemoveBoardMemberSchema = z.object({
  boardId: z.string().min(1),
  userId: z.string().min(1),
});

export const ChangeBoardMemberRoleSchema = z.object({
  boardId: z.string().min(1),
  userId: z.string().min(1),
  role: RoleEnum,
});

export const ListBoardMembersSchema = z.object({
  boardId: z.string().min(1),
});

export type AddBoardMemberInput = z.infer<typeof AddBoardMemberSchema>;
export type RemoveBoardMemberInput = z.infer<typeof RemoveBoardMemberSchema>;
export type ChangeBoardMemberRoleInput = z.infer<
  typeof ChangeBoardMemberRoleSchema
>;
export type ListBoardMembersInput = z.infer<typeof ListBoardMembersSchema>;
