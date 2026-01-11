import { z } from "zod";

const BaseTriggerSchema = z.object({
  type: z.string(),
});

const CardMovedTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("CARD_MOVED"),
  fromListId: z
    .string()
    .uuid({ message: "Invalid UUID for fromListId" })
    .optional(),
  toListId: z
    .string()
    .uuid({ message: "Invalid UUID for toListId" })
    .optional(),
});

const CardCreatedTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("CARD_CREATED"),
  listId: z.string().uuid({ message: "Invalid UUID for listId" }).optional(),
});

const LabelAddedTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("LABEL_ADDED_TO_CARD"),
  labelId: z.string().uuid({ message: "Invalid UUID for labelId" }).optional(),
});

const OnScheduleTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("ON_SCHEDULE"),
  cron: z.string(),
});

const AfterXHoursTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("AFTER_X_HOURS"),
  hours: z.number().int().positive({ message: "Hours must be positive" }),
  fromEvent: z.string(),
});

const AfterXDaysTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("AFTER_X_DAYS"),
  days: z.number().int().positive({ message: "Days must be positive" }),
  fromEvent: z.string(),
});

const TriggerSchema = z.union([
  CardMovedTriggerSchema,
  CardCreatedTriggerSchema,
  LabelAddedTriggerSchema,
  OnScheduleTriggerSchema,
  AfterXHoursTriggerSchema,
  AfterXDaysTriggerSchema,
  BaseTriggerSchema,
]);

// Action schemas
const BaseActionSchema = z.object({
  type: z.string(),
});

const AssignMemberActionSchema = BaseActionSchema.extend({
  type: z.literal("ASSIGN_MEMBER"),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
});

const AddLabelActionSchema = BaseActionSchema.extend({
  type: z.literal("ADD_LABEL"),
  labelId: z.string().uuid({ message: "Invalid UUID for labelId" }),
});

const AddCommentActionSchema = BaseActionSchema.extend({
  type: z.literal("ADD_COMMENT"),
  content: z.string().min(1, { message: "Content is required" }),
});

const SendNotificationActionSchema = BaseActionSchema.extend({
  type: z.literal("SEND_NOTIFICATION"),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }).optional(),
  title: z.string().min(1, { message: "Title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  notificationType: z.enum([
    "mention",
    "due_date",
    "assignment",
    "comment",
    "card_moved",
  ]),
});

const MoveCardActionSchema = BaseActionSchema.extend({
  type: z.literal("MOVE_CARD"),
  toListId: z.string().uuid({ message: "Invalid UUID for toListId" }),
});

const ArchiveCardActionSchema = BaseActionSchema.extend({
  type: z.literal("ARCHIVE_CARD"),
});

const AddListActionSchema = BaseActionSchema.extend({
  type: z.literal("ADD_LIST"),
  name: z.string().min(1, { message: "Name is required" }),
});

const ActionSchema = z.union([
  AssignMemberActionSchema,
  AddLabelActionSchema,
  AddCommentActionSchema,
  SendNotificationActionSchema,
  MoveCardActionSchema,
  ArchiveCardActionSchema,
  AddListActionSchema,
  BaseActionSchema,
]);

export const CreateAutomationSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  name: z.string().min(1, { message: "Name is required" }),
  trigger: TriggerSchema,
  actions: z
    .array(ActionSchema)
    .min(1, { message: "At least one action is required" }),
});

export const UpdateAutomationSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }).optional(),
  trigger: TriggerSchema.optional(),
  actions: z
    .array(ActionSchema)
    .min(1, { message: "At least one action is required" })
    .optional(),
});

export const EnableAutomationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const DisableAutomationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const DeleteAutomationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateAutomationInput = z.infer<typeof CreateAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof UpdateAutomationSchema>;
export type EnableAutomationInput = z.infer<typeof EnableAutomationSchema>;
export type DisableAutomationInput = z.infer<typeof DisableAutomationSchema>;
export type DeleteAutomationInput = z.infer<typeof DeleteAutomationSchema>;
