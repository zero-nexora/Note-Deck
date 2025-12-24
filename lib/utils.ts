import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (user: any) => {
  if (user.name) {
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
  return user.email?.substring(0, 2).toUpperCase() || "U";
};
export function boardToStorage(board: BoardWithListColumnLabelAndMember) {
  return {
    id: board.id,
    workspaceId: board.workspaceId,
    name: board.name,
    description: board.description,
    isArchived: board.isArchived,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
    lists: board.lists.map((list) => ({
      id: list.id,
      name: list.name,
      isArchived: list.isArchived,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      boardId: list.boardId,
      position: list.position,
      cards: list.cards.map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description,
        isArchived: card.isArchived,
        createdAt: card.createdAt.toISOString(),
        updatedAt: card.updatedAt.toISOString(),
        boardId: card.boardId,
        listId: card.listId,
        position: card.position,
        dueDate: card.dueDate?.toISOString() || null,
        coverImage: card.coverImage,
        labels: card.labels.map((label) => ({
          id: label.id,
          cardId: label.cardId,
          labelId: label.labelId,
          label: {
            id: label.label.id,
            name: label.label.name,
            color: label.label.color,
            createdAt: label.label.createdAt.toISOString(),
            boardId: label.label.boardId,
          },
        })),
        members: card.members.map((member) => ({
          id: member.id,
          cardId: member.cardId,
          userId: member.userId,
          name: member.user.name || "",
          image: member.user.image,
        })),
      })),
    })),
    labels: board.labels.map((label) => ({
      id: label.id,
      boardId: label.boardId,
      name: label.name,
      color: label.color,
    })),
    members: board.members.map((member) => ({
      id: member.id,
      boardId: member.boardId,
      userId: member.userId,
      name: member.user.name || "",
      image: member.user.image,
    })),
    workspace: {
      id: board.workspace.id,
      name: board.workspace.name,
    },
  };
}
