import { automations } from "@/db/schema";

export type Automation = typeof automations.$inferSelect;
export type NewAutomation = typeof automations.$inferInsert;
export type UpdateAutomation = Partial<NewAutomation>;

export type TriggerType =
  // Card triggers
  | "CARD_CREATED"
  | "CARD_UPDATED"
  | "CARD_MOVED"
  | "CARD_ARCHIVED"
  | "CARD_ASSIGNED"
  | "CARD_UNASSIGNED"
  | "CARD_DUE_DATE_SET"
  | "CARD_DUE_DATE_REACHED"
  | "CARD_OVERDUE"
  // List triggers
  | "LIST_CREATED"
  | "LIST_MOVED"
  | "LIST_ARCHIVED"
  // Label triggers
  | "LABEL_ADDED_TO_CARD"
  | "LABEL_REMOVED_FROM_CARD"
  // Checklist triggers
  | "CHECKLIST_CREATED"
  | "CHECKLIST_ITEM_COMPLETED"
  | "CHECKLIST_COMPLETED"
  // Comment triggers
  | "COMMENT_ADDED"
  | "USER_MENTIONED"
  // Time triggers
  | "ON_SCHEDULE"
  | "AFTER_X_HOURS"
  | "AFTER_X_DAYS"
  // Workspace triggers
  | "MEMBER_JOINED"
  | "MEMBER_LEFT"
  | "BOARD_CREATED";

export interface BaseTrigger {
  type: TriggerType;
}

export interface CardCreatedTrigger extends BaseTrigger {
  type: "CARD_CREATED";
  listId?: string;
}

export interface CardUpdatedTrigger extends BaseTrigger {
  type: "CARD_UPDATED";
  field?: "title" | "description" | "dueDate" | "coverImage";
}

export interface CardMovedTrigger extends BaseTrigger {
  type: "CARD_MOVED";
  fromListId?: string;
  toListId?: string;
}

export interface CardArchivedTrigger extends BaseTrigger {
  type: "CARD_ARCHIVED";
}

export interface CardAssignedTrigger extends BaseTrigger {
  type: "CARD_ASSIGNED";
  userId?: string;
}

export interface CardUnassignedTrigger extends BaseTrigger {
  type: "CARD_UNASSIGNED";
  userId?: string;
}

export interface CardDueDateSetTrigger extends BaseTrigger {
  type: "CARD_DUE_DATE_SET";
}

export interface CardDueDateReachedTrigger extends BaseTrigger {
  type: "CARD_DUE_DATE_REACHED";
}

export interface CardOverdueTrigger extends BaseTrigger {
  type: "CARD_OVERDUE";
}

export interface ListCreatedTrigger extends BaseTrigger {
  type: "LIST_CREATED";
}

export interface ListMovedTrigger extends BaseTrigger {
  type: "LIST_MOVED";
}

export interface ListArchivedTrigger extends BaseTrigger {
  type: "LIST_ARCHIVED";
  listId?: string;
}

export interface LabelAddedToCardTrigger extends BaseTrigger {
  type: "LABEL_ADDED_TO_CARD";
  labelId?: string;
}

export interface LabelRemovedFromCardTrigger extends BaseTrigger {
  type: "LABEL_REMOVED_FROM_CARD";
  labelId?: string;
}

export interface ChecklistCreatedTrigger extends BaseTrigger {
  type: "CHECKLIST_CREATED";
}

export interface ChecklistItemCompletedTrigger extends BaseTrigger {
  type: "CHECKLIST_ITEM_COMPLETED";
}

export interface ChecklistCompletedTrigger extends BaseTrigger {
  type: "CHECKLIST_COMPLETED";
}

export interface CommentAddedTrigger extends BaseTrigger {
  type: "COMMENT_ADDED";
}

export interface UserMentionedTrigger extends BaseTrigger {
  type: "USER_MENTIONED";
  userId?: string;
}

export interface OnScheduleTrigger extends BaseTrigger {
  type: "ON_SCHEDULE";
  cron: string;
}

export interface AfterXHoursTrigger extends BaseTrigger {
  type: "AFTER_X_HOURS";
  hours: number;
  fromEvent: TriggerType;
}

export interface AfterXDaysTrigger extends BaseTrigger {
  type: "AFTER_X_DAYS";
  days: number;
  fromEvent: TriggerType;
}

export interface MemberJoinedTrigger extends BaseTrigger {
  type: "MEMBER_JOINED";
}

export interface MemberLeftTrigger extends BaseTrigger {
  type: "MEMBER_LEFT";
}

export interface BoardCreatedTrigger extends BaseTrigger {
  type: "BOARD_CREATED";
}

export type Trigger =
  | CardCreatedTrigger
  | CardUpdatedTrigger
  | CardMovedTrigger
  | CardArchivedTrigger
  | CardAssignedTrigger
  | CardUnassignedTrigger
  | CardDueDateSetTrigger
  | CardDueDateReachedTrigger
  | CardOverdueTrigger
  | ListCreatedTrigger
  | ListMovedTrigger
  | ListArchivedTrigger
  | LabelAddedToCardTrigger
  | LabelRemovedFromCardTrigger
  | ChecklistCreatedTrigger
  | ChecklistItemCompletedTrigger
  | ChecklistCompletedTrigger
  | CommentAddedTrigger
  | UserMentionedTrigger
  | OnScheduleTrigger
  | AfterXHoursTrigger
  | AfterXDaysTrigger
  | MemberJoinedTrigger
  | MemberLeftTrigger
  | BoardCreatedTrigger;

export type ActionType =
  | "ASSIGN_MEMBER"
  | "ADD_LABEL"
  | "ADD_COMMENT"
  | "SEND_NOTIFICATION"
  | "LOG_ACTIVITY"
  | "MOVE_CARD"
  | "ARCHIVE_CARD"
  | "ADD_LIST";

export interface BaseAction {
  type: ActionType;
}

export interface AssignMemberAction extends BaseAction {
  type: "ASSIGN_MEMBER";
  userId: string;
}

export interface AddLabelAction extends BaseAction {
  type: "ADD_LABEL";
  labelId: string;
}

export interface AddCommentAction extends BaseAction {
  type: "ADD_COMMENT";
  content: string;
}

export interface SendNotificationAction extends BaseAction {
  type: "SEND_NOTIFICATION";
  userId?: string;
  title: string;
  message: string;
  notificationType:
    | "mention"
    | "due_date"
    | "assignment"
    | "comment"
    | "card_moved";
}

export interface LogActivityAction extends BaseAction {
  type: "LOG_ACTIVITY";
  action: string;
  entityType: string;
}

export interface MoveCardAction extends BaseAction {
  type: "MOVE_CARD";
  toListId: string;
}

export interface ArchiveCardAction extends BaseAction {
  type: "ARCHIVE_CARD";
}

export interface AddListAction extends BaseAction {
  type: "ADD_LIST";
  name: string;
}

export type Action =
  | AssignMemberAction
  | AddLabelAction
  | AddCommentAction
  | SendNotificationAction
  | LogActivityAction
  | MoveCardAction
  | ArchiveCardAction
  | AddListAction;

export interface AutomationEvent {
  type: TriggerType;
  boardId: string;
  cardId?: string;
  listId?: string;
  userId?: string;
  labelId?: string;
  fromListId?: string;
  toListId?: string;
  field?: string;
  checklistId?: string;
  commentId?: string;
  metadata?: any;
}

export interface AutomationRule {
  id: string;
  boardId: string;
  name: string;
  trigger: Trigger;
  actions: Action[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
