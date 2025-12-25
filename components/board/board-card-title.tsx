"use client";

interface BoardCardTitleProps {
  title: string;
}

export const BoardCardTitle = ({ title }: BoardCardTitleProps) => {
  return (
    <h4 className="font-medium text-sm text-card-foreground line-clamp-3 leading-snug">
      {title}
    </h4>
  );
};
