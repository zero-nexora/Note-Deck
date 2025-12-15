import { notifications } from "@/db/schema";

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type UpdateNotification = Partial<NewNotification>;