import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { BoardCardItemMembers, BoardCardItemMembersSkeleton } from "./board-card-item-members";
import { BoardCardItemLabels, BoardCardItemLabelsSkeleton } from "./board-card-item-labels";
import { BoardCardItemChecklists, BoardCardItemChecklistsSkeleton } from "./board-card-item-checklist";
import { BoardCardItemAttachments, BoardCardItemAttachmentsSkeleton } from "./board-card-item-attachment";
import { BoardCardItemComments, BoardCardItemCommentsSkeleton } from "./board-card-item-comment";
import { BoardCardItemTitleDescDueDate, BoardCardItemTitleDescDueDateSkeleton } from "./board-card-item-title-desc-due-date";
import { BoardCardItemCoverImage, BoardCardItemCoverImageSkeleton } from "./board-card-item-cover-image";
import { useEffect, useState } from "react";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import { useCard } from "@/hooks/use-card";
import { BoardCardItemActivities, BoardCardItemActivitiesSkeleton } from "./board-card-item-activities";

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
  const [isLoading, setIsLoading] = useState(true);
  const { findCardById } = useCard();

  useEffect(() => {
    const fetchCard = async (cardId: string) => {
      setIsLoading(true);
      try {
        const card = await findCardById(cardId);
        if (card) {
          setCard(card);
        } else {
          setCard(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (cardId) {
      fetchCard(cardId);
    }
  }, [cardId, findCardById]);

  if (!isLoading) {
    return (
      <div className="space-y-6 pb-6">
        <div className="space-y-4">
          <BoardCardItemTitleDescDueDateSkeleton />
          <BoardCardItemCoverImageSkeleton />
          <BoardCardItemMembersSkeleton />
          <BoardCardItemLabelsSkeleton />
          <BoardCardItemAttachmentsSkeleton />
          <BoardCardItemChecklistsSkeleton />
          <BoardCardItemCommentsSkeleton />
          <BoardCardItemActivitiesSkeleton />
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Card not found</p>
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
