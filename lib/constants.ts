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

export const PLAN_HIERARCHY: Record<Plan, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

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

export const PERMISSIONS = {
  WORKSPACE_UPDATE: "workspace.update",
  // WORKSPACE_DELETE: "workspace.delete",
  // WORKSPACE_CHANGE_PLAN: "workspace.change_plan",

  WORKSPACE_MEMBER_ADD: "workspace.member.add",
  WORKSPACE_MEMBER_REMOVE: "workspace.member.remove",
  WORKSPACE_MEMBER_ROLE: "workspace.member.role",
  // WORKSPACE_TRANSFER_OWNERSHIP: "workspace.transfer_ownership",

  WORKSPACE_INVITE_CREATE: "workspace.invite.create",
  WORKSPACE_INVITE_RESEND: "workspace.invite.resend",
  WORKSPACE_INVITE_REVOKE: "workspace.invite.revoke",
  WORKSPACE_INVITE_EXPIRE: "workspace.invite.expire",

  GROUP_CREATE: "group.create",
  GROUP_UPDATE: "group.update",
  GROUP_DELETE: "group.delete",

  GROUP_MEMBER_ADD: "group.member.add",
  GROUP_MEMBER_REMOVE: "group.member.remove",

  BOARD_CREATE: "board.create",
  BOARD_UPDATE: "board.update",
  BOARD_DELETE: "board.delete",
  BOARD_ARCHIVE: "board.archive",
  BOARD_RESTORE: "board.restore",

  BOARD_MEMBER_ADD: "board.member.add",
  BOARD_MEMBER_REMOVE: "board.member.remove",
  BOARD_MEMBER_ROLE: "board.member.role",

  LIST_CREATE: "list.create",
  LIST_UPDATE: "list.update",
  LIST_REORDER: "list.reorder",
  LIST_ARCHIVE: "list.archive",
  LIST_RESTORE: "list.restore",
  LIST_DELETE: "list.delete",
  LIST_DUPLICATE: "list.duplicate",

  CARD_CREATE: "card.create",
  CARD_UPDATE: "card.update",
  CARD_MOVE: "card.move",
  CARD_REORDER: "card.reorder",
  CARD_ARCHIVE: "card.archive",
  CARD_RESTORE: "card.restore",
  CARD_DELETE: "card.delete",
  CARD_DUPLICATE: "card.duplicate",

  CARD_MEMBER_ADD: "card.member.add",
  CARD_MEMBER_REMOVE: "card.member.remove",

  CARD_LABEL_ADD: "card.label.add",
  CARD_LABEL_REMOVE: "card.label.remove",

  LABEL_CREATE: "label.create",
  LABEL_UPDATE: "label.update",
  LABEL_DELETE: "label.delete",

  COMMENT_CREATE: "comment.create",
  COMMENT_UPDATE: "comment.update",
  COMMENT_DELETE: "comment.delete",

  CHECKLIST_CREATE: "checklist.create",
  CHECKLIST_UPDATE: "checklist.update",
  CHECKLIST_REORDER: "checklist.reorder",
  CHECKLIST_DELETE: "checklist.delete",

  CHECKLIST_ITEM_CREATE: "checklist.item.create",
  CHECKLIST_ITEM_TOGGLE: "checklist.item.toggle",
  CHECKLIST_ITEM_UPDATE: "checklist.item.update",
  CHECKLIST_ITEM_REORDER: "checklist.item.reorder",
  CHECKLIST_ITEM_DELETE: "checklist.item.delete",

  ATTACHMENT_CREATE: "attachment.create",
  ATTACHMENT_DELETE: "attachment.delete",

  AUTOMATION_CREATE: "automation.create",
  AUTOMATION_UPDATE: "automation.update",
  AUTOMATION_ENABLE: "automation.enable",
  AUTOMATION_DISABLE: "automation.disable",
  AUTOMATION_DELETE: "automation.delete",

  AUDIT_LOG_READ: "audit.read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
