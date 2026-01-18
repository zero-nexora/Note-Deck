"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";
import { WorkspaceWithMember } from "@/domain/types/workspace.type";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { sidebarLinks } from "@/lib/constants";

interface SidebarProps {
  workspaces: WorkspaceWithMember[];
  workspaceId: string;
}

export const Sidebar = ({ workspaces, workspaceId }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentWorkspace = workspaces.find((ws) => ws.id === workspaceId);

  const isActive = (path: string) => {
    const fullPath = `/workspaces/${workspaceId}/${path}`;
    return pathname === fullPath || pathname.startsWith(fullPath + "/");
  };

  const handleWorkspaceChange = (id: string) => {
    router.push(`/workspaces/${id}/overview`);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="relative border-r bg-card border-border flex flex-col h-screen"
    >
      <div className="p-4 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left">
              {collapsed ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  <span className="text-lg">
                    {currentWorkspace?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                    <span className="text-lg">
                      {currentWorkspace?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {currentWorkspace?.name || "Select Workspace"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentWorkspace?.plan} plan
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-60 bg-popover border-border"
          >
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Your Workspaces
            </div>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => handleWorkspaceChange(ws.id)}
                className={`cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                  ws.id === workspaceId
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-sm mr-2">
                  <span>{ws.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-xs text-muted-foreground flex flex-col">
                  <span className="text-foreground font-medium">{ws.name}</span>
                  {ws?.plan} plan
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => router.push("/workspaces")}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create new workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Workspace
          </div>
        )}
        {sidebarLinks.map((item) => {
          const href = `/workspaces/${workspaceId}/${item.path}`;
          const active = isActive(item.path);

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${
                  active
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <div className={collapsed ? "" : "shrink-0"}>
                <item.icon className="h-5 w-5" />
              </div>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-border" />

      <div className="p-4">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
};
