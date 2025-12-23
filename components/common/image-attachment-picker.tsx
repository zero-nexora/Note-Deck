"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type AttachmentInput = {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadThingKey: string;
  expiresAt?: Date | null;
};

type UnsplashImage = {
  id: string;
  urls: { regular: string; small?: string };
  alt_description: string;
  user?: {
    name: string;
  };
};

type Props = {
  onSelect: (attachment: AttachmentInput) => void;
  disabled?: boolean;
};

export function ImageAttachmentPicker({ onSelect, disabled }: Props) {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [selectedImage, setSelectedImage] = useState<AttachmentInput | null>(
    null
  );

  const fetchUnsplashImages = async () => {
    try {
      setLoadingUnsplash(true);

      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=9&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );

      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Unsplash error", err);
    } finally {
      setLoadingUnsplash(false);
    }
  };

  const handleUnsplashSelect = (img: UnsplashImage) => {
    const attachment = {
      fileName: img.alt_description ?? "unsplash-image",
      fileUrl: img.urls.regular,
      fileType: "image/jpeg",
      fileSize: 0,
      uploadThingKey: `unsplash_${img.id}`,
      expiresAt: null,
    };

    setSelectedImage(attachment);
    setImages([]); // Clear images after selection
    onSelect(attachment);
  };

  const handleUploadComplete = (res: any[]) => {
    const file = res[0];

    const attachment = {
      fileName: file.name,
      fileUrl: file.url,
      fileType: file.type,
      fileSize: file.size,
      uploadThingKey: file.key,
      expiresAt: null,
    };

    setSelectedImage(attachment);
    setImages([]); // Clear images after selection
    onSelect(attachment);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Selected Image Preview */}
      {selectedImage && (
        <Card className="border-primary/20 bg-card">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border">
                <Image
                  src={selectedImage.fileUrl}
                  alt={selectedImage.fileName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {selectedImage.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatFileSize(selectedImage.fileSize)}
                    </p>
                    <Badge variant="secondary" className="mt-1.5 text-xs">
                      Selected
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={handleRemoveImage}
                    disabled={disabled}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area - Only show when no image selected */}
      {!selectedImage && (
        <>
          <UploadButton
            endpoint="cardAttachments"
            disabled={disabled}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error) => {
              console.error(error);
            }}
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                Or choose from stock photos
              </span>
            </div>
          </div>

          {/* Unsplash Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-10"
            disabled={disabled || loadingUnsplash}
            onClick={fetchUnsplashImages}
          >
            {loadingUnsplash ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading images...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                Pick from Unsplash
              </>
            )}
          </Button>
        </>
      )}

      {/* Unsplash Images Grid */}
      {images.length > 0 && !selectedImage && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Choose from Unsplash
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setImages([])}
              className="h-7 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => handleUnsplashSelect(img)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <Image
                  src={img.urls.small || img.urls.regular}
                  alt={img.alt_description ?? "Unsplash image"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 33vw, 150px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-1.5">
                    {img.user && (
                      <p className="text-xs text-primary-foreground font-medium truncate">
                        by {img.user.name}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
