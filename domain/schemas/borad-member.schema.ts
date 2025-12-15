import { z } from "zod";
import { RoleEnum } from "@/db/enum";
import { NewBoardMember, UpdateBoardMember } from "../types/board-member.type";

export const CreateBoardMemberSchema: z.ZodType<NewBoardMember> = z.object({
  boardId: z.string(),
  userId: z.string(),
  role: RoleEnum.optional(),
  createdAt: z.date().optional(),
});

export const UpdateBoardMemberSchema: z.ZodType<UpdateBoardMember> = z.object({
  boardId: z.string().optional(),
  userId: z.string().optional(),
  role: RoleEnum.optional(),
  updatedAt: z.date().optional(),
});

export type CreateBoardMemberInput = z.infer<typeof CreateBoardMemberSchema>;
export type UpdateBoardMemberInput = z.infer<typeof UpdateBoardMemberSchema>;
