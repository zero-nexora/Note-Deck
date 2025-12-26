
import { findBoardsByWorkspaceIdAction } from "@/app/actions/board.action";
import { BoardList } from "@/components/board/board-list";
import { BoardWithMember } from "@/domain/types/board.type";

interface BoardsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const BoardsPage = async ({ params }: BoardsPageProps) => {
  const { workspaceId } = await params;

  const result = await findBoardsByWorkspaceIdAction(workspaceId);
  if (!result.success) return null;

  const boards = result.data as BoardWithMember[];

  return (
    <div>
      <BoardList boards={boards} workspaceId={workspaceId} />
    </div>
  );
};

export default BoardsPage;
