import { z } from "zod";
import { PlanEnum } from "@/db/enum";

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ownerId: z.string().optional(),
});

export const UpdateWorkspaceNameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const UpdateWorkspaceSlugSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

export const ChangePlanSchema = z.object({
  plan: PlanEnum,
});

export const DeleteWorkspaceSchema = z.object({
  id: z.string().min(1),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceNameInput = z.infer<
  typeof UpdateWorkspaceNameSchema
>;
export type UpdateWorkspaceSlugInput = z.infer<
  typeof UpdateWorkspaceSlugSchema
>;
export type ChangePlanInput = z.infer<typeof ChangePlanSchema>;
export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceSchema>;