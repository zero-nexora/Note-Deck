import { ROLE } from "@/lib/constants";
import { z } from "zod";

export const AddBoardMemberSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
  role: z.nativeEnum(ROLE).default("normal"),
});

export const RemoveBoardMemberSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
});

export const ChangeBoardMemberRoleSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
  role: z.nativeEnum(ROLE, { message: "Invalid role value" }),
});

export const ListBoardMembersSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
});

export type AddBoardMemberInput = z.infer<typeof AddBoardMemberSchema>;
export type RemoveBoardMemberInput = z.infer<typeof RemoveBoardMemberSchema>;
export type ChangeBoardMemberRoleInput = z.infer<
  typeof ChangeBoardMemberRoleSchema
>;
export type ListBoardMembersInput = z.infer<typeof ListBoardMembersSchema>;
