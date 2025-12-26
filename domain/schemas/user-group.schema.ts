import { z } from "zod";
import { JsonValue } from "./common.schem";

export const CreateUserGroupSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  permissions: JsonValue.optional().default({}),
});

export const UpdateUserGroupSchema = z.object({
  name: z.string().min(1).optional(),
  permissions: JsonValue.optional(),
});

export const DeleteUserGroupSchema = z.object({
  id: z.string().min(1),
});

export type CreateUserGroupInput = z.infer<typeof CreateUserGroupSchema>;
export type UpdateUserGroupInput = z.infer<typeof UpdateUserGroupSchema>;
export type DeleteUserGroupInput = z.infer<typeof DeleteUserGroupSchema>;

// canCreateBoard: z.boolean().optional(),
// canDeleteBoard: z.boolean().optional(),
// canManageMembers: z.boolean().optional(),
