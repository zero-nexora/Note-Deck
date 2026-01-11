import { PLAN } from "@/lib/constants";
import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  ownerId: z.string().uuid({ message: "Invalid ownerId" }).optional(),
});

export const UpdateWorkspaceNameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const FindWorkspaceByIdSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const ChangePlanSchema = z.object({
  plan: z.nativeEnum(PLAN, { message: "Plan is required" }),
});

export const DeleteWorkspaceSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceNameInput = z.infer<
  typeof UpdateWorkspaceNameSchema
>;
export type FindWorkspaceByIdInput = z.infer<typeof FindWorkspaceByIdSchema>;
export type ChangePlanInput = z.infer<typeof ChangePlanSchema>;
export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceSchema>;
