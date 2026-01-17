import {
  getWorkspaceStatsAction,
  getCardsTrendAction,
  getBoardsPerformanceAction,
  getMembersProductivityAction,
  getLabelsDistributionAction,
  getActivityTimelineAction,
  getChecklistStatsAction,
  getDueDateAnalyticsAction,
} from "@/domain/actions/analytics.action";
import { ActivityTimelineChart } from "@/components/overview/activity-timeline-chart";
import { BoardPerformanceChart } from "@/components/overview/board-performance-chart";
import { CardsTrendChart } from "@/components/overview/cards-trend-chart";
import { ChecklistStatsCard } from "@/components/overview/checklist-stats-card";
import { DueDateAnalyticsCard } from "@/components/overview/due-date-analytics-card";
import { LabelsDistributionChart } from "@/components/overview/labels-distribution-chart";
import { MemberProductivityTable } from "@/components/overview/member-productivity-table";
import { WorkspaceStatsCards } from "@/components/overview/workspace-stats-cards";

import {
  WorkspaceStats,
  CardsTrend,
  BoardPerformance,
  MemberProductivity,
  LabelDistribution,
  ActivityTimeline,
  ChecklistStats,
  DueDateAnalytics,
} from "@/domain/types/analytics.type";
import { unwrapActionResult } from "@/lib/response";
import { WorkspaceMemberList } from "@/components/overview/workspace-member-list";
import { listWorkspaceMembersAction } from "@/domain/actions/workspace-member.action";
import { WorkspaceMemberWithUser } from "@/domain/types/workspace-member.type";
import { listPendingWorkspaceInvitesAction } from "@/domain/actions/workspace-invite.action";
import { workspacePendingInvite } from "@/domain/types/workspace-invite.type";
import { WorkspacePendingInviteList } from "@/components/overview/workspace-pending-invite-list";
import { LayoutDashboard } from "lucide-react";

interface OverviewPageProps {
  params: Promise<{ workspaceId: string }>;
}

const OverviewPage = async ({ params }: OverviewPageProps) => {
  const { workspaceId } = await params;

  const [
    workspaceStatsResult,
    cardsTrendResult,
    boardsPerformanceResult,
    membersProductivityResult,
    labelsDistributionResult,
    activityTimelineResult,
    checklistStatsResult,
    dueDateAnalyticsResult,
    listWorkspaceMembersResult,
    listPendingWorkspaceInvitesResult,
  ] = await Promise.all([
    getWorkspaceStatsAction({ workspaceId }),
    getCardsTrendAction({ workspaceId }),
    getBoardsPerformanceAction({ workspaceId }),
    getMembersProductivityAction({ workspaceId }),
    getLabelsDistributionAction({ workspaceId }),
    getActivityTimelineAction({ workspaceId }),
    getChecklistStatsAction({ workspaceId }),
    getDueDateAnalyticsAction({ workspaceId }),
    listWorkspaceMembersAction({ workspaceId }),
    listPendingWorkspaceInvitesAction({ workspaceId }),
  ]);

  const workspaceStats =
    unwrapActionResult<WorkspaceStats>(workspaceStatsResult);
  const cardsTrend = unwrapActionResult<CardsTrend[]>(cardsTrendResult) || [];
  const boardsPerformance =
    unwrapActionResult<BoardPerformance[]>(boardsPerformanceResult) || [];
  const membersProductivity =
    unwrapActionResult<MemberProductivity[]>(membersProductivityResult) || [];
  const labelsDistribution =
    unwrapActionResult<LabelDistribution[]>(labelsDistributionResult) || [];
  const activityTimeline =
    unwrapActionResult<ActivityTimeline[]>(activityTimelineResult) || [];
  const checklistStats =
    unwrapActionResult<ChecklistStats>(checklistStatsResult);
  const dueDateAnalytics = unwrapActionResult<DueDateAnalytics>(
    dueDateAnalyticsResult,
  );
  const workspaceMembers =
    unwrapActionResult<WorkspaceMemberWithUser[]>(listWorkspaceMembersResult) ||
    [];

  const workspacePendingInvites =
    unwrapActionResult<workspacePendingInvite[]>(
      listPendingWorkspaceInvitesResult,
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Workspace Overview
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your workspace
          </p>
        </div>
        <div className="flex gap-4">
          <WorkspaceMemberList workspaceMembers={workspaceMembers} />
          <WorkspacePendingInviteList
            workspacePendingInvite={workspacePendingInvites}
          />
        </div>
      </div>

      <WorkspaceStatsCards stats={workspaceStats} />

      <div className="grid gap-6 md:grid-cols-2">
        <CardsTrendChart data={cardsTrend} />
        <BoardPerformanceChart data={boardsPerformance} />
      </div>

      <MemberProductivityTable data={membersProductivity} />

      <div className="grid gap-6 md:grid-cols-2">
        <LabelsDistributionChart data={labelsDistribution} />
        <ActivityTimelineChart data={activityTimeline} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChecklistStatsCard stats={checklistStats} />
        <DueDateAnalyticsCard analytics={dueDateAnalytics} />
      </div>
    </div>
  );
};

export default OverviewPage;
