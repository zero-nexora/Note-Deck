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
      onClick={handleCreateBoard}
      className="h-full border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-foreground">Create New Board</div>
          <div className="text-sm text-muted-foreground">
            Start organizing your tasks
          </div>
        </div>
      </div>
    </Button>
  );
};
