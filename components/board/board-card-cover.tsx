import Image from "next/image";

interface BoardCardCoverProps {
  coverImage: string | null;
  title: string;
}

export const BoardCardCover = ({ coverImage, title }: BoardCardCoverProps) => {
  if (!coverImage) return null;

  return (
    <div className="relative h-32 w-full rounded-t-lg overflow-hidden">
      <Image
        src={coverImage}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
