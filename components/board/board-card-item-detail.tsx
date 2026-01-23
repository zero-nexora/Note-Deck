import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { BoardCardItemMembers } from "./board-card-item-members";
import { BoardCardItemLabels } from "./board-card-item-labels";
import { BoardCardItemChecklists } from "./board-card-item-checklist";
import { BoardCardItemAttachments } from "./board-card-item-attachment";
import { BoardCardItemComments } from "./board-card-item-comment";
import { BoardCardItemTitleDescDueDate } from "./board-card-item-title-desc-due-date";
import { BoardCardItemCoverImage } from "./board-card-item-cover-image";
import { useEffect, useState } from "react";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import { useCard } from "@/hooks/use-card";
import { BoardCardItemActivities } from "./board-card-item-activities";
import { User } from "@/domain/types/user.type";

interface BoardCardItemDetailProps {
  cardId: BoardWithListLabelsAndMembers["lists"][number]["cards"][number]["id"];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
}

export const BoardCardItemDetail = ({
  cardId,
  boardMembers = [],
  boardLabels = [],
}: BoardCardItemDetailProps) => {
  const [card, setCard] =
    useState<CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers | null>(
      null,
    );
  const { findCardById } = useCard();

  useEffect(() => {
    const fetchCard = async (cardId: string) => {
      const card = await findCardById(cardId);
      if (card) {
        setCard(card);
      } else {
        setCard(null);
      }
    };
    if (cardId) {
      fetchCard(cardId);
    }
  }, [cardId, findCardById]);

  if (!card) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-4">
        <BoardCardItemTitleDescDueDate
          cardId={card.id}
          title={card.title}
          description={card.description}
          dueDate={card.dueDate}
        />

        <BoardCardItemCoverImage
          cardId={card.id}
          coverImage={card.coverImage}
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

        <BoardCardItemActivities activities={card.activities} />
      </div>
    </div>
  );
};
