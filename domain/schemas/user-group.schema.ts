import { z } from "zod";
import { JsonValue } from "./common.schem";

export const CreateUserGroupSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  name: z.string().min(1, { message: "Name is required" }),
  permissions: z.any().optional(),
});

export const FindUserGroupSchema = z.object({
  groupId: z.string().uuid({ message: "Invalid UUID for groupId" }),
});

export const FindUserGroupsByWorkspaceSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const UpdateUserGroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  permissions: JsonValue.optional(),
});

export const DeleteUserGroupSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateUserGroupInput = z.infer<typeof CreateUserGroupSchema>;
export type FindUserGroupInput = z.infer<typeof FindUserGroupSchema>;
export type FindUserGroupsByWorkspaceInput = z.infer<
  typeof FindUserGroupsByWorkspaceSchema
>;
export type UpdateUserGroupInput = z.infer<typeof UpdateUserGroupSchema>;
export type DeleteUserGroupInput = z.infer<typeof DeleteUserGroupSchema>;
