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

export const boardToStorage = (board: BoardWithListColumnLabelAndMember) => ({
  ...board,
  createdAt: board.createdAt.toISOString(),
  updatedAt: board.updatedAt.toISOString(),
  lists: board.lists.map((list) => ({
    ...list,
    createdAt: list.createdAt.toISOString(),
    updatedAt: list.updatedAt.toISOString(),
    cards: list.cards.map((card) => ({
      id: card.id,
      description: card.description,
      isArchived: card.isArchived,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
      boardId: card.boardId,
      position: card.position,
      listId: card.listId,
      title: card.title,
      dueDate: card.dueDate?.toISOString() ?? null,
      coverImage: card.coverImage ?? null,
      labels: card.labels.map((label) => ({
        id: label.id,
        cardId: label.cardId,
        labelId: label.labelId,
        label: {
          id: label.label.id,
          name: label.label.name,
          createdAt: label.label.createdAt.toISOString(),
          boardId: label.label.boardId,
          color: label.label.color,
        },
      })),
      members: card.members.map((member) => ({
        id: member.id,
        cardId: member.cardId,
        userId: member.userId,
        name: member.user.name ?? "",
        image: member.user.image ?? null,
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
    name: member.user.name ?? "",
    image: member.user.image ?? null,
  })),
  workspace: board.workspace,
});
