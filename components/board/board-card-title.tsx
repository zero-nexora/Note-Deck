"use client";

interface BoardCardTitleProps {
  title: string;
}

export const BoardCardTitle = ({ title }: BoardCardTitleProps) => {
  return (
    <h4 className="text-sm font-medium text-foreground line-clamp-3 group-hover:text-primary transition-colors">
      {title}
    </h4>
  );
};
