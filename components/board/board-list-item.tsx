"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardListCards } from "./board-list-cards";
import { BoardListHeader } from "./board-list-header";
import { BoardListFooter } from "./board-list-footer";
import { ScrollArea } from "../ui/scroll-area";
import { useConfirm } from "@/stores/confirm-store";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { User } from "lucide-react";

interface BoardListItemProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardListItem = ({
  list,
  boardLabels = [],
  boardMembers = [],
  realtimeUtils,
}: BoardListItemProps) => {
  const { open } = useConfirm();
  const { deleteList } = useList();

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-72 shrink-0 flex flex-col glass-card relative",
        isDragging && "opacity-50",
        isDraggingByOthers && "opacity-70" 
      )}
    >
      {isDraggingByOthers && draggingUser && (
        <div
          className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] rounded-lg border-2 border-dashed z-20 flex items-center justify-center pointer-events-none"
          style={{
            borderColor: draggingUser.user.color,
          }}
        >
          <div
            className="px-3 py-2 rounded-md text-sm font-medium text-foreground shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: draggingUser.user.color,
            }}
          >
            <User className="w-4 h-4" />
            <span>{draggingUser.user.name} is moving this list...</span>
          </div>
        </div>
      )}

      <BoardListHeader
        list={list}
        dragHandleProps={{
          attributes,
          listeners: canDrag ? listeners : {},
        }}
        onDelete={handleDeleteList}
      />

      <ScrollArea className="h-[calc(100vh-270px)]">
        <BoardListCards
          boardMembers={boardMembers}
          boardLabels={boardLabels}
          list={list}
          realtimeUtils={realtimeUtils}
        />
      </ScrollArea>

      <BoardListFooter list={list} realtimeUtils={realtimeUtils} />
    </div>
  );
};
