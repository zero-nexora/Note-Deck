import { RoleEnum } from "@/db/enum";
import { z } from "zod";

export const CreateWorkspaceMemberSchema =
  z.object({
    workspaceId: z.string(),
    userId: z.string(),
    role: RoleEnum.optional(),
    isGuest: z.boolean().optional(),
  });

export const UpdateWorkspaceMemberSchema =
  z.object({
    workspaceId: z.string(),
    userId: z.string(),
    role: RoleEnum.optional(),
    isGuest: z.boolean().optional(),
  });

export const DeleteWorkspaceMemberSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
});

export type CreateWorkspaceMemberInput = z.infer<
  typeof CreateWorkspaceMemberSchema
>;
export type UpdateWorkspaceMemberInput = z.infer<
  typeof UpdateWorkspaceMemberSchema
>;
export type DeleteWorkspaceMemberInput = z.infer<
  typeof DeleteWorkspaceMemberSchema
>;
