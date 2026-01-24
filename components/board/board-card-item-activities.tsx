import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  User,
  Tag,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

interface BoardCardItemActivitiesProps {
  activities: NonNullable<CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers>["activities"];
}

type ActivityItem = BoardCardItemActivitiesProps["activities"][number];

const getActivityIcon = (action: string, entityType: string) => {
  const iconClass = "h-4 w-4";

  if (action === "CREATE") {
    switch (entityType) {
      case "CARD":
        return <Plus className={iconClass} />;
      case "COMMENT":
        return <MessageSquare className={iconClass} />;
      case "CHECKLIST":
        return <CheckSquare className={iconClass} />;
      case "ATTACHMENT":
        return <Paperclip className={iconClass} />;
      case "LABEL":
        return <Tag className={iconClass} />;
      case "MEMBER":
        return <User className={iconClass} />;
      default:
        return <Plus className={iconClass} />;
    }
  }

  if (action === "UPDATE") {
    switch (entityType) {
      case "CARD":
        return <Edit className={iconClass} />;
      case "COVER_IMAGE":
        return <ImageIcon className={iconClass} />;
      case "DUE_DATE":
        return <Calendar className={iconClass} />;
      default:
        return <Edit className={iconClass} />;
    }
  }

  if (action === "DELETE") {
    return <Trash2 className={iconClass} />;
  }

  return <Activity className={iconClass} />;
};

const getActivityColor = (action: string) => {
  switch (action) {
    case "CREATE":
      return "text-primary";
    case "UPDATE":
      return "text-blue-600 dark:text-blue-400";
    case "DELETE":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

const getActivityBgColor = (action: string) => {
  switch (action) {
    case "CREATE":
      return "bg-primary/10";
    case "UPDATE":
      return "bg-blue-500/10";
    case "DELETE":
      return "bg-destructive/10";
    default:
      return "bg-muted";
  }
};

const formatActivityMessage = (activity: ActivityItem) => {
  const metadata = activity.metadata as any;
  const action = activity.action;
  const entityType = activity.entityType;

  let message = "";

  if (action === "CREATE") {
    switch (entityType) {
      case "CARD":
        message = "created this card";
        break;
      case "COMMENT":
        message = "added a comment";
        break;
      case "CHECKLIST":
        message = `added checklist "${metadata?.title || "Untitled"}"`;
        break;
      case "ATTACHMENT":
        message = `attached "${metadata?.fileName || "a file"}"`;
        break;
      case "LABEL":
        message = `added label "${metadata?.labelName || "a label"}"`;
        break;
      case "MEMBER":
        message = `assigned ${metadata?.memberName || "a member"}`;
        break;
      default:
        message = `created ${entityType.toLowerCase()}`;
    }
  } else if (action === "UPDATE") {
    switch (entityType) {
      case "CARD":
        if (metadata?.field === "title") {
          message = `changed title to "${metadata?.newValue}"`;
        } else if (metadata?.field === "description") {
          message = "updated the description";
        } else {
          message = "updated this card";
        }
        break;
      case "COVER_IMAGE":
        message = metadata?.newValue
          ? "set the cover image"
          : "removed the cover image";
        break;
      case "DUE_DATE":
        message = metadata?.newValue
          ? `set due date to ${format(new Date(metadata.newValue), "PPP")}`
          : "removed the due date";
        break;
      case "CHECKLIST_ITEM":
        message = metadata?.isCompleted
          ? `completed "${metadata?.itemText || "an item"}"`
          : `uncompleted "${metadata?.itemText || "an item"}"`;
        break;
      default:
        message = `updated ${entityType.toLowerCase()}`;
    }
  } else if (action === "DELETE") {
    switch (entityType) {
      case "COMMENT":
        message = "deleted a comment";
        break;
      case "CHECKLIST":
        message = `deleted checklist "${metadata?.title || "a checklist"}"`;
        break;
      case "ATTACHMENT":
        message = `removed attachment "${metadata?.fileName || "a file"}"`;
        break;
      case "LABEL":
        message = `removed label "${metadata?.labelName || "a label"}"`;
        break;
      case "MEMBER":
        message = `unassigned ${metadata?.memberName || "a member"}`;
        break;
      default:
        message = `deleted ${entityType.toLowerCase()}`;
    }
  }

  return message;
};

export const BoardCardItemActivities = ({
  activities,
}: BoardCardItemActivitiesProps) => {
  const [showAll, setShowAll] = useState(false);

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const displayActivities = showAll
    ? sortedActivities
    : sortedActivities.slice(0, 10);
  const hasMore = sortedActivities.length > 10;

  if (activities.length === 0) {
    return (
      <Card className="p-5 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Activity</h3>
          </div>

          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Activity</h3>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground rounded-full"
          >
            {activities.length}
          </Badge>
        </div>

        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />

          {displayActivities.map((activity) => {
            return (
              <div key={activity.id} className="relative flex gap-4">
                {/* Timeline dot with icon */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`
                      w-10 h-10 rounded-full border-2 border-background flex items-center justify-center
                      ${getActivityBgColor(activity.action)}
                      ${getActivityColor(activity.action)}
                    `}
                  >
                    {getActivityIcon(activity.action, activity.entityType)}
                  </div>
                </div>

                {/* Activity content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar className="h-6 w-6 ring-2 ring-background">
                      <AvatarImage src={activity.user.image ?? undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {activity.user.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-semibold text-sm text-foreground">
                          {activity.user.name ?? "Unknown User"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatActivityMessage(activity)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <time className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </time>
                        <span className="text-xs text-muted-foreground">•</span>
                        <time className="text-xs text-muted-foreground">
                          {format(
                            new Date(activity.createdAt),
                            "MMM d, h:mm a",
                          )}
                        </time>
                      </div>
                    </div>
                  </div>

                  {/* Optional metadata display */}
                  {activity.action === "UPDATE" &&
                    (activity.metadata as any)?.oldValue && (
                      <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">From:</span>
                            <span className="text-foreground line-through">
                              {(activity.metadata as any).oldValue}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">To:</span>
                            <span className="text-foreground font-medium">
                              {(activity.metadata as any).newValue}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {showAll
                ? "Show less"
                : `Show ${sortedActivities.length - 10} more activities`}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export const BoardCardItemActivitiesSkeleton = () => {
  return (
    <Card className="p-5 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>

        <div className="relative space-y-4">
          <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="relative flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0 z-10" />

              <div className="flex-1 pb-4">
                <div className="flex items-start gap-3 mb-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
