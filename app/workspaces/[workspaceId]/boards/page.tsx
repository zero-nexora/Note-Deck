import { findBoardsByWorkspaceIdAction } from "@/domain/actions/board.action";
import { BoardList } from "@/components/board/board-list";
import { BoardWithMember } from "@/domain/types/board.type";
import { unwrapActionResult } from "@/lib/response";
import { Kanban } from "lucide-react";

interface BoardsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { workspaceId } = await params;

  const boards = unwrapActionResult<BoardWithMember[]>(
    await findBoardsByWorkspaceIdAction(workspaceId),
  );

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
      <BoardList boards={boards} workspaceId={workspaceId} />
    </div>
  );
};

export default BoardsPage;
