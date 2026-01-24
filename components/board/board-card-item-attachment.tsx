import { useState, useEffect } from "react";
import { Paperclip, Plus, X, Download, Trash2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttachment } from "@/hooks/use-attachment";
import {
  AttachmentInput,
  ImageAttachmentPicker,
} from "../common/image-attachment-picker";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

interface BoardCardItemAttachmentsProps {
  cardId: string;
  attachments: NonNullable<CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers>["attachments"];
}

export const BoardCardItemAttachments = ({
  cardId,
  attachments: initialAttachments = [],
}: BoardCardItemAttachmentsProps) => {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [isAdding, setIsAdding] = useState(false);

  const { uploadAttachment, deleteAttachment } = useAttachment();

  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);

  const handleAddAttachment = async (attachmentInput: AttachmentInput) => {
    const newAttachment = await uploadAttachment({
      cardId,
      ...attachmentInput,
      expiresAt: undefined,
    });

    if (newAttachment) {
      setAttachments((prev) => [...prev, { ...newAttachment }]);
    }

    setIsAdding(false);
  };

  const handleDeleteAttachment = async (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));

    await deleteAttachment({ id });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return null;
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        new Date(date).getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Paperclip className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Attachments
          </h3>
          {attachments.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              {attachments.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsAdding(!isAdding)}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
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
      </div>

      {isAdding && (
        <div className="p-4 bg-muted/30">
          <ImageAttachmentPicker
            onSelect={handleAddAttachment}
            disabled={false}
          />
        </div>
      )}

      {attachments.length > 0 && (
        <div className="p-4 space-y-3">
          {attachments.map((attachment) => {
            const isImage = attachment.fileType.startsWith("image/");

            return (
              <div
                key={attachment.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
              >
                <div className="shrink-0">
                  {isImage ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={attachment.fileUrl}
                        alt={attachment.fileName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                      {getFileIcon(attachment.fileType)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate mb-1">
                    {attachment.fileName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{formatFileSize(attachment.fileSize)}</span>
                    <span>•</span>
                    <span className="uppercase">
                      {attachment.fileType.split("/")[1] || "file"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(attachment.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {attachment.user.image ? (
                      <div className="relative w-5 h-5 rounded-full overflow-hidden">
                        <Image
                          src={attachment.user.image}
                          alt={attachment.user.name || "User"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-medium text-primary">
                          {getUserInitials(attachment.user.name)}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {attachment.user.name ||
                        attachment.user.email ||
                        "Unknown user"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(attachment.fileUrl, "_blank")}
                    title="Download"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    title="Delete"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {attachments.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
            <Paperclip className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">No attachments yet</p>
          <p className="text-sm text-muted-foreground">
            Click &quot;Add&quot; to upload files
          </p>
        </div>
      )}
    </Card>
  );
};

export const BoardCardItemAttachmentsSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="p-4 space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-lg border border-border"
          >
            <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
