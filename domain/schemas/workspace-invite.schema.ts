import { ROLE } from "@/lib/constants";
import { z } from "zod";

export const CreateInviteSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.nativeEnum(ROLE).default("normal"),
  expiresInDays: z.number().int().positive().default(7),
});

export const ResendInviteSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const RevokeInviteSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});

export const AcceptInviteSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});

export const ExpireInviteSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;
export type ResendInviteInput = z.infer<typeof ResendInviteSchema>;
export type RevokeInviteInput = z.infer<typeof RevokeInviteSchema>;
export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;
export type ExpireInviteInput = z.infer<typeof ExpireInviteSchema>;
