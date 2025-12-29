import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LiveList, LiveObject } from "@liveblocks/core";

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

export function boardToStorage(
  board: BoardWithListColumnLabelAndMember
) {
  return new LiveObject({
    id: board.id,
    workspaceId: board.workspaceId,
    name: board.name,
    description: board.description,
    isArchived: board.isArchived,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),

    lists: new LiveList(
      board.lists.map(
        (list) =>
          new LiveObject({
            id: list.id,
            boardId: list.boardId,
            name: list.name,
            position: list.position,
            isArchived: list.isArchived,
            createdAt: list.createdAt.toISOString(),
            updatedAt: list.updatedAt.toISOString(),

            cards: new LiveList(
              list.cards.map(
                (card) =>
                  new LiveObject({
                    id: card.id,
                    boardId: card.boardId,
                    listId: card.listId,
                    title: card.title,
                    description: card.description,
                    position: card.position,
                    dueDate: card.dueDate
                      ? card.dueDate.toISOString()
                      : null,
                    coverImage: card.coverImage,
                    isArchived: card.isArchived,
                    createdAt: card.createdAt.toISOString(),
                    updatedAt: card.updatedAt.toISOString(),

                    // labels: new LiveList(
                    //   card.labels.map(
                    //     (cl) =>
                    //       new LiveObject({
                    //         id: cl.id,
                    //         cardId: cl.cardId,
                    //         labelId: cl.labelId,
                    //         label: {
                    //           id: cl.label.id,
                    //           boardId: cl.label.boardId,
                    //           name: cl.label.name,
                    //           color: cl.label.color,
                    //           createdAt:
                    //             cl.label.createdAt.toISOString(),
                    //         },
                    //       })
                    //   )
                    // ),

                    members: new LiveList(
                      card.members.map(
                        (cm) =>
                          new LiveObject({
                            id: cm.id,
                            cardId: cm.cardId,
                            userId: cm.userId,
                            createdAt:
                              cm.createdAt.toISOString(),
                            user: {
                              id: cm.user.id,
                              name: cm.user.name,
                              email: cm.user.email,
                              emailVerified:
                                cm.user.emailVerified
                                  ? cm.user.emailVerified.toISOString()
                                  : null,
                              image: cm.user.image,
                              password: cm.user.password,
                            },
                          })
                      )
                    ),
                  })
              )
            ),
          })
      )
    ),

    labels: new LiveList(
      board.labels.map(
        (label) =>
          new LiveObject({
            id: label.id,
            boardId: label.boardId,
            name: label.name,
            color: label.color,
            createdAt: label.createdAt.toISOString(),
          })
      )
    ),

    members: new LiveList(
      board.members.map(
        (member) =>
          new LiveObject({
            id: member.id,
            boardId: member.boardId,
            userId: member.userId,
            role: member.role,
            createdAt: member.createdAt.toISOString(),
            user: {
              id: member.user.id,
              name: member.user.name,
              email: member.user.email,
              emailVerified:
                member.user.emailVerified
                  ? member.user.emailVerified.toISOString()
                  : null,
              image: member.user.image,
              password: member.user.password,
            },
          })
      )
    ),

    workspace: {
      id: board.workspace.id,
      name: board.workspace.name,
      slug: board.workspace.slug,
      ownerId: board.workspace.ownerId,
      plan: board.workspace.plan,
      stripeCustomerId: board.workspace.stripeCustomerId,
      stripeSubscriptionId: board.workspace.stripeSubscriptionId,
      subscriptionStatus: board.workspace.subscriptionStatus,
      limits: board.workspace.limits
        ? String(board.workspace.limits)
        : null,
      createdAt: board.workspace.createdAt.toISOString(),
      updatedAt: board.workspace.updatedAt.toISOString(),
    },
  });
}
