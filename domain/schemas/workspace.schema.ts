import { PlanEnum } from "@/db/enum";
import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1),
  ownerId: z.string().optional(),
});

export const UpdateWorkspaceSchema = z.object({
  name: z.string().optional(),
  plan: PlanEnum.optional(),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
