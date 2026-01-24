"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditLogWithUserWorkspacePagination } from "@/domain/types/audit-log.type";

export const ENTITY_TYPE = {
  WORKSPACE: "workspace",
  WORKSPACE_INVITE: "workspace_invite",
  WORKSPACE_MEMBER: "workspace_member",
  USER_GROUP: "user_group",
  BOARD: "board",
  LIST: "list",
  CARD: "card",
  LABEL: "label",
  CHECKLIST: "checlist",
  CHECKLIST_ITEM: "checlist_item",
  COMMENT: "comment",
  ATTACHMENT: "attachment",
  USER: "user",
} as const;

export const AUDIT_ACTION = {
  WORKSPACE_CREATED: "workspace.created",
  WORKSPACE_NAME_UPDATED: "workspace.name_updated",
  WORKSPACE_PLAN_CHANGE: "workspace.plan_changed",
  WORKSPACE_DELETED: "workspace.deleted",
  WORKSPACE_OWNERSHIP_TRANSFERRED: "workspace.ownership_transferred",
  WORKSPACE_MEMBER_ADDED: "workspace.member_added",
  WORKSPACE_MEMBER_REMOVED: "workspace.member_removed",
  WORKSPACE_MEMBER_ROLE_CHANGED: "workspace.member_role_changed",
  WORKSPACE_MEMBER_LEFT: "workspace.member_left",
  WORKSPACE_INVITE_CREATED: "workspace_invite.created",
  WORKSPACE_INVITE_RESENT: "workspace_invite.resent",
  WORKSPACE_INVITE_REVOKED: "workspace_invite.revoked",
  WORKSPACE_INVITE_ACCEPTED: "workspace_invite.accepted",
  WORKSPACE_INVITE_EXPIRED: "workspace_invite.expired",
  USER_GROUP_CREATED: "user_group.created",
  USER_GROUP_UPDATED: "user_group.updated",
  USER_GROUP_DELETED: "user_group.deleted",
  USER_GROUP_MEMBER_ADDED: "user_group.member_added",
  USER_GROUP_MEMBER_REMOVED: "user_group.member_removed",
  BOARD_CREATED: "board.created",
  BOARD_UPDATED: "board.updated",
  BOARD_ARCHIVED: "board.archived",
  BOARD_RESTORED: "board.restored",
  BOARD_DELETED: "board.deleted",
  BOARD_MEMBER_ADDED: "board.member_added",
  BOARD_MEMBER_REMOVED: "board.member_removed",
  BOARD_MEMBER_ROLE_CHANGED: "board.member_role_changed",
  LIST_CREATED: "list.created",
  LIST_UPDATED: "list.updated",
  LISTS_REORDERED: "lists.reordered",
  LIST_MOVED: "list.moved",
  LIST_ARCHIVED: "list.archived",
  LIST_RESTORED: "list.restored",
  LIST_DELETED: "list.deleted",
  LIST_DUPLICATED: "list.duplicated",
  CARD_CREATED: "card.created",
  CARD_UPDATED: "card.updated",
  CARD_MOVED: "card.moved",
  CARD_ARCHIVED: "card.archived",
  CARD_RESTORED: "card.restored",
  CARD_DELETED: "card.deleted",
  CARD_LABEL_ADDED: "card.label_added",
  CARD_LABEL_REMOVED: "card.label_removed",
  CARD_COMMENTED: "card.commented",
  CARD_DUPLICATED: "card.duplicated",
  CARD_MEMBER_ADDED: "card.member_added",
  CARD_MEMBER_REMOVED: "card.member_removed",
  LABEL_CREATED: "label.created",
  LABEL_UPDATED: "label.updated",
  LABEL_DELETED: "label.deleted",
  COMMENT_CREATED: "comment.created",
  COMMENT_UPDATED: "comment.updated",
  COMMENT_DELETED: "comment.deleted",
  COMMENT_REACTION_ADDED: "comment.reaction_added",
  COMMENT_REACTION_REMOVED: "comment.reaction_removed",
} as const;

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination: AuditLogWithUserWorkspacePagination["pagination"];
  workspaceId: string;
  initialFilters?: {
    search: string;
    action: string;
    entityType: string;
  };
  isLoading?: boolean;
}

const PAGE_SIZES = [10, 20, 30, 40, 50, 100];

const AuditLogsTableSkeleton = ({ columns }: { columns: number }) => (
  <TableBody>
    {Array.from({ length: 10 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

const getActionOptions = () => {
  const actions = Object.values(AUDIT_ACTION);
  const grouped: Record<string, string[]> = {};

  actions.forEach((action) => {
    const category = action.split(".")[0];
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(action);
  });

  return grouped;
};

const getEntityTypeOptions = () => Object.values(ENTITY_TYPE);

const formatActionLabel = (action: string) =>
  action
    .split(".")
    .map((part) =>
      part
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" - ");

const formatEntityType = (entityType: string) =>
  entityType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function AuditLogsDataTable<TData>({
  columns,
  data,
  pagination,
  workspaceId,
  initialFilters,
  isLoading = false,
}: DataTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [searchValue, setSearchValue] = useState(initialFilters?.search ?? "");
  const [actionFilter, setActionFilter] = useState(
    initialFilters?.action ?? "all",
  );
  const [entityTypeFilter, setEntityTypeFilter] = useState(
    initialFilters?.entityType ?? "all",
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
  });

  const updateUrlParams = (
    updates: Record<string, string | number | null | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === "" ||
        value === "all" ||
        value === null ||
        value === undefined
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`/workspaces/${workspaceId}/audit-logs?${params.toString()}`);
    });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateUrlParams({ limit: newSize, page: 1 });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlParams({ search: searchValue, page: 1 });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    updateUrlParams({ action: actionFilter, page: 1 });
  }, [actionFilter]);

  useEffect(() => {
    updateUrlParams({ entityType: entityTypeFilter, page: 1 });
  }, [entityTypeFilter]);

  useEffect(() => {
    table.getColumn("user")?.setFilterValue(searchValue || undefined);
  }, [searchValue, table]);

  useEffect(() => {
    table
      .getColumn("action")
      ?.setFilterValue(actionFilter === "all" ? undefined : actionFilter);
  }, [actionFilter, table]);

  useEffect(() => {
    table
      .getColumn("entityType")
      ?.setFilterValue(
        entityTypeFilter === "all" ? undefined : entityTypeFilter,
      );
  }, [entityTypeFilter, table]);

  const actionGroups = getActionOptions();
  const entityTypes = getEntityTypeOptions();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={isPending || isLoading}
            className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
          disabled={isPending || isLoading}
        >
          <SelectTrigger className="w-48 bg-input border-border text-foreground">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(actionGroups).map(([category, actions]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {category.replace("_", " ")}
                </div>
                {actions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {formatActionLabel(action)}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={entityTypeFilter}
          onValueChange={setEntityTypeFilter}
          disabled={isPending || isLoading}
        >
          <SelectTrigger className="w-48 bg-input border-border text-foreground">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {formatEntityType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <AuditLogsTableSkeleton columns={columns.length} />
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <p className="text-sm font-medium">
                        No audit logs found.
                      </p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{data.length}</span> of{" "}
          <span className="font-medium text-foreground">
            {pagination.total}
          </span>{" "}
          log(s)
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={String(pagination.limit)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
              disabled={isPending || isLoading}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Page{" "}
              <span className="font-medium text-foreground">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {pagination.totalPages}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={!pagination.hasPrev || isPending || isLoading}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || isPending || isLoading}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || isPending || isLoading}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={!pagination.hasNext || isPending || isLoading}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
