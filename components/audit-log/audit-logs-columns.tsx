"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AuditLogWithUserWorkspacePagination } from "@/domain/types/audit-log.type";

const getActionBadgeColor = (action: string) => {
  // Workspace actions
  if (action.startsWith("workspace.")) {
    if (action.includes("deleted")) return "destructive";
    if (action.includes("created")) return "default";
    return "secondary";
  }

  // Member actions
  if (action.includes("member")) {
    if (action.includes("removed") || action.includes("left"))
      return "destructive";
    if (action.includes("added")) return "default";
    return "secondary";
  }

  // Invite actions
  if (action.includes("invite")) {
    if (action.includes("revoked") || action.includes("expired"))
      return "destructive";
    if (action.includes("created") || action.includes("accepted"))
      return "default";
    return "outline";
  }

  // Board/List/Card actions
  if (
    action.startsWith("board.") ||
    action.startsWith("list.") ||
    action.startsWith("card.")
  ) {
    if (action.includes("deleted")) return "destructive";
    if (action.includes("created")) return "default";
    if (action.includes("archived")) return "outline";
    return "secondary";
  }

  // Comment/Reaction actions
  if (action.includes("comment") || action.includes("reaction")) {
    if (action.includes("removed") || action.includes("deleted"))
      return "destructive";
    return "default";
  }

  return "outline";
};

const formatActionLabel = (action: string) => {
  return action
    .split(".")
    .map((part) =>
      part
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" - ");
};

const formatEntityType = (entityType: string) => {
  return entityType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const columns: ColumnDef<
  AuditLogWithUserWorkspacePagination["data"][number]
>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            {format(new Date(date), "PPP")}
          </span>
          <span className="block text-xs text-muted-foreground">
            {format(new Date(date), "p")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue(
        "user",
      ) as AuditLogWithUserWorkspacePagination["data"][number]["user"];
      return (
        <div className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            {user.name || "Unknown"}
          </span>
          <span className="block text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const user = row.getValue(
        id,
      ) as AuditLogWithUserWorkspacePagination["data"][number]["user"];
      const searchValue = value.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(searchValue) ?? false;
      const emailMatch =
        user.email?.toLowerCase().includes(searchValue) ?? false;
      return nameMatch || emailMatch;
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          Action
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return (
        <Badge variant={getActionBadgeColor(action)} className="font-medium">
          {formatActionLabel(action)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
    cell: ({ row }) => {
      const entityType = row.getValue("entityType") as string;
      return (
        <Badge
          variant="outline"
          className="bg-muted text-foreground border-border"
        >
          {formatEntityType(entityType)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => {
      const ipAddress = row.getValue("ipAddress") as string | null;
      return (
        <span className="text-sm text-muted-foreground font-mono">
          {ipAddress || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "workspace",
    header: "Workspace",
    cell: ({ row }) => {
      const workspace = row.getValue(
        "workspace",
      ) as AuditLogWithUserWorkspacePagination["data"][number]["workspace"];
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {workspace.name}
          </span>
          <Badge
            variant="outline"
            className="text-xs bg-primary/10 text-primary border-primary/20"
          >
            {workspace.plan}
          </Badge>
        </div>
      );
    },
  },
];
