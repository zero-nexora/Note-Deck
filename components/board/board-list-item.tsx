import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { useConfirm } from "@/stores/confirm-store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UserIcon } from "lucide-react";
import { BoardListHeader } from "./board-list-header";
import { BoardListCards } from "./board-list-cards";
import { BoardListFooter } from "./board-list-footer";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal-store";
import { BoardListItemUpdateForm } from "./board-list-item-update-form";
import { useBoardRealtimePresence } from "@/hooks/use-board-realtime-presence";
import { useBoardRealtimeLists } from "@/hooks/use-board-realtime-lists";
import { User } from "@/domain/types/user.type";

interface BoardListItemProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  user: User;
}

export const BoardListItem = ({
  list,
  boardLabels = [],
  boardMembers = [],
  user,
}: BoardListItemProps) => {
  const { open: openConfirm } = useConfirm();
  const { open: openModal } = useModal();
  const { deleteList, duplicateList, archiveList, restoreList } = useList();

  const realtimePresence = useBoardRealtimePresence();
  const {
    broadcastListDeleted,
    broadcastListArchived,
    broadcastListRestored,
    broadcastListDuplicated,
    broadcastListUpdated,
  } = useBoardRealtimeLists({ user });

  const isDraggingByOthers = realtimePresence.isDraggingListByOthers(list.id);
  const draggingUser = realtimePresence.getUserDraggingList(list.id);
  const canDrag = realtimePresence.canDragList(list.id);

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

  const handleDeleteList = () => {
    openConfirm({
      title: "Delete list",
      description: "Are you sure you want to delete this list?",
      onConfirm: async () => {
        const result = await deleteList({ id: list.id });
        if (result) {
          broadcastListDeleted(list.id);
        }
      },
    });
  };

  const handleDuplicateList = async () => {
    const result = await duplicateList({ id: list.id });
    if (result) {
      broadcastListDuplicated(result);
    }
  };

  const handleArchiveList = async () => {
    const result = await archiveList({ id: list.id });
    if (result) {
      broadcastListArchived(list.id);
    }
  };

  const handleRestoreList = async () => {
    const result = await restoreList({ id: list.id });
    if (result) {
      broadcastListRestored(list.id);
    }
  };

  const handleBroadcastListUpdated = (
    listId: string,
    data: { name: string },
  ) => {
    broadcastListUpdated(listId, data);
  };

  const handleUpdateList = () => {
    openModal({
      title: "Update list",
      description: "Update your list details",
      children: (
        <BoardListItemUpdateForm
          list={list}
          onUpdate={handleBroadcastListUpdated}
        />
      ),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-[320px] shrink-0 flex flex-col rounded-lg bg-card border shadow-sm relative",
        isDragging && "opacity-50 cursor-grabbing",
        isDraggingByOthers && "opacity-60",
      )}
    >
      {isDraggingByOthers && draggingUser && (
        <div
          className="absolute top-2 right-2 z-20 px-3 py-1.5 rounded-md text-sm font-medium text-white shadow-md flex items-center gap-2"
          style={{ backgroundColor: draggingUser.user.color }}
        >
          <UserIcon className="h-4 w-4" />
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
        onEdit={handleUpdateList}
        onArchive={handleArchiveList}
        onRestore={handleRestoreList}
      />

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <BoardListCards
          boardMembers={boardMembers}
          boardLabels={boardLabels}
          list={list}
          user={user}
        />
      </div>

      <BoardListFooter list={list} user={user} />
    </div>
  );
};
