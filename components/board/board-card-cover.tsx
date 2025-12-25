"use client";

import Image from "next/image";

interface BoardCardCoverProps {
  coverImage: string | null;
  title: string;
}

export const BoardCardCover = ({ coverImage, title }: BoardCardCoverProps) => {
  if (!coverImage) return null;

  return (
    <div className="relative w-full h-32 rounded-t-lg overflow-hidden bg-muted">
      <Image src={coverImage} alt={title} fill className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
    </div>
  );
};
