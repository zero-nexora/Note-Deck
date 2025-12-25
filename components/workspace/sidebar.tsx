"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Settings,
  Zap,
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
    { icon: Zap, label: "Automations", path: "automations" },
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
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      className="h-screen border-r flex flex-col"
    >
      {/* Collapse button */}

      {/* Workspace dropdown */}
      <div className="px-3 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
              {!collapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-display font-semibold text-foreground truncate">
                      {currentWorkspace?.name || "Select Workspace"}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {currentWorkspace?.plan} plan
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => handleWorkspaceChange(ws.id)}
                className={ws.id === workspaceId ? "bg-primary/10" : ""}
              >
                <span className="truncate">{ws.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/create-workspace")}>
              <Plus className="w-4 h-4 mr-2" />
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sidebar links */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          {!collapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Management
            </h3>
          )}
          <div className="space-y-1">
            {sidebarLinks.map((item) => {
              const href = `/workspaces/${workspaceId}/${item.path}`;
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary glow-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <Separator />

      {/* Profile */}
      <div className="p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
};
