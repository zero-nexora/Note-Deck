import { z } from "zod";

export const CreateUserGroupSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  permissions: z.json().optional(),
});

export const UpdateUserGroupSchema = z.object({
  workspaceId: z.string(),
  name: z.string().optional(),
  permissions: z.json().optional(),
});

export type CreateUserGroupInput = z.infer<typeof CreateUserGroupSchema>;
export type UpdateUserGroupInput = z.infer<typeof UpdateUserGroupSchema>;

// canCreateBoard: z.boolean().optional(),
// canDeleteBoard: z.boolean().optional(),
// canManageMembers: z.boolean().optional(),
