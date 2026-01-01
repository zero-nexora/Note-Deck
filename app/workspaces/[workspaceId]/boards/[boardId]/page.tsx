import { findBoardByIdAction } from "@/app/actions/board.action";
import { findWorkspaceByIdAction } from "@/app/actions/workspace.action";
import { BoardContainer } from "@/components/board/board-container";
import { requireAuth } from "@/lib/session";

interface BoardsPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { boardId } = await params;
  const user = await requireAuth();

  const result = await findBoardByIdAction(boardId);

  if (!result.success || !result.data) return null;

  const board = result.data;


  const resultWorkspaceMember = await findWorkspaceByIdAction(
    board.workspaceId
  );
  if (!resultWorkspaceMember.success || !resultWorkspaceMember.data)
    return null;

  const workspaceMembers = resultWorkspaceMember.data.members;

  return (
    <BoardContainer
      board={board}
      user={user}
      workspaceMembers={workspaceMembers}
    />
  );
};

export default BoardsPage;
