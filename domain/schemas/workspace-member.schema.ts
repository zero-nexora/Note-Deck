import { RoleEnum } from "@/db/enum";
import { z } from "zod";
import {
  NewWorkspaceMember,
  UpdateWorkspaceMember,
} from "../types/workspace-member.type";

export const CreateWorkspaceMemberSchema: z.ZodType<NewWorkspaceMember> =
  z.object({
    workspaceId: z.string(),
    userId: z.string(),
    role: RoleEnum.optional(),
    isGuest: z.boolean().optional(),
  });

export const UpdateWorkspaceMemberSchema: z.ZodType<UpdateWorkspaceMember> =
  z.object({
    workspaceId: z.string().optional(),
    userId: z.string().optional(),
    role: RoleEnum.optional(),
    isGuest: z.boolean().optional(),
  });

export type CreateWorkspaceMemberInput = z.infer<
  typeof CreateWorkspaceMemberSchema
>;
export type UpdateWorkspaceMemberInput = z.infer<
  typeof UpdateWorkspaceMemberSchema
>;
