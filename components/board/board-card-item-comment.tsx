import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageSquare,
  Reply,
  Edit2,
  Trash2,
  Check,
  Smile,
} from "lucide-react";
import { useComment } from "@/hooks/use-comment";
import { useCommentReaction } from "@/hooks/use-comment-reaction";
import { format } from "date-fns";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";

interface BoardCardItemCommentsProps {
  cardId: string;
  comments: NonNullable<CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers>["comments"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItemComments = ({
  cardId,
  comments: initialComments = [],
  realtimeUtils,
}: BoardCardItemCommentsProps) => {
  const [comments, setComments] = useState(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);

  const { createComment, updateComment, deleteComment } = useComment();
  const { addReaction, removeReaction } = useCommentReaction();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleAddMainComment = async () => {
    if (!newComment.trim()) return;

    const createdComment = await createComment({
      cardId,
      content: newComment.trim(),
    });

    if (createdComment) {
      setComments((prev) => [
        ...prev,
        { ...createdComment, reactions: [], replies: [] },
      ]);

      realtimeUtils.broadcastCommentAdded({
        cardId,
        commentId: createdComment.id,
      });
    }

    setNewComment("");
  };

  const handleAddReply = async (parentId: string) => {
    const text = replyTexts[parentId]?.trim();
    if (!text) return;

    const createdReply = await createComment({
      cardId,
      content: text,
      parentId,
    });

    if (createdReply) {
      setComments((prev) => [
        ...prev,
        { ...createdReply, reactions: [], replies: [] },
      ]);

      realtimeUtils.broadcastCommentAdded({
        cardId,
        commentId: createdReply.id,
      });
    }

    setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
    setReplyingTo(null);
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditText(content);
  };

  const handleUpdateComment = async (id: string) => {
    if (!editText.trim()) return;

    const updated = await updateComment(id, { content: editText.trim() });

    if (updated) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content: editText.trim() } : c))
      );

      realtimeUtils.broadcastCardUpdated({
        cardId,
        field: "coverImage",
        value: "comment_updated",
      });
    }

    setEditingId(null);
    setEditText("");
  };

  const handleDeleteComment = async (id: string) => {
    await deleteComment({ id });
    setComments((prev) => prev.filter((c) => c.id !== id));

    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage",
      value: "comment_deleted",
    });
  };

  const handleToggleReaction = async (commentId: string, emoji: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const existing = comment.reactions?.find((r) => r.emoji === emoji);

    if (existing) {
      await removeReaction({ commentId, emoji });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                reactions: c.reactions?.filter((r) => r.emoji !== emoji) || [],
              }
            : c
        )
      );
    } else {
      const newReaction = await addReaction({ commentId, emoji });
      if (newReaction) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  reactions: [
                    ...(c.reactions || []),
                    { ...newReaction, emoji },
                  ],
                }
              : c
          )
        );
      }
    }

    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage",
      value: "reaction_toggled",
    });

    setPickerOpenFor(null);
  };

  const groupReactions = (reactions: any[] = []) => {
    const grouped = new Map<string, any[]>();
    reactions.forEach((r) => {
      if (!grouped.has(r.emoji)) {
        grouped.set(r.emoji, []);
      }
      grouped.get(r.emoji)?.push(r);
    });
    return Array.from(grouped.entries()).map(([emoji, reactionList]) => ({
      emoji,
      count: reactionList.length,
      users: reactionList.map((r) => r.user.name || "Unknown"),
    }));
  };

  const parentComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  const renderComment = (comment: any, isReply = false) => (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-background">
        <AvatarImage src={comment.user.image ?? undefined} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {comment.user.name?.[0] ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">
            {comment.user.name ?? "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(comment.createdAt), "MMM d, h:mm a")}
          </span>
        </div>

        {editingId === comment.id ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              className="min-h-20 resize-none text-sm bg-input border-border text-foreground focus-visible:ring-ring"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleUpdateComment(comment.id)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setEditText("");
                }}
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-lg bg-secondary/40 text-sm text-foreground whitespace-pre-wrap wrap-break-word">
              {comment.content}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <TooltipProvider delayDuration={200}>
                {groupReactions(comment.reactions).map(
                  ({ emoji, count, users }) => (
                    <Tooltip key={emoji}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs border-border hover:bg-primary/10 hover:border-primary/50"
                          onClick={() =>
                            handleToggleReaction(comment.id, emoji)
                          }
                        >
                          {emoji}{" "}
                          {count > 1 && (
                            <span className="ml-1 text-muted-foreground">
                              {count}
                            </span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs bg-popover text-popover-foreground border-border shadow-lg"
                      >
                        <div className="text-xs">
                          {users.slice(0, 5).join(", ")}
                          {users.length > 5 && ` and ${users.length - 5} more`}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
              </TooltipProvider>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() =>
                    setPickerOpenFor(
                      pickerOpenFor === comment.id ? null : comment.id
                    )
                  }
                >
                  <Smile className="h-3.5 w-3.5" />
                </Button>

                {pickerOpenFor === comment.id && (
                  <div className="absolute z-50 mt-1 left-0">
                    <Picker
                      data={data}
                      onEmojiSelect={(e: any) =>
                        handleToggleReaction(comment.id, e.native)
                      }
                      theme="auto"
                    />
                  </div>
                )}
              </div>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <Reply className="h-3.5 w-3.5 mr-1" />
                  Reply
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => handleStartEdit(comment.id, comment.content)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Card className="px-5 bg-card border-border">
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Comments</h3>
          {comments.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground rounded-full"
            >
              {comments.length}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {parentComments.map((comment) => {
            const replies = getReplies(comment.id);

            return (
              <div key={comment.id} className="space-y-3">
                {renderComment(comment)}

                {replies.length > 0 && (
                  <div className="ml-11 pl-4 border-l-2 border-border space-y-3">
                    {replies.map((reply) => (
                      <div key={reply.id}>{renderComment(reply, true)}</div>
                    ))}
                  </div>
                )}

                {replyingTo === comment.id && (
                  <div className="ml-11 pl-4 border-l-2 border-primary/50">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Write a reply..."
                        className="min-h-20 resize-none flex-1 text-sm bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                        value={replyTexts[comment.id] || ""}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({
                            ...prev,
                            [comment.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddReply(comment.id);
                          }
                          if (e.key === "Escape") {
                            setReplyingTo(null);
                            setReplyTexts((prev) => ({
                              ...prev,
                              [comment.id]: "",
                            }));
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Send
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyTexts((prev) => ({
                              ...prev,
                              [comment.id]: "",
                            }));
                          }}
                          className="border-border hover:bg-accent hover:text-accent-foreground"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Start the conversation!
          </p>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex gap-3">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-24 resize-none flex-1 text-sm bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddMainComment();
                }
              }}
            />
            <Button
              onClick={handleAddMainComment}
              className="self-end bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!newComment.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
