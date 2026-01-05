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
  CreditCard,
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
import { useConfirm } from "@/stores/confirm-store";
import { useStripe } from "@/hooks/use-stripe";

interface NavbarProps {
  notifications: NotificationWithUser[];
  workspace: WorkspaceWithMember;
  user: UserSession;
}

export const Navbar = ({ notifications, workspace, user }: NavbarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateNameWorkspace } = useWorkspace();
  const { markAsRead, markAllAsRead } = useNotification();
  const { open } = useConfirm();
  const { openCustomerPortal } = useStripe();

  const form = useForm<UpdateWorkspaceNameInput>({
    resolver: zodResolver(UpdateWorkspaceNameSchema),
    defaultValues: { name: workspace.name },
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

  const handleSignOut = () => {
    open({
      title: "Sign out",
      description: "Are you sure you want to sign out?",
      onConfirm: () => signOut(),
    });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-6">
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
                        disabled={isLoading}
                        className="h-9 w-[200px] bg-background border-border focus-visible:ring-ring"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            form.handleSubmit(handleSubmit)();
                          }
                          if (e.key === "Escape") handleCancel();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Form>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit"
              className="h-9 px-3 font-semibold text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {workspace.name}
            </Button>
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground font-normal"
            >
              {workspace.plan ?? "Free plan"}
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            onClick={() => openCustomerPortal(workspace.id)}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Manage Billing
          </Button>

          <WorkspaceInviteMember workspaceId={workspace.id} />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-primary text-primary-foreground px-1 text-xs">
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[380px] bg-popover text-popover-foreground border-border p-0"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-0"
                    >
                      {notifications.length}
                    </Badge>
                  )}
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                    <p className="font-medium text-foreground mb-1">
                      No notifications yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll notify you when something happens
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead({ id: notification.id })}
                        className="p-4 cursor-pointer hover:bg-accent transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-sm text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.createdAt.toLocaleString()}
                          </p>
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
                className="h-9 gap-2 px-2 hover:bg-accent"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-60 bg-popover border-border"
            >
              <DropdownMenuLabel className="p-0">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                <Link
                  href={`/workspaces/${workspace.id}/settings`}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                <Link
                  href={`/workspaces/${workspace.id}/settings`}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
