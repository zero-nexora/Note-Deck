import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { BoardCardItemMembers } from "./board-card-item-members";
import { BoardCardItemLabels } from "./board-card-item-labels";
import { BoardCardItemChecklists } from "./board-card-item-checklist";
import { BoardCardItemAttachments } from "./board-card-item-attachment";
import { BoardCardItemComments } from "./board-card-item-comment";
import { BoardCardItemTitleDescDueDate } from "./board-card-item-title-desc-due-date";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { BoardCardItemCoverImage } from "./board-card-item-cover-image";
import { useEffect, useState, useMemo } from "react";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import { useCard } from "@/hooks/use-card";
import { BoardCardItemActivities } from "./board-card-item-activities";

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
      null,
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

  const displayCard = useMemo(() => {
    if (!card) return null;

    const optimisticTitle = realtimeUtils?.getCardOptimisticValue(
      card.id,
      "title",
    );
    const optimisticDescription = realtimeUtils?.getCardOptimisticValue(
      card.id,
      "description",
    );
    const optimisticDueDate = realtimeUtils?.getCardOptimisticValue(
      card.id,
      "dueDate",
    );
    const optimisticCoverImage = realtimeUtils?.getCardOptimisticValue(
      card.id,
      "coverImage",
    );

    return {
      ...card,
      title: optimisticTitle ?? card.title,
      description: optimisticDescription ?? card.description,
      dueDate: optimisticDueDate ?? card.dueDate,
      coverImage: optimisticCoverImage ?? card.coverImage,
    };
  }, [card, realtimeUtils]);

  if (!displayCard) return null;

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-4">
        <BoardCardItemTitleDescDueDate
          cardId={displayCard.id}
          title={displayCard.title}
          description={displayCard.description}
          dueDate={displayCard.dueDate}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemCoverImage
          cardId={displayCard.id}
          coverImage={displayCard.coverImage}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemMembers
          cardId={displayCard.id}
          cardMembers={displayCard.members}
          boardMembers={boardMembers}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemLabels
          cardId={displayCard.id}
          cardLabels={displayCard.cardLabels}
          boardLabels={boardLabels}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemAttachments
          cardId={displayCard.id}
          attachments={displayCard.attachments}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemChecklists
          cardId={displayCard.id}
          cardChecklists={displayCard.checklists}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemComments
          cardId={displayCard.id}
          comments={displayCard.comments}
          realtimeUtils={realtimeUtils}
        />

        <BoardCardItemActivities
          activities={displayCard.activities}
        />
      </div>
    </div>
  );
};
