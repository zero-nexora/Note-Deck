import { z } from "zod";
import { NewUserGroup, UpdateUserGroup } from "../types/user-group.type";

export const CreateUserGroupSchema: z.ZodType<NewUserGroup> = z.object({
  workspaceId: z.string(),
  name: z.string(),
  permissions: z.json().optional(),
});

export const UpdateUserGroupSchema: z.ZodType<UpdateUserGroup> = z.object({
  workspaceId: z.string().optional(),
  name: z.string().optional(),
  permissions: z.json().optional(),
});

export type CreateUserGroupInput = z.infer<typeof CreateUserGroupSchema>;
export type UpdateUserGroupInput = z.infer<typeof UpdateUserGroupSchema>;

// canCreateBoard: z.boolean().optional(),
// canDeleteBoard: z.boolean().optional(),
// canManageMembers: z.boolean().optional(),
