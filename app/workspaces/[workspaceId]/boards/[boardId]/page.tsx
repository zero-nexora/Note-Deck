import { findBoardByIdAction } from "@/domain/actions/board.action";
import { findWorkspaceByIdAction } from "@/domain/actions/workspace.action";
import { BoardContainer } from "@/components/board/board-container";
import { requireAuth } from "@/lib/session";
import { unwrapActionResult } from "@/lib/response";
import { findLimitCardByBoardIdAction } from "@/domain/actions/card.action";

interface BoardsPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { boardId } = await params;

  const userPromise = requireAuth();
  const boardPromise = findBoardByIdAction({ boardId });
  const limitCardPromise = findLimitCardByBoardIdAction({ boardId });

  const [user, boardResult, limitCardResult] = await Promise.all([
    userPromise,
    boardPromise,
    limitCardPromise,
  ]);

  const board = unwrapActionResult(boardResult);
  if (!board) return null;

  const workspaceResult = await findWorkspaceByIdAction({
    workspaceId: board.workspaceId,
  });

  const workspace = unwrapActionResult(workspaceResult);
  if (!workspace) return null;

  const limitCardsPerBoard = unwrapActionResult(limitCardResult);

  return (
    <BoardContainer
      limitCardsPerBoard={limitCardsPerBoard}
      board={board}
      user={user}
      workspaceMembers={workspace.members}
    />
  );
};

export default BoardsPage;
