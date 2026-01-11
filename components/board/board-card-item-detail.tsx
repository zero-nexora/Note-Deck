import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { BoardCardItemMembers } from "./board-card-item-members";
import { BoardCardItemLabels } from "./board-card-item-labels";
import { BoardCardItemChecklists } from "./board-card-item-checklist";
import { BoardCardItemAttachments } from "./board-card-item-attachment";
import { BoardCardItemComments } from "./board-card-item-comment";
import { BoardCardItemTitleDescDueDate } from "./board-card-item-title-desc-due-date";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { BoardCardItemCoverImage } from "./board-card-item-cover-image";
import { useEffect, useState } from "react";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import { useCard } from "@/hooks/use-card";

interface BoardCardItemDetailProps {
  cardId: BoardWithListLabelsAndMembers["lists"][number]["cards"][number]["id"];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItemDetail = ({
  cardId,
  boardMembers = [],
  boardLabels = [],
  realtimeUtils,
}: BoardCardItemDetailProps) => {
  const [card, setCard] =
    useState<CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers | null>(
      null
    );
  const { findCardById } = useCard();

  useEffect(() => {
    const fetchCard = async (cardId: string) => {
      const card = await findCardById(cardId);
      if (card) setCard(card);
      else setCard(null);
    };
    if (cardId) {
      fetchCard(cardId);
    }
  }, [cardId]);

  if (!card) return null;

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-4">
        <BoardCardItemTitleDescDueDate
          cardId={card.id}
          title={card.title}
          description={card.description}
          dueDate={card.dueDate}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemCoverImage
          cardId={card.id}
          coverImage={card.coverImage}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemMembers
          cardId={card.id}
          cardMembers={card.members}
          boardMembers={boardMembers}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemLabels
          cardId={card.id}
          cardLabels={card.cardLabels}
          boardLabels={boardLabels}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemAttachments
          cardId={card.id}
          attachments={card.attachments}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemChecklists
          cardId={card.id}
          cardChecklists={card.checklists}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemComments
          cardId={card.id}
          comments={card.comments}
          realtimeUtils={realtimeUtils}
        />
      </div>
    </div>
  );
};
