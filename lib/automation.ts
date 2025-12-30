export interface TriggerOption {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  when: string;
  fields?: TriggerField[];
}

export interface TriggerField {
  name: string;
  type: "text" | "select" | "number";
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface ActionOption {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  then: string;
  fields?: ActionField[];
}

export interface ActionField {
  name: string;
  type: "text" | "select" | "textarea" | "number";
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export const TRIGGER_CATEGORIES = [
  { id: "card", label: "Card Events", icon: "🎫" },
  { id: "list", label: "List Events", icon: "📝" },
  { id: "label", label: "Label Events", icon: "🏷️" },
  { id: "checklist", label: "Checklist Events", icon: "☑️" },
  { id: "comment", label: "Comment Events", icon: "💬" },
  { id: "time", label: "Time-based", icon: "⏰" },
  { id: "member", label: "Member Events", icon: "👥" },
] as const;

export const AUTOMATION_TRIGGERS: TriggerOption[] = [
  {
    id: "CARD_CREATED",
    name: "Card Created",
    description: "Trigger when a new card is created",
    category: "card",
    icon: "➕",
    when: "When a card is created",
    fields: [
      {
        name: "listId",
        type: "select",
        label: "In List (Optional)",
        placeholder: "Any list",
        options: [],
      },
    ],
  },
  {
    id: "CARD_UPDATED",
    name: "Card Updated",
    description: "Trigger when a card is updated",
    category: "card",
    icon: "✏️",
    when: "When a card is updated",
    fields: [
      {
        name: "field",
        type: "select",
        label: "Field Updated (Optional)",
        placeholder: "Any field",
        options: [
          { label: "Title", value: "title" },
          { label: "Description", value: "description" },
          { label: "Due Date", value: "dueDate" },
          { label: "Cover Image", value: "coverImage" },
        ],
      },
    ],
  },
  {
    id: "CARD_MOVED",
    name: "Card Moved",
    description: "Trigger when a card is moved to another list",
    category: "card",
    icon: "🔀",
    when: "When a card is moved",
    fields: [
      {
        name: "fromListId",
        type: "select",
        label: "From List (Optional)",
        placeholder: "Any list",
        options: [],
      },
      {
        name: "toListId",
        type: "select",
        label: "To List (Optional)",
        placeholder: "Any list",
        options: [],
      },
    ],
  },
  {
    id: "CARD_ARCHIVED",
    name: "Card Archived",
    description: "Trigger when a card is archived",
    category: "card",
    icon: "📦",
    when: "When a card is archived",
  },
  {
    id: "CARD_ASSIGNED",
    name: "Member Assigned to Card",
    description: "Trigger when a member is assigned to a card",
    category: "card",
    icon: "👤",
    when: "When a member is assigned to a card",
    fields: [
      {
        name: "userId",
        type: "select",
        label: "Specific User (Optional)",
        placeholder: "Any user",
        options: [],
      },
    ],
  },
  {
    id: "CARD_UNASSIGNED",
    name: "Member Unassigned from Card",
    description: "Trigger when a member is removed from a card",
    category: "card",
    icon: "👤",
    when: "When a member is unassigned from a card",
  },
  {
    id: "CARD_DUE_DATE_SET",
    name: "Due Date Set",
    description: "Trigger when a due date is set or changed",
    category: "card",
    icon: "📅",
    when: "When a due date is set or changed",
  },
  {
    id: "CARD_DUE_DATE_REACHED",
    name: "Due Date Reached",
    description: "Trigger when a card's due date is reached",
    category: "card",
    icon: "⏰",
    when: "When a card's due date is reached",
  },
  {
    id: "CARD_OVERDUE",
    name: "Card Overdue",
    description: "Trigger when a card is past its due date",
    category: "card",
    icon: "🚨",
    when: "When a card becomes overdue",
  },

  {
    id: "LIST_CREATED",
    name: "List Created",
    description: "Trigger when a new list is created",
    category: "list",
    icon: "➕",
    when: "When a list is created",
  },
  {
    id: "LIST_MOVED",
    name: "List Moved",
    description: "Trigger when a list is reordered",
    category: "list",
    icon: "🔀",
    when: "When a list is moved",
  },
  {
    id: "LIST_ARCHIVED",
    name: "List Archived",
    description: "Trigger when a list is archived",
    category: "list",
    icon: "📦",
    when: "When a list is archived",
    fields: [
      {
        name: "listId",
        type: "select",
        label: "Specific List (Optional)",
        placeholder: "Any list",
        options: [],
      },
    ],
  },

  // Label Triggers
  {
    id: "LABEL_ADDED_TO_CARD",
    name: "Label Added",
    description: "Trigger when a label is added to a card",
    category: "label",
    icon: "🏷️",
    when: "When a label is added to a card",
    fields: [
      {
        name: "labelId",
        type: "select",
        label: "Specific Label (Optional)",
        placeholder: "Any label",
        options: [],
      },
    ],
  },
  {
    id: "LABEL_REMOVED_FROM_CARD",
    name: "Label Removed",
    description: "Trigger when a label is removed from a card",
    category: "label",
    icon: "🏷️",
    when: "When a label is removed from a card",
    fields: [
      {
        name: "labelId",
        type: "select",
        label: "Specific Label (Optional)",
        placeholder: "Any label",
        options: [],
      },
    ],
  },

  {
    id: "CHECKLIST_CREATED",
    name: "Checklist Created",
    description: "Trigger when a new checklist is created",
    category: "checklist",
    icon: "➕",
    when: "When a checklist is created",
  },
  {
    id: "CHECKLIST_ITEM_COMPLETED",
    name: "Checklist Item Completed",
    description: "Trigger when a checklist item is checked",
    category: "checklist",
    icon: "✅",
    when: "When a checklist item is completed",
  },
  {
    id: "CHECKLIST_COMPLETED",
    name: "Checklist Completed",
    description: "Trigger when all items in a checklist are completed",
    category: "checklist",
    icon: "🎉",
    when: "When all checklist items are completed",
  },

  // Comment Triggers
  {
    id: "COMMENT_ADDED",
    name: "Comment Added",
    description: "Trigger when a new comment is added",
    category: "comment",
    icon: "💬",
    when: "When a comment is added",
  },
  {
    id: "USER_MENTIONED",
    name: "User Mentioned",
    description: "Trigger when a user is @mentioned in a comment",
    category: "comment",
    icon: "👤",
    when: "When a user is mentioned",
    fields: [
      {
        name: "userId",
        type: "select",
        label: "Specific User (Optional)",
        placeholder: "Any user",
        options: [],
      },
    ],
  },

  {
    id: "ON_SCHEDULE",
    name: "On Schedule",
    description: "Trigger at specific times (cron schedule)",
    category: "time",
    icon: "⏰",
    when: "On a schedule",
    fields: [
      {
        name: "cron",
        type: "text",
        label: "Cron Expression",
        placeholder: "0 9 * * 1-5 (9am Mon-Fri)",
        required: true,
      },
    ],
  },
  {
    id: "AFTER_X_HOURS",
    name: "After X Hours",
    description: "Trigger X hours after an event",
    category: "time",
    icon: "⏱️",
    when: "After a certain number of hours",
    fields: [
      {
        name: "hours",
        type: "number",
        label: "Hours",
        placeholder: "24",
        required: true,
      },
      {
        name: "fromEvent",
        type: "select",
        label: "From Event",
        placeholder: "Select event",
        required: true,
        options: [
          { label: "Card Created", value: "CARD_CREATED" },
          { label: "Card Moved", value: "CARD_MOVED" },
          { label: "Card Assigned", value: "CARD_ASSIGNED" },
        ],
      },
    ],
  },
  {
    id: "AFTER_X_DAYS",
    name: "After X Days",
    description: "Trigger X days after an event",
    category: "time",
    icon: "📆",
    when: "After a certain number of days",
    fields: [
      {
        name: "days",
        type: "number",
        label: "Days",
        placeholder: "7",
        required: true,
      },
      {
        name: "fromEvent",
        type: "select",
        label: "From Event",
        placeholder: "Select event",
        required: true,
        options: [
          { label: "Card Created", value: "CARD_CREATED" },
          { label: "Card Moved", value: "CARD_MOVED" },
          { label: "Card Assigned", value: "CARD_ASSIGNED" },
        ],
      },
    ],
  },

  {
    id: "MEMBER_JOINED",
    name: "Member Joined",
    description: "Trigger when a member joins the workspace/board",
    category: "member",
    icon: "👋",
    when: "When a member joins",
  },
  {
    id: "MEMBER_LEFT",
    name: "Member Left",
    description: "Trigger when a member leaves the workspace/board",
    category: "member",
    icon: "👋",
    when: "When a member leaves",
  },
  {
    id: "BOARD_CREATED",
    name: "Board Created",
    description: "Trigger when a new board is created",
    category: "member",
    icon: "📋",
    when: "When a board is created",
  },
];

export const ACTION_CATEGORIES = [
  { id: "card", label: "Card Actions", icon: "🎫" },
  { id: "member", label: "Member Actions", icon: "👥" },
  { id: "label", label: "Label Actions", icon: "🏷️" },
  { id: "notification", label: "Notifications", icon: "🔔" },
  { id: "list", label: "List Actions", icon: "📝" },
] as const;

export const AUTOMATION_ACTIONS: ActionOption[] = [
  {
    id: "MOVE_CARD",
    name: "Move Card",
    description: "Move the card to another list",
    category: "card",
    icon: "🔀",
    then: "Move card to a list",
    fields: [
      {
        name: "toListId",
        type: "select",
        label: "Destination List",
        placeholder: "Select list",
        options: [],
        required: true,
      },
    ],
  },
  {
    id: "ARCHIVE_CARD",
    name: "Archive Card",
    description: "Archive the card",
    category: "card",
    icon: "📦",
    then: "Archive the card",
  },
  {
    id: "ADD_COMMENT",
    name: "Add Comment",
    description: "Add a comment to the card",
    category: "card",
    icon: "💬",
    then: "Add a comment",
    fields: [
      {
        name: "content",
        type: "textarea",
        label: "Comment Text",
        placeholder: "Enter comment...",
        required: true,
      },
    ],
  },

  {
    id: "ASSIGN_MEMBER",
    name: "Assign Member",
    description: "Assign a member to the card",
    category: "member",
    icon: "👤",
    then: "Assign a member",
    fields: [
      {
        name: "userId",
        type: "select",
        label: "Member",
        placeholder: "Select member",
        options: [],
        required: true,
      },
    ],
  },

  {
    id: "ADD_LABEL",
    name: "Add Label",
    description: "Add a label to the card",
    category: "label",
    icon: "🏷️",
    then: "Add a label",
    fields: [
      {
        name: "labelId",
        type: "select",
        label: "Label",
        placeholder: "Select label",
        options: [],
        required: true,
      },
    ],
  },

  {
    id: "SEND_NOTIFICATION",
    name: "Send Notification",
    description: "Send a notification to users",
    category: "notification",
    icon: "🔔",
    then: "Send a notification",
    fields: [
      {
        name: "userId",
        type: "select",
        label: "To User (Optional)",
        placeholder: "Card assignees",
        options: [],
      },
      {
        name: "title",
        type: "text",
        label: "Notification Title",
        placeholder: "Enter title",
        required: true,
      },
      {
        name: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Enter message",
        required: true,
      },
      {
        name: "notificationType",
        type: "select",
        label: "Type",
        placeholder: "Select type",
        required: true,
        options: [
          { label: "Mention", value: "mention" },
          { label: "Due Date", value: "due_date" },
          { label: "Assignment", value: "assignment" },
          { label: "Comment", value: "comment" },
          { label: "Card Moved", value: "card_moved" },
        ],
      },
    ],
  },
  {
    id: "LOG_ACTIVITY",
    name: "Log Activity",
    description: "Create an activity log entry",
    category: "notification",
    icon: "📝",
    then: "Log an activity",
    fields: [
      {
        name: "action",
        type: "text",
        label: "Action Name",
        placeholder: "custom.action",
        required: true,
      },
      {
        name: "entityType",
        type: "text",
        label: "Entity Type",
        placeholder: "card",
        required: true,
      },
    ],
  },

  {
    id: "ADD_LIST",
    name: "Add List",
    description: "Create a new list",
    category: "list",
    icon: "➕",
    then: "Create a new list",
    fields: [
      {
        name: "name",
        type: "text",
        label: "List Name",
        placeholder: "Enter list name",
        required: true,
      },
    ],
  },
];
