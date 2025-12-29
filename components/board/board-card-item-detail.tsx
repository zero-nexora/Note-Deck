import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { BoardCardItemMembers } from "./board-card-item-members";
import { BoardCardItemLabels } from "./board-card-item-labels";
import { BoardCardItemChecklists } from "./board-card-item-checklist";
import { BoardCardItemAttachments } from "./board-card-item-attachment";
import { BoardCardItemComments } from "./board-card-item-comment";
import { BoardCardItemTitleDescDueDate } from "./board-card-item-title-desc-due-date";

interface BoardCardItemDetailProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
}

export const BoardCardItemDetail = ({
  card,
  boardMembers = [],
  boardLabels = [],
}: BoardCardItemDetailProps) => {
  return (
    <div className="h-full w-full mx-auto">
      <div className="flex flex-col gap-5">
        <BoardCardItemTitleDescDueDate
          cardId={card.id}
          title={card.title}
          description={card.description}
          dueDate={card.dueDate}
        />

        <BoardCardItemMembers
          cardId={card.id}
          cardMembers={card.members}
          boardMembers={boardMembers}
        />

        <BoardCardItemLabels
          cardId={card.id}
          cardLabels={card.cardLabels}
          boardLabels={boardLabels}
        />

        <BoardCardItemAttachments
          cardId={card.id}
          attachments={card.attachments}
        />

        <BoardCardItemChecklists
          cardId={card.id}
          cardChecklists={card.checklists}
        />

        <BoardCardItemComments cardId={card.id} comments={card.comments} />
      </div>
    </div>
  );
};
