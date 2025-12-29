import { useState, useEffect } from "react";
import { Paperclip, Plus, X, Download, Trash2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttachment } from "@/hooks/use-attachment";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  AttachmentInput,
  ImageAttachmentPicker,
} from "../common/image-attachment-picker";
import Image from "next/image";

interface BoardCardItemAttachmentsProps {
  cardId: string;
  attachments: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["attachments"];
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
      setAttachments((prev) => [...prev, newAttachment]);
    }

    setIsAdding(false);
  };

  const handleDeleteAttachment = async (id: string) => {
    await deleteAttachment({ id });
    setAttachments((prev) => prev.filter((a) => a.id !== id));
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
    return <File className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="p-5 bg-card border-border/60">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Paperclip className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Attachments</h3>
            {attachments.length > 0 && (
              <Badge variant="secondary" className="rounded-full h-5 min-w-5 px-1.5">
                {attachments.length}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(!isAdding)}
            className="h-8 hover:bg-primary/10 hover:text-primary"
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
        </div>

        {/* Upload Area */}
        {isAdding && (
          <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors">
            <ImageAttachmentPicker
              onSelect={handleAddAttachment}
              disabled={false}
            />
          </div>
        )}

        {/* Attachments Grid */}
        {attachments.length > 0 && (
          <div className="grid gap-3">
            {attachments.map((attachment) => {
              const isImage = attachment.fileType.startsWith("image/");
              
              return (
                <div
                  key={attachment.id}
                  className="group relative flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-border transition-all"
                >
                  {/* Preview/Icon */}
                  <div className="shrink-0">
                    {isImage ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-border/60 bg-background">
                        <Image
                          src={attachment.fileUrl}
                          alt={attachment.fileName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-14 w-14 rounded-md bg-primary/10 border border-primary/20">
                        {getFileIcon(attachment.fileType)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">
                      {attachment.fileName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.fileSize)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {attachment.fileType.split("/")[1] || "file"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => window.open(attachment.fileUrl, "_blank")}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteAttachment(attachment.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {attachments.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/50 mb-3">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No attachments yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Addto&quot; upload files
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};