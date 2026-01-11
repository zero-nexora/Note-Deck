import { findBoardByIdAction } from "@/domain/actions/board.action";
import { findWorkspaceByIdAction } from "@/domain/actions/workspace.action";
import { BoardContainer } from "@/components/board/board-container";
import { requireAuth } from "@/lib/session";
import { unwrapActionResult } from "@/lib/response";

interface BoardsPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { boardId } = await params;
  const user = await requireAuth();

  const board = unwrapActionResult(await findBoardByIdAction(boardId));
  if (!board) return null;

  const workspace = unwrapActionResult(
    await findWorkspaceByIdAction({ workspaceId: board.workspaceId })
  );
  if (!workspace) return null;

  return (
    <BoardContainer
      board={board}
      user={user}
      workspaceMembers={workspace.members}
    />
  );
};

export default BoardsPage;
