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
import { ActivityTimelineChart } from "@/components/analytics/activity-timeline-chart";
import { BoardPerformanceChart } from "@/components/analytics/board-performance-chart";
import { CardsTrendChart } from "@/components/analytics/cards-trend-chart";
import { ChecklistStatsCard } from "@/components/analytics/checklist-stats-card";
import { DueDateAnalyticsCard } from "@/components/analytics/due-date-analytics-card";
import { LabelsDistributionChart } from "@/components/analytics/labels-distribution-chart";
import { MemberProductivityTable } from "@/components/analytics/member-productivity-table";
import { WorkspaceStatsCards } from "@/components/analytics/workspace-stats-cards";

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
  ] = await Promise.all([
    getWorkspaceStatsAction({ workspaceId }),
    getCardsTrendAction({ workspaceId }),
    getBoardsPerformanceAction({ workspaceId }),
    getMembersProductivityAction({ workspaceId }),
    getLabelsDistributionAction({ workspaceId }),
    getActivityTimelineAction({ workspaceId }),
    getChecklistStatsAction({ workspaceId }),
    getDueDateAnalyticsAction({ workspaceId }),
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
    dueDateAnalyticsResult
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Workspace Overview
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for your workspace
        </p>
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
