"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AuditLogWithUserWorkspacePagination } from "@/domain/types/audit-log.type";

const getActionBadgeVariant = (action: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    CREATE: "default",
    UPDATE: "secondary",
    DELETE: "destructive",
    READ: "outline",
  };
  return variants[action.toUpperCase()] || "default";
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
        "user"
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
        id
      ) as AuditLogWithUserWorkspacePagination["data"][number]["user"];
      const searchValue = value.toLowerCase();
      return user.email
        ? user.email.toLowerCase().includes(searchValue)
        : user.name?.toLowerCase().includes(searchValue) ?? false;
    },

    accessorFn: (row) => `${row.user?.name ?? ""} ${row.user?.email ?? ""}`,
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
        <Badge variant={getActionBadgeVariant(action)} className="font-medium">
          {action.toUpperCase()}
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
          {entityType.toUpperCase()}
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
        "workspace"
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
