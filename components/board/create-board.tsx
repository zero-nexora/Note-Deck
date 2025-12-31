import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/stores/modal-store";
import { CreateBoardForm } from "./create-board-form";

interface CreateBoardProps {
  workspaceId: string;
}

export const CreateBoard = ({ workspaceId }: CreateBoardProps) => {
  const { open } = useModal();

  const handleCreateBoard = () => {
    open({
      title: "Create New Board",
      description: "Set up a new board to organize your work",
      children: <CreateBoardForm workspaceId={workspaceId} />,
    });
  };

  return (
    <Button
      variant="outline"
      className="h-full min-h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 flex flex-col items-center justify-center gap-3"
      onClick={handleCreateBoard}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Plus className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-foreground">
          Create New Board
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Start organizing your tasks
        </div>
      </div>
    </Button>
  );
};