import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  index,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { AdapterAccountType } from "@auth/core/adapters";

export const roleEnum = pgEnum("role", ["admin", "normal", "observer"]);
export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "mention",
  "due_date",
  "assignment",
  "comment",
  "card_moved",
]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: varchar("password", { length: 255 }).default(""),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const workspaces = pgTable("workspaces", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: planEnum("plan").notNull().default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 50 }),
  limits: jsonb("limits")
    .notNull()
    .default({ boards: 10, cardsPerBoard: 100, membersPerWorkspace: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaceInvites = pgTable("workspace_invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: roleEnum("role").notNull().default("normal"),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("normal"),
    isGuest: boolean("is_guest").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceUserIdx: index("workspace_user_idx").on(
      table.workspaceId,
      table.userId
    ),
  })
);

export const boards = pgTable("boards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const boardMembers = pgTable(
  "board_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("normal"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    boardUserIdx: index("board_user_idx").on(table.boardId, table.userId),
  })
);

export const lists = pgTable(
  "lists",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    position: integer("position").notNull(),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    boardPositionIdx: index("list_board_position_idx").on(
      table.boardId,
      table.position
    ),
  })
);

export const cards = pgTable(
  "cards",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    listId: text("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    position: integer("position").notNull(),
    dueDate: timestamp("due_date"),
    isArchived: boolean("is_archived").notNull().default(false),
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    listPositionIdx: index("card_list_position_idx").on(
      table.listId,
      table.position
    ),
    boardIdx: index("card_board_idx").on(table.boardId),
  })
);

export const labels = pgTable("labels", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cardLabels = pgTable(
  "card_labels",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
  },
  (table) => ({
    cardLabelIdx: index("card_label_idx").on(table.cardId, table.labelId),
  })
);

export const cardMembers = pgTable(
  "card_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    cardUserIdx: index("card_user_idx").on(table.cardId, table.userId),
  })
);

export const checklists = pgTable("checklists", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cardId: text("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const checklistItems = pgTable("checklist_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  checklistId: text("checklist_id")
    .notNull()
    .references(() => checklists.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable(
  "comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parent_id"),
    content: text("content").notNull(),
    mentions: jsonb("mentions").notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    cardIdx: index("comment_card_idx").on(table.cardId),
    parentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }),
  })
);

export const commentReactions = pgTable("comment_reactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  commentId: text("comment_id")
    .notNull()
    .references(() => comments.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attachments = pgTable("attachments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cardId: text("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  uploadThingKey: varchar("uploadthing_key", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable(
  "activities",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    cardId: text("card_id").references(() => cards.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: text("entity_id").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    boardIdx: index("activity_board_idx").on(table.boardId),
    cardIdx: index("activity_card_idx").on(table.cardId),
    createdAtIdx: index("activity_created_at_idx").on(table.createdAt),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    entityType: varchar("entity_type", { length: 50 }),
    entityId: text("entity_id"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId, table.isRead),
  })
);

export const automations = pgTable("automations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  trigger: jsonb("trigger").notNull().default({}),
  actions: jsonb("actions").notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: text("entity_id").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("audit_workspace_idx").on(table.workspaceId),
  })
);

export const userGroups = pgTable("user_groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  permissions: jsonb("permissions").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userGroupMembers = pgTable("user_group_members", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: text("group_id")
    .notNull()
    .references(() => userGroups.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(users, ({ many }) => ({
  workspaceMembers: many(workspaceMembers),
  boardMembers: many(boardMembers),
  cardMembers: many(cardMembers),
  comments: many(comments),
  commentReactions: many(commentReactions),
  attachments: many(attachments),
  activities: many(activities),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  userGroupMembers: many(userGroupMembers),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  boards: many(boards),
  auditLogs: many(auditLogs),
  userGroups: many(userGroups),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  })
);

export const boardsRelations = relations(boards, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [boards.workspaceId],
    references: [workspaces.id],
  }),
  members: many(boardMembers),
  lists: many(lists),
  cards: many(cards),
  labels: many(labels),
  activities: many(activities),
  automations: many(automations),
}));

export const boardMembersRelations = relations(boardMembers, ({ one }) => ({
  board: one(boards, {
    fields: [boardMembers.boardId],
    references: [boards.id],
  }),
  user: one(users, { fields: [boardMembers.userId], references: [users.id] }),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, { fields: [lists.boardId], references: [boards.id] }),
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  list: one(lists, { fields: [cards.listId], references: [lists.id] }),
  board: one(boards, { fields: [cards.boardId], references: [boards.id] }),
  cardLabels: many(cardLabels),
  members: many(cardMembers),
  checklists: many(checklists),
  comments: many(comments),
  attachments: many(attachments),
  activities: many(activities),
  labels: many(cardLabels),
}));

export const labelsRelations = relations(labels, ({ one, many }) => ({
  board: one(boards, { fields: [labels.boardId], references: [boards.id] }),
  cardLabels: many(cardLabels),
}));

export const cardLabelsRelations = relations(cardLabels, ({ one }) => ({
  card: one(cards, { fields: [cardLabels.cardId], references: [cards.id] }),
  label: one(labels, { fields: [cardLabels.labelId], references: [labels.id] }),
}));

export const cardMembersRelations = relations(cardMembers, ({ one }) => ({
  card: one(cards, { fields: [cardMembers.cardId], references: [cards.id] }),
  user: one(users, { fields: [cardMembers.userId], references: [users.id] }),
}));

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  card: one(cards, { fields: [checklists.cardId], references: [cards.id] }),
  items: many(checklistItems),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistItems.checklistId],
    references: [checklists.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  card: one(cards, {
    fields: [comments.cardId],
    references: [cards.id],
  }),

  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),

  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "comment_parent",
  }),

  replies: many(comments, {
    relationName: "comment_parent",
  }),

  reactions: many(commentReactions),
}));

export const commentReactionsRelations = relations(
  commentReactions,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentReactions.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentReactions.userId],
      references: [users.id],
    }),
  })
);

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  card: one(cards, { fields: [attachments.cardId], references: [cards.id] }),
  user: one(users, { fields: [attachments.userId], references: [users.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  board: one(boards, { fields: [activities.boardId], references: [boards.id] }),
  card: one(cards, { fields: [activities.cardId], references: [cards.id] }),
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const userGroupsRelations = relations(userGroups, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [userGroups.workspaceId],
    references: [workspaces.id],
  }),
  members: many(userGroupMembers),
}));

export const userGroupMembersRelations = relations(
  userGroupMembers,
  ({ one }) => ({
    group: one(userGroups, {
      fields: [userGroupMembers.groupId],
      references: [userGroups.id],
    }),
    user: one(users, {
      fields: [userGroupMembers.userId],
      references: [users.id],
    }),
  })
);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [auditLogs.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

export const automationsRelations = relations(automations, ({ one }) => ({
  board: one(boards, {
    fields: [automations.boardId],
    references: [boards.id],
  }),
}));
