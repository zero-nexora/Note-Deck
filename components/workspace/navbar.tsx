"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  UserPlus,
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
import { useWorkspaceMember } from "@/hooks/use-workspace-member";
import { CreateWorkspaceMemberInput } from "@/domain/schemas/workspace-member.schema";
import { WorkspaceWithMember } from "@/domain/types/workspace.type";
import { UserSession } from "@/domain/types/user.type";
import { useState } from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { useForm } from "react-hook-form";
import {
  UpdateWorkspaceInput,
  UpdateWorkspaceSchema,
} from "@/domain/schemas/workspace.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface NavbarProps {
  notifications: any[];
  workspace: WorkspaceWithMember;
  user: UserSession;
}

export const Navbar = ({ notifications, workspace, user }: NavbarProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { inviteMember } = useWorkspaceMember();
  const { updateWorkspace } = useWorkspace();

  const form = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(UpdateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      plan: workspace.plan,
    },
  });

  const handleInviteMember = async () => {
    const input: CreateWorkspaceMemberInput = {
      userId: "f0f0a2d2-d7ab-4141-b7ee-3025252dc31d",
      workspaceId: workspace.id,
      role: "observer",
    };

    await inviteMember(input);
  };

  const handleSubmit = async (values: UpdateWorkspaceInput) => {
    await updateWorkspace(workspace.id, values);
    setIsEditing(false);
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 border-b border-border bg-background sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col leading-tight">
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoFocus
                          className="text-2xl font-bold h-auto py-1 px-2 border-primary/50 focus-visible:ring-primary"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <span className="font-semibold text-sm text-foreground" onDoubleClick={() => setIsEditing(true)}>
              {workspace.name}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {workspace.plan ?? "Free plan"}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Button variant="ghost" onClick={handleInviteMember}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center gradient-primary text-primary-foreground text-xs border-0">
                {notifications?.length ?? 0}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
              >
                Mark all read
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-border last:border-0 hover:bg-secondary/50 cursor-pointer transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2 shrink-0",
                          !notification.read ? "bg-primary" : "bg-transparent"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8 border-2 border-primary/20">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="cursor-pointer flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="cursor-pointer flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive focus:text-destructive flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
