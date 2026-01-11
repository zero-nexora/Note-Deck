"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

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

type ImageAttachmentPickerProps =
  | {
      mode: "cover";
      onSelect: (imageUrl: string) => void;
      disabled?: boolean;
    }
  | {
      mode?: "attachment";
      onSelect: (attachment: AttachmentInput) => void;
      disabled?: boolean;
    };

export function ImageAttachmentPicker(props: ImageAttachmentPickerProps) {
  const { onSelect, disabled, mode = "attachment" } = props;
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);

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
    if (mode === "cover") {
      setImages([]);
      (onSelect as (url: string) => void)(img.urls.regular);
    } else {
      const attachment: AttachmentInput = {
        fileName: img.alt_description ?? "unsplash-image",
        fileUrl: img.urls.regular,
        fileType: "image/jpeg",
        fileSize: 1,
        uploadThingKey: `unsplash_${img.id}`,
        expiresAt: null,
      };
      setImages([]);
      (onSelect as (attachment: AttachmentInput) => void)(attachment);
    }
  };

  const handleUploadComplete = (res: any) => {
    const file = res[0];

    if (mode === "cover") {
      setImages([]);
      (onSelect as (url: string) => void)(file.url);
    } else {
      const attachment: AttachmentInput = {
        fileName: file.name,
        fileUrl: file.url,
        fileType: file.type,
        fileSize: file.size,
        uploadThingKey: file.key,
        expiresAt: null,
      };
      setImages([]);
      (onSelect as (attachment: AttachmentInput) => void)(attachment);
    }
  };

  return (
    <div className="space-y-4 py-1">
      <UploadButton
        endpoint="cardAttachments"
        disabled={disabled}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error) => {
          console.error(error);
        }}
      />

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

      {images.length > 0 && (
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
