import { findBoardsByWorkspaceIdAction } from "@/domain/actions/board.action";
import { BoardList } from "@/components/board/board-list";
import { BoardWithMember } from "@/domain/types/board.type";
import { unwrapActionResult } from "@/lib/response";

interface BoardsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { workspaceId } = await params;

  const boards = unwrapActionResult<BoardWithMember[]>(
    await findBoardsByWorkspaceIdAction(workspaceId)
  );

  if (!boards) return null;

  return <BoardList boards={boards} workspaceId={workspaceId} />;
};

export default BoardsPage;
