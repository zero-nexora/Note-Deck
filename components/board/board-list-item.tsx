"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardListCards } from "./board-list-cards";
import { BoardListHeader } from "./board-list-header";
import { BoardListFooter } from "./board-list-footer";
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
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-[320px] shrink-0 flex flex-col rounded-lg bg-card border border-border shadow-sm",
        isDragging && "opacity-50 cursor-grabbing",
        isDraggingByOthers && "opacity-50 pointer-events-none"
      )}
    >
      {isDraggingByOthers && draggingUser && (
        <div
          className="absolute inset-0 rounded-lg border-2 z-10"
          style={{
            borderColor: draggingUser.user.color,
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-white font-medium shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: draggingUser.user.color,
            }}
          >
            <User className="h-4 w-4" />
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
        onDuplicate={handleDuplicateList}
      />

      <div className="flex-1 overflow-y-auto p-1 space-y-3">
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
