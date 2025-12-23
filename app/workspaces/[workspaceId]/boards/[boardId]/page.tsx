import { findBoardByIdAction } from "@/app/actions/board.action";
import { BoardContainer } from "@/components/board/board-container";

interface BoardsPageProps {
  params: Promise<{ boardId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { boardId } = await params;

  const result = await findBoardByIdAction(boardId);

  if (!result.success || !result.data) return null;

  const board = result.data;

  return (
    <div className="flex-1 h-full">
      <BoardContainer board={board} />
    </div>
  );
};

export default BoardsPage;
