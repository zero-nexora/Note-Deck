import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/stores/modal-store";
import { CreateBoardForm } from "./create-board-form";
import { WorkspaceWithLimits } from "@/domain/types/workspace.type";
import clsx from "clsx";

interface CreateBoardProps {
  workspaceId: string;
  workspaceLimits: WorkspaceWithLimits | null;
}

export const CreateBoard = ({
  workspaceId,
  workspaceLimits,
}: CreateBoardProps) => {
  const { open } = useModal();

  const usedBoards = workspaceLimits?.usage.boards ?? 0;
  const boardLimit = workspaceLimits?.limits.boards ?? 0;

  const isUnlimited = boardLimit === -1;
  const isLimitReached =
    !isUnlimited && boardLimit > 0 && usedBoards >= boardLimit;

  const handleCreateBoard = () => {
    if (isLimitReached) return;

    open({
      title: "Create New Board",
      description: "Set up a new board to organize your work",
      children: <CreateBoardForm workspaceId={workspaceId} />,
    });
  };

  return (
    <Button
      variant="outline"
      disabled={isLimitReached}
      onClick={handleCreateBoard}
      className={clsx(
        "h-full border-2 border-dashed transition-all duration-200 group",
        isLimitReached
          ? "cursor-not-allowed opacity-60"
          : "border-border hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-1">
          <div className="font-semibold text-foreground">Create New Board</div>

          <div className="text-sm text-muted-foreground">
            {isUnlimited
              ? "Unlimited boards"
              : `${usedBoards} / ${boardLimit} boards used`}
          </div>

          {isLimitReached && (
            <div className="text-xs text-destructive">Board limit reached</div>
          )}
        </div>
      </div>
    </Button>
  );
};
