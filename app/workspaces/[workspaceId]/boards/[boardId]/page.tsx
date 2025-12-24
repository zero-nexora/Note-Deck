import { findBoardByIdAction } from "@/app/actions/board.action";
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

  return <BoardContainer board={board} user={user} />;
};

export default BoardsPage;
