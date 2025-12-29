import { useState, useEffect } from "react";
import { ImageIcon, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCard } from "@/hooks/use-card";
import { ImageAttachmentPicker } from "../common/image-attachment-picker";
import Image from "next/image";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardCardItemCoverImageProps {
  cardId: string;
  coverImage: string | null;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItemCoverImage = ({
  cardId,
  coverImage: initialCoverImage,
  realtimeUtils,
}: BoardCardItemCoverImageProps) => {
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateCard } = useCard();

  useEffect(() => {
    setCoverImage(initialCoverImage);
  }, [initialCoverImage]);

  const handleAddCover = async (imageUrl: string) => {
    setIsUpdating(true);
    try {
      const updatedCard = await updateCard(cardId, {
        coverImage: imageUrl,
      });

      if (updatedCard) {
        setCoverImage(updatedCard.coverImage);

        realtimeUtils.broadcastCardUpdated({
          cardId,
          field: "coverImage",
          value: updatedCard.coverImage,
        });
      }

      setIsAdding(false);
    } catch (error) {
      console.error("Failed to update cover image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveCover = async () => {
    setIsUpdating(true);
    try {
      const updatedCard = await updateCard(cardId, {
        coverImage: undefined,
      });

      if (updatedCard) {
        setCoverImage(null);

        realtimeUtils.broadcastCardUpdated({
          cardId,
          field: "coverImage",
          value: null,
        });
      }
    } catch (error) {
      console.error("Failed to remove cover image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-5 bg-card border-border/60">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Cover Image</h3>
            {coverImage && (
              <Badge
                variant="secondary"
                className="rounded-full h-5 min-w-5 px-1.5"
              >
                1
              </Badge>
            )}
          </div>
          {!coverImage && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAdding(!isAdding)}
              className="h-8 hover:bg-primary/10 hover:text-primary"
              disabled={isUpdating}
            >
              {isAdding ? (
                <>
                  <X className="h-4 w-4 mr-1.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add
                </>
              )}
            </Button>
          )}
        </div>

        {isAdding && (
          <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors">
            <ImageAttachmentPicker
              onSelect={handleAddCover}
              disabled={isUpdating}
              mode="cover"
            />
          </div>
        )}

        {coverImage && (
          <div className="group relative rounded-lg overflow-hidden border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-border transition-all">
            <div className="relative w-full aspect-video">
              <Image
                src={coverImage}
                alt="Card cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsAdding(true)}
                  disabled={isUpdating}
                  className="h-8 shadow-lg hover:bg-primary/90 hover:text-primary-foreground"
                >
                  <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                  Change
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveCover}
                  disabled={isUpdating}
                  className="h-8 shadow-lg"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}

        {!coverImage && !isAdding && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/50 mb-3">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No cover image</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Add&quot; to set a cover image
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
