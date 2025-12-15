import { z } from "zod";

export const RoleEnum = z.enum(["admin", "normal", "observer"]);
export const PlanEnum = z.enum(["free", "pro", "enterprise"]);
export const NotificationTypeEnum = z.enum([
  "mention",
  "due_date",
  "assignment",
  "comment",
  "card_moved",
]);

export type Role = z.infer<typeof RoleEnum>;
export type Plan = z.infer<typeof PlanEnum>;
export type NotificationType = z.infer<typeof NotificationTypeEnum>;