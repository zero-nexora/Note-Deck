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
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Cover Image
          </h3>
          {coverImage && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
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
            disabled={isUpdating}
            className="text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50"
          >
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </>
            )}
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="p-4 bg-muted/30">
          <ImageAttachmentPicker
            onSelect={handleAddCover}
            disabled={isUpdating}
            mode="cover"
          />
        </div>
      )}

      {coverImage && (
        <div className="p-4 space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
            <Image
              src={coverImage}
              alt="Card cover"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsAdding(true)}
              disabled={isUpdating}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Change
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveCover}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {!coverImage && !isAdding && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">No cover image</p>
          <p className="text-sm text-muted-foreground">
            Click &quot;Add&quot; to set a cover image
          </p>
        </div>
      )}
    </Card>
  );
};
