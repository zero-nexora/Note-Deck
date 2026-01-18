import { findAutomationsByBoardIdAction } from "@/domain/actions/automation.action";
import { listBoardMembersAction } from "@/domain/actions/board-member.action";
import { findLabelsByBoardIdAction } from "@/domain/actions/label.action";
import { AutomationList } from "@/components/automation/automation-list";
import { AutomaitonStats } from "@/components/automation/automation-stats";
import { CreateAutomation } from "@/components/automation/create-automation";
import { AutomationDetails } from "@/domain/types/automation.type";
import { Zap } from "lucide-react";
import { unwrapActionResult } from "@/lib/response";

interface AutomationsPageProps {
  params: Promise<{ boardId: string; workspaceId: string }>;
}

const AutomationsPage = async ({ params }: AutomationsPageProps) => {
  const { boardId } = await params;

  const [automationsResult, boardMembersResult, labelsResult] =
    await Promise.all([
      findAutomationsByBoardIdAction(boardId),
      listBoardMembersAction({ boardId }),
      findLabelsByBoardIdAction(boardId),
    ]);

  const automations =
    unwrapActionResult<AutomationDetails[]>(automationsResult);
  const boardMembers = unwrapActionResult(boardMembersResult);
  const labels = unwrapActionResult(labelsResult);

  if (!automations || !boardMembers || !labels) return null;

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

      <AutomaitonStats automation={automations} />

      <AutomationList
        boardMembers={boardMembers}
        labels={labels}
        automations={automations}
      />
    </div>
  );
};

export default AutomationsPage;
