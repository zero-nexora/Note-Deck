import { Building2, LayoutList, Settings, Ticket, Users } from "lucide-react";

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const PERMISSION_CATEGORIES = [
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "board", label: "Board", icon: LayoutList },
  { id: "card", label: "Card", icon: Ticket },
  { id: "member", label: "Member", icon: Users },
  { id: "admin", label: "Admin", icon: Settings },
] as const;

export const PERMISSIONS: Permission[] = [
  {
    id: "workspace.view",
    name: "View Workspace",
    description: "View workspace information and content",
    category: "workspace",
  },
  {
    id: "workspace.update",
    name: "Update Workspace",
    description: "Update workspace name and basic information",
    category: "workspace",
  },
  {
    id: "workspace.delete",
    name: "Delete Workspace",
    description: "Delete the workspace",
    category: "workspace",
  },
  {
    id: "workspace.change_plan",
    name: "Change Plan",
    description: "Change workspace subscription plan",
    category: "workspace",
  },

  {
    id: "workspace.member.add",
    name: "Add Members",
    description: "Add members to workspace",
    category: "member",
  },
  {
    id: "workspace.member.remove",
    name: "Remove Members",
    description: "Remove members from workspace",
    category: "member",
  },
  {
    id: "workspace.member.role",
    name: "Change Member Role",
    description: "Change workspace member roles",
    category: "member",
  },
  {
    id: "workspace.invite.create",
    name: "Create Invite",
    description: "Invite users to workspace",
    category: "member",
  },
  {
    id: "workspace.invite.revoke",
    name: "Revoke Invite",
    description: "Revoke workspace invitations",
    category: "member",
  },

  {
    id: "board.create",
    name: "Create Board",
    description: "Create new boards",
    category: "board",
  },
  {
    id: "board.view",
    name: "View Board",
    description: "View boards and their content",
    category: "board",
  },
  {
    id: "board.update",
    name: "Update Board",
    description: "Update board information",
    category: "board",
  },
  {
    id: "board.delete",
    name: "Delete Board",
    description: "Delete boards",
    category: "board",
  },
  {
    id: "board.archive",
    name: "Archive Board",
    description: "Archive boards",
    category: "board",
  },
  {
    id: "board.restore",
    name: "Restore Board",
    description: "Restore archived boards",
    category: "board",
  },

  {
    id: "card.create",
    name: "Create Card",
    description: "Create cards",
    category: "card",
  },
  {
    id: "card.view",
    name: "View Card",
    description: "View card details",
    category: "card",
  },
  {
    id: "card.update",
    name: "Update Card",
    description: "Update card content",
    category: "card",
  },
  {
    id: "card.delete",
    name: "Delete Card",
    description: "Delete cards",
    category: "card",
  },
  {
    id: "card.move",
    name: "Move Card",
    description: "Move cards between lists",
    category: "card",
  },
  {
    id: "card.reorder",
    name: "Reorder Card",
    description: "Reorder cards in list",
    category: "card",
  },
  {
    id: "card.member.add",
    name: "Add Card Member",
    description: "Assign members to cards",
    category: "card",
  },
  {
    id: "card.member.remove",
    name: "Remove Card Member",
    description: "Unassign members from cards",
    category: "card",
  },
  {
    id: "card.label.add",
    name: "Add Card Label",
    description: "Add labels to cards",
    category: "card",
  },
  {
    id: "card.label.remove",
    name: "Remove Card Label",
    description: "Remove labels from cards",
    category: "card",
  },

  {
    id: "comment.create",
    name: "Create Comment",
    description: "Create comments",
    category: "card",
  },
  {
    id: "comment.update",
    name: "Update Comment",
    description: "Update comments",
    category: "card",
  },
  {
    id: "comment.delete",
    name: "Delete Comment",
    description: "Delete comments",
    category: "card",
  },

  {
    id: "attachment.create",
    name: "Upload Attachment",
    description: "Upload attachments",
    category: "card",
  },
  {
    id: "attachment.delete",
    name: "Delete Attachment",
    description: "Delete attachments",
    category: "card",
  },

  {
    id: "automation.create",
    name: "Create Automation",
    description: "Create automations",
    category: "admin",
  },
  {
    id: "automation.update",
    name: "Update Automation",
    description: "Update automations",
    category: "admin",
  },
  {
    id: "automation.delete",
    name: "Delete Automation",
    description: "Delete automations",
    category: "admin",
  },
  {
    id: "audit.read",
    name: "Read Audit Logs",
    description: "View audit logs",
    category: "admin",
  },
  {
    id: "analytics.view",
    name: "View Analytics",
    description: "View analytics and reports",
    category: "admin",
  },
];

export const PERMISSION_PRESETS = {
  admin: {
    name: "Admin",
    description: "Full access",
    permissions: PERMISSIONS.map((p) => p.id),
  },
  member: {
    name: "Member",
    description: "Create and manage content",
    permissions: [
      "workspace.view",
      "workspace.invite.create",

      "board.create",
      "board.view",
      "board.update",
      "board.archive",
      "board.restore",

      "card.create",
      "card.view",
      "card.update",
      "card.move",
      "card.reorder",
      "card.member.add",
      "card.member.remove",
      "card.label.add",
      "card.label.remove",

      "comment.create",
      "comment.update",

      "attachment.create",
    ],
  },
  observer: {
    name: "Observer",
    description: "Read-only with comments",
    permissions: [
      "workspace.view",
      "board.view",
      "card.view",
      "comment.create",
    ],
  },
  guest: {
    name: "Guest",
    description: "Limited board access",
    permissions: ["board.view", "card.view", "comment.create"],
  },
};
