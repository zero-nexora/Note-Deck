export interface WorkspaceAnalytics {
  totalBoards: number;
  totalLists: number;
  totalCards: number;
  completionRate: number;
  activeMembers: number;
}

export interface WorkspaceStats {
  totalBoards: number;
  totalCards: number;
  totalMembers: number;
  completedCards: number;
  overdueCards: number;
  cardsCreatedThisWeek: number;
  cardsCreatedThisMonth: number;
  activeMembers: number;
  averageCardsPerBoard: number;
}

export interface CardsTrend {
  date: string;
  created: number;
  completed: number;
  inProgress: number;
}

export interface BoardPerformance {
  boardId: string;
  boardName: string;
  totalCards: number;
  completedCards: number;
  overdueCards: number;
  completionRate: number;
  averageCompletionTime: number;
  totalActivities: number;
}

export interface MemberProductivity {
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  assignedCards: number;
  completedCards: number;
  commentsCount: number;
  activitiesCount: number;
  completionRate: number;
}

export interface LabelDistribution {
  labelId: string;
  labelName: string;
  labelColor: string;
  cardsCount: number;
  percentage: number;
}

export interface ActivityTimeline {
  hour: number;
  count: number;
}

export interface ChecklistStats {
  totalChecklists: number;
  totalItems: number;
  completedItems: number;
  completionRate: number;
  averageItemsPerChecklist: number;
}

export interface DueDateAnalytics {
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  dueThisMonth: number;
  noDueDate: number;
}
