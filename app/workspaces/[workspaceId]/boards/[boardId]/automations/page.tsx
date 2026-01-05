import { findAutomationsByBoardIdAction } from "@/app/actions/automation.action";
import { listBoardMembersAction } from "@/app/actions/board-member.action";
import { findLabelsByBoardIdAction } from "@/app/actions/label.action";
import { AutomationList } from "@/components/automation/automation-list";
import { AutomaitonStats } from "@/components/automation/automation-stats";
import { CreateAutomation } from "@/components/automation/create-automation";
import { AutomationDetails } from "@/domain/types/automation.type";
import { Zap } from "lucide-react";

interface AutomationsPageProps {
  params: Promise<{ boardId: string; workspaceId: string }>;
}

const AutomationsPage = async ({ params }: AutomationsPageProps) => {
  const { boardId, workspaceId } = await params;
  const result = await findAutomationsByBoardIdAction(boardId);
  if (!result.success || !result.data) return null;
  const automation = result.data as AutomationDetails[];

  const resultBoardMember = await listBoardMembersAction({ boardId });
  const resultLabel = await findLabelsByBoardIdAction(boardId);
  if (!resultBoardMember.success || !resultBoardMember.data) return null;
  if (!resultLabel.success || !resultLabel.data) return null;

  const boardMembers = resultBoardMember.data;
  const labels = resultLabel.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            Automations
          </h1>
          <p className="text-muted-foreground">
            Automate your workflow with custom triggers and actions
          </p>
        </div>
        <CreateAutomation
          boardId={boardId}
          labels={labels}
          boardMembers={boardMembers}
        />
      </div>

      <AutomaitonStats automation={automation} />
      <AutomationList
        boardMembers={boardMembers}
        labels={labels}
        automations={automation}
      />
    </div>
  );
};

export default AutomationsPage;
