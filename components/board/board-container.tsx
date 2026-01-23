"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { BoardContent } from "./board-content";
import { User } from "@/domain/types/user.type";
import { BoardHeader } from "./board-header";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { useRouter } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveCursors } from "./live-cursors";
import { generateUserColor, RoomProvider } from "@/lib/liveblocks";
import { useCallback, useMemo } from "react";
import { LimitCardsPerBoard } from "@/domain/types/card.type";
import { useBoardRealtimeRefresh } from "@/hooks/use-board-realtime-refresh";
import { useBoardRealtimeLists } from "@/hooks/use-board-realtime-lists";
import { useBoardRealtimeCards } from "@/hooks/use-board-realtime-cards";

interface BoardContainerProps {
  board: BoardWithListLabelsAndMembers;
  user: User;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
  limitCardsPerBoard: LimitCardsPerBoard | null;
}

const BoardContainerInner = ({
  board,
  user,
  workspaceMembers,
  limitCardsPerBoard,
}: BoardContainerProps) => {
  const router = useRouter();
  const { getNewLists, isListDeleted, getListValue } = useBoardRealtimeLists({
    user,
  });
  const { getNewCards, isCardDeleted, getCardValue } = useBoardRealtimeCards({
    user,
  });

  const handleBoardUpdate = useCallback(() => {
    router.refresh();
  }, [router]);

  useBoardRealtimeRefresh({
    onRefresh: handleBoardUpdate,
  });

  const displayBoard = useMemo(() => {
    const newListsFromRealtime = getNewLists();
    const newCardsFromRealtime = getNewCards();

    const updatedLists = board.lists
      .filter((list) => !isListDeleted(list.id))
      .map((list) => {
        const listName = getListValue(list.id, "name");

        const newCardsForThisList = newCardsFromRealtime
          .filter((c) => c.listId === list.id)
          .map((newCard) => ({
            ...newCard,
            members: newCard.members.map((m) => ({
              ...m,
              user: {
                ...m.user,
                emailVerified: null,
                password: null,
              },
            })),
          }));

        const updatedExistingCards = list.cards
          .filter((card) => !isCardDeleted(card.id))
          .map((card) => {
            const title = getCardValue(card.id, "title");
            const description = getCardValue(card.id, "description");
            const dueDate = getCardValue(card.id, "dueDate");
            const coverImage = getCardValue(card.id, "coverImage");

            return {
              ...card,
              title: title ?? card.title,
              description:
                description !== undefined ? description : card.description,
              dueDate: dueDate !== undefined ? dueDate : card.dueDate,
              coverImage:
                coverImage !== undefined ? coverImage : card.coverImage,
            };
          });

        return {
          ...list,
          name: listName ?? list.name,
          cards: [...updatedExistingCards, ...newCardsForThisList],
        };
      });

    const newListsWithCards = newListsFromRealtime.map((newList) => {
      const cardsForNewList = newCardsFromRealtime
        .filter((c) => c.listId === newList.id)
        .map((newCard) => ({
          ...newCard,
          members: newCard.members.map((m) => ({
            ...m,
            user: {
              ...m.user,
              emailVerified: null,
              password: null,
            },
          })),
        }));

      return {
        ...newList,
        cards: [...newList.cards, ...cardsForNewList],
      };
    });

    return {
      ...board,
      lists: [...updatedLists, ...newListsWithCards],
    };
  }, [
    board,
    getNewLists,
    getNewCards,
    isListDeleted,
    isCardDeleted,
    getListValue,
    getCardValue,
  ]);

  return (
    <div className="relative h-screen bg-background">
      <LiveCursors />
      <div className="flex flex-col h-full gap-4">
        <BoardHeader
          limitCardsPerBoard={limitCardsPerBoard}
          board={displayBoard}
          workspaceMembers={workspaceMembers}
          user={user}
        />
        <BoardContent board={displayBoard} user={user} />
      </div>
    </div>
  );
};

export const BoardContainer = ({
  board,
  user,
  workspaceMembers,
  limitCardsPerBoard,
}: BoardContainerProps) => {
  const userColor = generateUserColor(user.id);

  return (
    <RoomProvider
      id={board.id}
      initialPresence={{
        cursor: null,
        draggingCardId: null,
        draggingListId: null,
        editingCardId: null,
        user: {
          id: user.id,
          name: user.name || "Anonymous",
          image: user.image,
          color: userColor,
        },
      }}
    >
      <ClientSideSuspense fallback={<BoardLoading />}>
        {() => (
          <BoardContainerInner
            limitCardsPerBoard={limitCardsPerBoard}
            board={board}
            user={user}
            workspaceMembers={workspaceMembers}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const BoardLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading board...</p>
      </div>
    </div>
  );
};
