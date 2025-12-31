import Image from "next/image";

interface BoardCardCoverProps {
  coverImage: string | null;
  title: string;
}

export const BoardCardCover = ({ coverImage, title }: BoardCardCoverProps) => {
  if (!coverImage) return null;

  return (
    <div className="relative w-full h-40 rounded-t-lg overflow-hidden bg-muted">
      <Image
        src={coverImage}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
};
