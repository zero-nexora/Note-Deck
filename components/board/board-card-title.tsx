"use client";

interface BoardCardTitleProps {
  title: string;
}

export const BoardCardTitle = ({ title }: BoardCardTitleProps) => {
  return (
    <h4 className="text-sm font-normal text-card-foreground line-clamp-3 leading-relaxed wrap-break-word">
      {title}
    </h4>
  );
};
