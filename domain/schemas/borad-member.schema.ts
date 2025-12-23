import { z } from "zod";
import { RoleEnum } from "@/db/enum";

export const CreateBoardMemberSchema = z.object({
  boardId: z.string(),
  userId: z.string(),
  role: RoleEnum.optional(),
});

export const UpdateBoardMemberSchema = z.object({
  boardId: z.string().optional(),
  userId: z.string().optional(),
  role: RoleEnum.optional(),
});

export type CreateBoardMemberInput = z.infer<typeof CreateBoardMemberSchema>;
export type UpdateBoardMemberInput = z.infer<typeof UpdateBoardMemberSchema>;
