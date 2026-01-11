import { Clipboard, FileText, LayoutGrid, Settings, Users } from "lucide-react";

export const sidebarLinks = [
  { icon: LayoutGrid, label: "Overview", path: "overview" },
  { icon: FileText, label: "Audit Logs", path: "audit-logs" },
  { icon: Users, label: "User Groups", path: "user-groups" },
  { icon: Clipboard, label: "Boards", path: "boards" },
  { icon: Settings, label: "Settings", path: "settings" },
];

export const CLIENT_STRIPE_PLANS = {
  free: {
    name: "Free",
    price: 0,
    limits: {
      boards: 10,
      cardsPerBoard: 100,
      membersPerWorkspace: 10,
    },
  },
  pro: {
    name: "Pro",
    price: 12,
    limits: {
      boards: 100,
      cardsPerBoard: 1000,
      membersPerWorkspace: 50,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 40,
    limits: {
      boards: -1,
      cardsPerBoard: -1,
      membersPerWorkspace: -1,
    },
  },
} as const;

export const DEFAULT_PLAN = "free";
export const DEFAULT_WORKSPACE_OWNER_ROLE = "admin";
export const DEFAULT_WORKSPACE_MEMBER_ROLE = "observer";
export const DEFAULT_BOARD_MEMBER_ROLE = "normal";
export const DEFAULT_LIMIT_NOTIFICATION = 50;
export const DEFAULT_LIMIT_ACTIVITY = 100;
export const DEFAULT_LIMIT_AUDIT_LOG = 100;
export const DEFAULT_ACTIVITY = 100;
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const ROLE = {
  ADMIN: "admin",
  NORMAL: "normal",
  OBSERVER: "observer",
} as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];

export const PLAN = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export type Plan = (typeof PLAN)[keyof typeof PLAN];

export const UPGRADE_PLAN = {
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export type UpgradePlan = (typeof UPGRADE_PLAN)[keyof typeof UPGRADE_PLAN];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  TRIALING: "trialing",
  UNPAID: "unpaid",
  INCOMPLETE: "incomplete",
  INCOMPLETE_EXPIRED: "incomplete_expired",
  PAUSED: "paused",
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const ENTITY_TYPE = {
  WORKSPACE: "workspace",
  WORKSPACE_INVITE: "workspace_invite",
  WORKSPACE_MEMBER: "workspace_member",
  USER_GROUP: "user_group",
  BOARD: "board",
  LIST: "list",
  CARD: "card",
  LABEL: "label",
  CHECKLIST: "checlist",
  CHECKLIST_ITEM: "checlist_item",
  COMMENT: "comment",
  ATTACHMENT: "attachment",
  USER: "user",
} as const;
export type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE];

