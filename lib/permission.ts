export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const PERMISSION_CATEGORIES = [
  { id: "workspace", label: "Workspace", icon: "🏢" },
  { id: "board", label: "Board", icon: "📋" },
  { id: "card", label: "Card", icon: "🎫" },
  { id: "member", label: "Member", icon: "👥" },
  { id: "admin", label: "Admin", icon: "⚙️" },
] as const;

export const PERMISSIONS: Permission[] = [
  {
    id: "workspace.view",
    name: "View Workspace",
    description: "Can view workspace and its boards",
    category: "workspace",
  },
  {
    id: "workspace.edit",
    name: "Edit Workspace",
    description: "Can edit workspace name and settings",
    category: "workspace",
  },
  {
    id: "workspace.delete",
    name: "Delete Workspace",
    description: "Can delete the entire workspace",
    category: "workspace",
  },
  {
    id: "workspace.settings",
    name: "Manage Settings",
    description: "Can manage workspace settings and integrations",
    category: "workspace",
  },
  {
    id: "board.create",
    name: "Create Board",
    description: "Can create new boards",
    category: "board",
  },
  {
    id: "board.view",
    name: "View Board",
    description: "Can view boards and their content",
    category: "board",
  },
  {
    id: "board.edit",
    name: "Edit Board",
    description: "Can edit board name, description, and settings",
    category: "board",
  },
  {
    id: "board.delete",
    name: "Delete Board",
    description: "Can delete boards",
    category: "board",
  },
  {
    id: "board.archive",
    name: "Archive Board",
    description: "Can archive/restore boards",
    category: "board",
  },
  {
    id: "card.create",
    name: "Create Card",
    description: "Can create new cards",
    category: "card",
  },
  {
    id: "card.view",
    name: "View Card",
    description: "Can view card details",
    category: "card",
  },
  {
    id: "card.edit",
    name: "Edit Card",
    description: "Can edit card title, description, and fields",
    category: "card",
  },
  {
    id: "card.delete",
    name: "Delete Card",
    description: "Can delete cards",
    category: "card",
  },
  {
    id: "card.move",
    name: "Move Card",
    description: "Can move cards between lists",
    category: "card",
  },
  {
    id: "card.assign",
    name: "Assign Members",
    description: "Can assign/unassign members to cards",
    category: "card",
  },
  {
    id: "card.label",
    name: "Manage Labels",
    description: "Can add/remove labels on cards",
    category: "card",
  },
  {
    id: "card.attachment",
    name: "Manage Attachments",
    description: "Can upload/delete attachments",
    category: "card",
  },
  {
    id: "card.checklist",
    name: "Manage Checklists",
    description: "Can create/edit/delete checklists",
    category: "card",
  },
  {
    id: "card.comment",
    name: "Comment",
    description: "Can add/edit/delete comments",
    category: "card",
  },
  {
    id: "member.invite",
    name: "Invite Members",
    description: "Can invite new members to workspace",
    category: "member",
  },
  {
    id: "member.remove",
    name: "Remove Members",
    description: "Can remove members from workspace",
    category: "member",
  },
  {
    id: "member.role",
    name: "Change Roles",
    description: "Can change member roles and permissions",
    category: "member",
  },
  {
    id: "admin.automation",
    name: "Manage Automations",
    description: "Can create/edit/delete automations",
    category: "admin",
  },
  {
    id: "admin.integration",
    name: "Manage Integrations",
    description: "Can manage third-party integrations",
    category: "admin",
  },
  {
    id: "admin.billing",
    name: "Manage Billing",
    description: "Can manage subscription and billing",
    category: "admin",
  },
  {
    id: "admin.audit",
    name: "View Audit Logs",
    description: "Can view audit logs and activity history",
    category: "admin",
  },
];

export const PERMISSION_PRESETS = {
  admin: {
    name: "Admin",
    description: "Full access to everything",
    permissions: PERMISSIONS.map((p) => p.id),
  },
  member: {
    name: "Member",
    description: "Can create and edit content",
    permissions: [
      "workspace.view",
      "board.create",
      "board.view",
      "board.edit",
      "card.create",
      "card.view",
      "card.edit",
      "card.move",
      "card.assign",
      "card.label",
      "card.attachment",
      "card.checklist",
      "card.comment",
    ],
  },
  observer: {
    name: "Observer",
    description: "View-only access",
    permissions: ["workspace.view", "board.view", "card.view", "card.comment"],
  },
  guest: {
    name: "Guest",
    description: "Limited access to specific boards",
    permissions: ["board.view", "card.view", "card.comment"],
  },
};
