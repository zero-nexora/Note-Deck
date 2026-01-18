import { findBoardsByWorkspaceIdAction } from "@/domain/actions/board.action";
import { findWorkspaceLimitAction } from "@/domain/actions/workspace.action";
import { BoardList } from "@/components/board/board-list";
import { BoardWithMember } from "@/domain/types/board.type";
import { unwrapActionResult } from "@/lib/response";
import { Kanban } from "lucide-react";
import { WorkspaceWithLimits } from "@/domain/types/workspace.type";

interface BoardsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { workspaceId } = await params;

  const [boardsResult, limitResult] = await Promise.all([
    findBoardsByWorkspaceIdAction({ workspaceId }),
    findWorkspaceLimitAction({ workspaceId }),
  ]);

  const boards = unwrapActionResult<BoardWithMember[]>(boardsResult);
  const workspaceLimits = unwrapActionResult<WorkspaceWithLimits>(limitResult);

  if (!boards) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Kanban className="h-8 w-8 text-primary" />
          Boards
        </h1>
        <p className="text-muted-foreground">
          Manage all boards in this workspace.
        </p>
      </div>

      <BoardList
        boards={boards}
        workspaceId={workspaceId}
        workspaceLimits={workspaceLimits}
      />
    </div>
  );
};

export default BoardsPage;
