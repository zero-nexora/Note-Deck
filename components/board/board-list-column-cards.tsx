import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardItem } from "./card-item";

interface BoardListColumnCardsProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}

export const BoardListColumnCards = ({ list }: BoardListColumnCardsProps) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="space-y-2 p-2 min-h-[100px]">
        <SortableContext
          items={list.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </SortableContext>

        {list.cards.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-border/50 rounded-lg bg-muted/20">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
};
