import { findAutomationsByBoardIdAction } from "@/app/actions/automation.action";
import { AutomationList } from "@/components/automation/automation-list";
import { AutomaitonStats } from "@/components/automation/automation-stats";
import { CreateAutomation } from "@/components/automation/create-automation";
import { AutomationDetails } from "@/domain/types/automation.type";

interface AutomationsPageProps {
  params: Promise<{ boardId: string }>;
}

const AutomationsPage = async ({ params }: AutomationsPageProps) => {
  const { boardId } = await params;

  const result = await findAutomationsByBoardIdAction(boardId);
  if (!result.success || !result.data) return null;

  const automation = result.data as AutomationDetails[];

  return (
    <div>
      <AutomaitonStats automation={automation} />
      <CreateAutomation boardId={boardId} />
      <AutomationList automations={automation} />
    </div>
  );
};

export default AutomationsPage;
