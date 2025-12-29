import z from "zod";

const BaseTriggerSchema = z.object({
  type: z.string(),
});

const CardMovedTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("CARD_MOVED"),
  fromListId: z.string().optional(),
  toListId: z.string().optional(),
});

const CardCreatedTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("CARD_CREATED"),
  listId: z.string().optional(),
});

const LabelAddedTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("LABEL_ADDED_TO_CARD"),
  labelId: z.string().optional(),
});

const OnScheduleTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("ON_SCHEDULE"),
  cron: z.string(),
});

const AfterXHoursTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("AFTER_X_HOURS"),
  hours: z.number().int().positive(),
  fromEvent: z.string(),
});

const AfterXDaysTriggerSchema = BaseTriggerSchema.extend({
  type: z.literal("AFTER_X_DAYS"),
  days: z.number().int().positive(),
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
  userId: z.string(),
});

const AddLabelActionSchema = BaseActionSchema.extend({
  type: z.literal("ADD_LABEL"),
  labelId: z.string(),
});

const AddCommentActionSchema = BaseActionSchema.extend({
  type: z.literal("ADD_COMMENT"),
  content: z.string(),
});

const SendNotificationActionSchema = BaseActionSchema.extend({
  type: z.literal("SEND_NOTIFICATION"),
  userId: z.string().optional(),
  title: z.string(),
  message: z.string(),
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
  toListId: z.string(),
});

const ArchiveCardActionSchema = BaseActionSchema.extend({
  type: z.literal("ARCHIVE_CARD"),
});

const AddListActionSchema = BaseActionSchema.extend({
  type: z.literal("ADD_LIST"),
  name: z.string(),
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
  boardId: z.string().min(1),
  name: z.string().min(1),
  trigger: TriggerSchema,
  actions: z.array(ActionSchema).min(1),
});

export const UpdateAutomationSchema = z.object({
  name: z.string().min(1).optional(),
  trigger: TriggerSchema.optional(),
  actions: z.array(ActionSchema).min(1).optional(),
});

export const EnableAutomationSchema = z.object({
  id: z.string().min(1),
});

export const DisableAutomationSchema = z.object({
  id: z.string().min(1),
});

export const DeleteAutomationSchema = z.object({
  id: z.string().min(1),
});

export type CreateAutomationInput = z.infer<typeof CreateAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof UpdateAutomationSchema>;
export type EnableAutomationInput = z.infer<typeof EnableAutomationSchema>;
export type DisableAutomationInput = z.infer<typeof DisableAutomationSchema>;
export type DeleteAutomationInput = z.infer<typeof DeleteAutomationSchema>;
