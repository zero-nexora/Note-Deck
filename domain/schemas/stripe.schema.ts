import { UPGRADE_PLAN } from "@/lib/constants";
import { z } from "zod";

export const CreateSubscriptionSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  plan: z.nativeEnum(UPGRADE_PLAN),
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
