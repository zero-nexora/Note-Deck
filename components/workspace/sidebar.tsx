"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ChevronDown,
  Plus,
} from "lucide-react";
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

interface SidebarProps {
  workspaces: WorkspaceWithMember[];
  workspaceId: string;
}

export const Sidebar = ({ workspaces, workspaceId }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentWorkspace = workspaces.find((ws) => ws.id === workspaceId);

  const sidebarLinks = [
    { icon: LayoutGrid, label: "Overview", path: "overview" },
    { icon: FileText, label: "Audit Logs", path: "audit-logs" },
    { icon: Users, label: "User Groups", path: "user-groups" },
    { icon: Clipboard, label: "Boards", path: "boards" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

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
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen bg-background border-r border-border/50 flex flex-col relative shadow-sm"
    >
      <div className="p-4 border-b border-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/80 transition-all duration-200 group">
              {collapsed ? (
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {currentWorkspace?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {currentWorkspace?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {currentWorkspace?.name || "Select Workspace"}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize mt-0.5">
                      {currentWorkspace?.plan} plan
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Your Workspaces
            </div>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => handleWorkspaceChange(ws.id)}
                className={`cursor-pointer ${
                  ws.id === workspaceId ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-primary">
                    {ws.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="truncate font-medium">{ws.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/workspaces")}
              className="cursor-pointer text-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create new workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
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
                className="block"
              >
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${
                      active ? "drop-shadow-sm" : ""
                    }`}
                  />
                  {!collapsed && (
                    <span
                      className={`font-medium text-sm ${
                        active ? "font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      <Separator />

      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-10 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </div>
          )}
        </Button>
      </div>
    </motion.aside>
  );
};