export const AUDIT_ACTION = {
  WORKSPACE_CREATED: "workspace.created",
  WORKSPACE_NAME_UPDATED: "workspace.name_updated",
  WORKSPACE_PLAN_CHANGE: "workspace.plan_changed",
  WORKSPACE_DELETED: "workspace.deleted",
  WORKSPACE_OWNERSHIP_TRANSFERRED: "workspace.ownership_transferred",

  WORKSPACE_MEMBER_ADDED: "workspace.member_added",
  WORKSPACE_MEMBER_REMOVED: "workspace.member_removed",
  WORKSPACE_MEMBER_ROLE_CHANGED: "workspace.member_role_changed",
  WORKSPACE_MEMBER_LEFT: "workspace.member_left",

  WORKSPACE_INVITE_CREATED: "workspace_invite.created",
  WORKSPACE_INVITE_RESENT: "workspace_invite.resent",
  WORKSPACE_INVITE_REVOKED: "workspace_invite.revoked",
  WORKSPACE_INVITE_ACCEPTED: "workspace_invite.accepted",
  WORKSPACE_INVITE_EXPIRED: "workspace_invite.expired",

  USER_GROUP_CREATED: "user_group.created",
  USER_GROUP_UPDATED: "user_group.updated",
  USER_GROUP_DELETED: "user_group.deleted",

  USER_GROUP_MEMBER_ADDED: "user_group.member_added",
  USER_GROUP_MEMBER_REMOVED: "user_group.member_removed",

  BOARD_CREATED: "board.created",
  BOARD_UPDATED: "board.updated",
  BOARD_ARCHIVED: "board.archived",
  BOARD_RESTORED: "board.restored",
  BOARD_DELETED: "board.deleted",

  BOARD_MEMBER_ADDED: "board.member_added",
  BOARD_MEMBER_REMOVED: "board.member_removed",
  BOARD_MEMBER_ROLE_CHANGED: "board.member_role_changed",

  LIST_CREATED: "list.created",
  LIST_UPDATED: "list.updated",
  LISTS_REORDERED: "lists.reordered",
  LIST_MOVED: "list.moved",
  LIST_ARCHIVED: "list.archived",
  LIST_RESTORED: "list.restored",
  LIST_DELETED: "list.deleted",
  LIST_DUPLICATED: "list.duplicated",

  CARD_CREATED: "card.created",
  CARD_UPDATED: "card.updated",
  CARD_MOVED: "card.moved",
  CARD_ARCHIVED: "card.archived",
  CARD_RESTORED: "card.restored",
  CARD_DELETED: "card.deleted",
  CARD_LABEL_ADDED: "card.label_added",
  CARD_LABEL_REMOVED: "card.label_removed",
  CARD_COMMENTED: "card.commented",
  CARD_DUPLICATED: "card.duplicated",

  CARD_MEMBER_ADDED: "card.member_added",
  CARD_MEMBER_REMOVED: "card.member_removed",

  LABEL_CREATED: "label.created",
  LABEL_UPDATED: "label.updated",
  LABEL_DELETED: "label.deleted",

  COMMENT_CREATED: "comment.created",
  COMMENT_UPDATED: "comment.updated",
  COMMENT_DELETED: "comment.deleted",

  COMMENT_REACTION_ADDED: "comment.reaction_added",
  COMMENT_REACTION_REMOVED: "comment.reaction_removed",
} as const;
export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export const ACTIVITY_ACTION = {
  LIST_CREATED: "list.created",
  LIST_UPDATED: "list.updated",
  LIST_MOVED: "list.moved",
  LIST_ARCHIVED: "list.archived",
  LIST_RESTORED: "list.restored",
  LISTS_REORDERED: "lists.reordered",
  LIST_DELETED: "list.deleted",
  LIST_DUPLICATED: "list.duplicated",

  BOARD_CREATED: "board.created",
  BOARD_UPDATED: "board.updated",
  BOARD_ARCHIVED: "board.archived",
  BOARD_RESTORED: "board.restored",
  BOARD_DELETED: "board.deleted",

  BOARD_MEMBER_ADDED: "board.member_added",
  BOARD_MEMBER_REMOVED: "board.member_removed",
  BOARD_MEMBER_ROLE_CHANGED: "board.member_role_changed",

  CARD_CREATED: "card.created",
  CARD_UPDATED: "card.updated",
  CARD_MOVED: "card.moved",
  CARD_ARCHIVED: "card.archived",
  CARD_RESTORED: "card.restored",
  CARD_DELETED: "card.deleted",
  CARD_LABEL_ADDED: "card.label_added",
  CARD_LABEL_REMOVED: "card.label_removed",
  CARD_COMMENTED: "card.commented",
  CARDS_REORDERED: "cards.reordered",
  CARD_DUPLICATED: "card.duplicated",

  CARD_MEMBER_ADDED: "card.member_added",
  CARD_MEMBER_REMOVED: "card.member_removed",

  LABEL_CREATED: "label.created",
  LABEL_UPDATED: "label.updated",
  LABEL_DELETED: "label.deleted",

  COMMENT_CREATED: "comment.created",
  COMMENT_UPDATED: "comment.updated",
  COMMENT_DELETED: "comment.deleted",

  COMMENT_REACTION_ADDED: "comment.reaction_added",
  COMMENT_REACTION_REMOVED: "comment.reaction_removed",

  CHECKLIST_CREATED: "checklist.created",
  CHECKLIST_UPDATED: "checklist.updated",
  CHECKLIST_DELETED: "checklist.deleted",
  CHECKLISTS_REORDERED: "checklists.reordered",

  CHECKLIST_ITEM_COMPLETED: "checklist_item.completed",
  CHECKLIST_ITEM_UNCOMPLETED: "checklist_item.uncompleted",
  CHECKLIST_ITEM_CREATED: "checklist_item.created",
  CHECKLIST_ITEM_UPDATED: "checklist_item.updated",
  CHECKLIST_ITEM_DELETED: "checklist_item.deleted",
  CHECKLIST_ITEMS_REORDERED: "checklist_items.reordered",

  ATTACHMENT_UPLOADED: "attachment.uploaded",
  ATTACHMENT_DELETED: "attachment.deleted",
} as const;

export type ActivityAction =
  (typeof ACTIVITY_ACTION)[keyof typeof ACTIVITY_ACTION];

export const NOTIFICATION_TYPE = {
  MENTION: "mention",
  DUE_DATE: "due_date",
  ASSIGNMENT: "assignment",
  COMMENT: "comment",
  CARD_MOVED: "card_moved",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
