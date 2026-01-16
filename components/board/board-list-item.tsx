import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useList } from "@/hooks/use-list";
import { useConfirm } from "@/stores/confirm-store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { User } from "lucide-react";
import { BoardListHeader } from "./board-list-header";
import { BoardListCards } from "./board-list-cards";
import { BoardListFooter } from "./board-list-footer";
import { cn } from "@/lib/utils";

interface BoardListItemProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardListItem = ({
  list,
  boardLabels = [],
  boardMembers = [],
  realtimeUtils,
}: BoardListItemProps) => {
  const { open } = useConfirm();
  const { deleteList, duplicateList } = useList();

  const isDraggingByOthers = realtimeUtils?.isDraggingListByOthers(list.id);
  const draggingUser = realtimeUtils?.getUserDraggingList(list.id);
  const canDrag = realtimeUtils?.canDragList(list.id) ?? true;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteList = async () => {
    open({
      title: "Delete list",
      description: "Are you sure you want to delete this list?",
      onConfirm: async () => {
        await deleteList({ id: list.id });
        realtimeUtils?.broadcastListDeleted({ listId: list.id });
      },
    });
  };

  const handleDuplicateList = async () => {
    open({
      title: "Duplicate list",
      description: "Are you sure you want to duplicate this list?",
      onConfirm: async () => {
        await duplicateList({ id: list.id });
        realtimeUtils?.broadcastListDuplicate({ sourceListId: list.id });
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-[320px] shrink-0 flex flex-col rounded-lg bg-card border shadow-sm relative",
        isDragging && "opacity-50 cursor-grabbing",
        isDraggingByOthers && "opacity-60"
      )}
    >
      {/* List Dragging Badge */}
      {isDraggingByOthers && draggingUser && (
        <div
          className="absolute top-2 right-2 z-20 px-3 py-1.5 rounded-md text-sm font-medium text-white shadow-md flex items-center gap-2"
          style={{ backgroundColor: draggingUser.user.color }}
        >
          <User className="h-4 w-4" />
          <span>{draggingUser.user.name}</span>
        </div>
      )}

      <BoardListHeader
        list={list}
        dragHandleProps={{
          attributes,
          listeners: canDrag ? listeners : {},
        }}
        onDelete={handleDeleteList}
        onDuplicate={handleDuplicateList}
      />

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <BoardListCards
          boardMembers={boardMembers}
          boardLabels={boardLabels}
          list={list}
          realtimeUtils={realtimeUtils}
        />
      </div>

      <BoardListFooter list={list} realtimeUtils={realtimeUtils} />
    </div>
  );
};
