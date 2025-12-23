"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface CardItemProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
}

export const CardItem = ({ card }: CardItemProps) => {
  return (
    <Card className="cursor-pointer hover:bg-secondary transition">
      <CardContent className="p-3 text-sm">{card.title}</CardContent>
    </Card>
  );
};
