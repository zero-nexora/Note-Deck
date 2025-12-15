import { attachments } from "@/db/schema";

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
export type UpdateAttachment = Partial<NewAttachment>;