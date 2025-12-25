import { users } from "@/db/schema";
import { requireAuth } from "@/lib/session";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Partial<NewUser>;
export type UserSession = Awaited<ReturnType<typeof requireAuth>>;
