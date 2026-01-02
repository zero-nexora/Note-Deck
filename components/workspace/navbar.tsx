"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../common/theme-toggle";
import { WorkspaceWithMember } from "@/domain/types/workspace.type";
import { UserSession } from "@/domain/types/user.type";
import { useState } from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  UpdateWorkspaceNameInput,
  UpdateWorkspaceNameSchema,
} from "@/domain/schemas/workspace.schema";
import { WorkspaceInviteMember } from "./workspace-invite-member";
import { signOut } from "next-auth/react";
import { NotificationWithUser } from "@/domain/types/notification.type";
import { useNotification } from "@/hooks/use-notification";

interface NavbarProps {
  notifications: NotificationWithUser[];
  workspace: WorkspaceWithMember;
  user: UserSession;
}

export const Navbar = ({ notifications, workspace, user }: NavbarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateNameWorkspace } = useWorkspace();
  const {markAsRead, markAllAsRead, deleteNotification} = useNotification();

  const form = useForm<UpdateWorkspaceNameInput>({
    resolver: zodResolver(UpdateWorkspaceNameSchema),
    defaultValues: {
      name: workspace.name,
    },
  });

  const handleSubmit = async (values: UpdateWorkspaceNameInput) => {
    await updateNameWorkspace(workspace.id, values);
    setIsEditing(false);
    form.reset();
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({ name: workspace.name });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-full h-20 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <Form {...form}>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        className="h-9 font-semibold border-primary/50 focus-visible:ring-primary"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            form.handleSubmit(handleSubmit)();
                          }
                          if (e.key === "Escape") {
                            handleCancel();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Form>
        ) : (
          <div className="flex flex-col leading-tight">
            <Button
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors text-left"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit"
              variant={"ghost"}
            >
              {workspace.name}
            </Button>
            <span className="text-xs text-muted-foreground">
              {workspace.plan ?? "Free plan"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <WorkspaceInviteMember workspaceId={workspace.id} />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Bell className="w-5 h-5" />
              {notifications?.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-primary text-primary-foreground text-xs border-2 border-background">
                  {notifications.length > 99 ? "99+" : notifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {notifications?.length > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {notifications.length}
                  </Badge>
                )}
              </div>
              {notifications?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-primary hover:bg-primary/10"
                  onClick={() => markAllAsRead()}
                >
                  Mark all read
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                    <Bell className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    No notifications yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll notify you when something happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-secondary/50 cursor-pointer transition-colors group",
                        !notification.isRead && "bg-primary/5"
                      )}
                      onClick={() => markAsRead({id: notification.id})}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2 shrink-0 transition-colors",
                            !notification.isRead
                              ? "bg-primary"
                              : "bg-transparent group-hover:bg-border"
                          )}
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-semibold text-sm text-foreground leading-tight">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 h-9 hover:bg-secondary"
            >
              <Avatar className="w-8 h-8 border-2 border-border">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-border">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="cursor-pointer flex items-center gap-3 px-3 py-2"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary">
                  <User className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Profile</span>
                  <span className="text-xs text-muted-foreground">
                    Manage your account
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="cursor-pointer flex items-center gap-3 px-3 py-2"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary">
                  <Settings className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Settings</span>
                  <span className="text-xs text-muted-foreground">
                    Configure preferences
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary">
                <HelpCircle className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Help & Support</span>
                <span className="text-xs text-muted-foreground">
                  Get assistance
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-3 px-3 py-2 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-destructive/10">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
