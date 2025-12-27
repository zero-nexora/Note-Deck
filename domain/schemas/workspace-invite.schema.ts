import { z } from "zod";
import { RoleEnum } from "@/db/enum";

export const CreateInviteSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email(),
  role: RoleEnum.optional().default("normal"),
  expiresInDays: z.number().int().positive().optional().default(7),
});

export const ResendInviteSchema = z.object({
  id: z.string().min(1),
});

export const RevokeInviteSchema = z.object({
  token: z.string().min(1),
});

export const AcceptInviteSchema = z.object({
  token: z.string().min(1),
});

export const ExpireInviteSchema = z.object({
  id: z.string().min(1),
});

export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;
export type ResendInviteInput = z.infer<typeof ResendInviteSchema>;
export type RevokeInviteInput = z.infer<typeof RevokeInviteSchema>;
export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;
export type ExpireInviteInput = z.infer<typeof ExpireInviteSchema>;
