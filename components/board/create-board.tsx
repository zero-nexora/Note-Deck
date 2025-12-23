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
      title: "Create new board",
      description: "Add a new board to organize your work",
      children: <CreateBoardForm workspaceId={workspaceId} />,
    });
  };

  return (
    <Button
      className="h-36 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 flex flex-col items-center justify-center gap-2 transition-all group"
      onClick={handleCreateBoard}
    >
      <div className="w-12 h-12 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        Create new board
      </span>
    </Button>
  );
};
