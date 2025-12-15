import { PlanEnum } from "@/db/enum";
import { z } from "zod";
import { NewWorkspace, UpdateWorkspace } from "../types/workspace.type";

export const CreateWorkspaceSchema: z.ZodType<NewWorkspace> = z.object({
  name: z.string(),
  slug: z.string(),
  ownerId: z.string(),
  plan: PlanEnum.optional(),
  stripeCustomerId: z.string().nullable().optional(),
  stripeSubscriptionId: z.string().nullable().optional(),
  subscriptionStatus: z.string().nullable().optional(),
  limits: z
    .object({
      boards: z.number().optional(),
      cardsPerBoard: z.number().optional(),
      membersPerWorkspace: z.number().optional(),
    })
    .optional(),
});

export const UpdateWorkspaceSchema: z.ZodType<UpdateWorkspace> = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  ownerId: z.string().optional(),
  plan: PlanEnum.optional(),
  stripeCustomerId: z.string().nullable().optional(),
  stripeSubscriptionId: z.string().nullable().optional(),
  subscriptionStatus: z.string().nullable().optional(),
  limits: z
    .object({
      boards: z.number().optional(),
      cardsPerBoard: z.number().optional(),
      membersPerWorkspace: z.number().optional(),
    })
    .optional(),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
