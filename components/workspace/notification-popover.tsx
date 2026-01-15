"use client";

import { Bell, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationWithUser } from "@/domain/types/notification.type";
import { useConfirm } from "@/stores/confirm-store";
import { useNotification } from "@/hooks/use-notification";
import { ActionsMenu } from "@/components/common/actions-menu";

interface NotificationPopoverProps {
  notifications: NotificationWithUser[];
  onRead: (id: string) => void;
  onReadAll: () => void;
}

export const NotificationPopover = ({
  notifications,
  onRead,
  onReadAll,
}: NotificationPopoverProps) => {
  const { open } = useConfirm();
  const { deleteNotification } = useNotification();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full text-xs">
              {notifications.length > 99 ? "99+" : notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onReadAll}>
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-2 p-4 hover:bg-accent"
            >
              {/* Content */}
              <div
                onClick={() => onRead(n.id)}
                className="flex-1 cursor-pointer"
              >
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>

              {/* ActionsMenu */}
              <ActionsMenu
                actions={[
                  {
                    label: "Delete",
                    icon: Trash2,
                    variant: "destructive",
                    onClick: () =>
                      open({
                        title: "Delete notification",
                        description:
                          "Are you sure you want to delete this notification?",
                        variant: "destructive",
                        onConfirm: () => {
                          deleteNotification({ id: n.id });
                        },
                      }),
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
