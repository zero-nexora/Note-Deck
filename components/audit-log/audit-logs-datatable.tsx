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
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: AuditLogWithUserWorkspacePagination["pagination"];
  workspaceId: string;
  initialFilters?: {
    search: string;
    action: string;
    entityType: string;
  };
}

export function AuditLogsDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  workspaceId,
  initialFilters,
}: DataTableProps<TData, TValue>) {
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
    initialFilters?.action ?? "all"
  );
  const [entityTypeFilter, setEntityTypeFilter] = useState(
    initialFilters?.entityType ?? "all"
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

  const updateUrlParams = (updates: Record<string, string | number>) => {
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
    if (searchValue) {
      table.getColumn("user")?.setFilterValue(searchValue);
    } else {
      table.getColumn("user")?.setFilterValue(undefined);
    }
  }, [searchValue, table]);

  useEffect(() => {
    if (actionFilter === "all") {
      table.getColumn("action")?.setFilterValue(undefined);
    } else {
      table.getColumn("action")?.setFilterValue(actionFilter);
    }
  }, [actionFilter, table]);

  useEffect(() => {
    if (entityTypeFilter === "all") {
      table.getColumn("entityType")?.setFilterValue(undefined);
    } else {
      table.getColumn("entityType")?.setFilterValue(entityTypeFilter);
    }
  }, [entityTypeFilter, table]);

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateUrlParams({ limit: newSize, page: 1 });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={isPending}
            className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-input border-border text-foreground focus:ring-ring disabled:opacity-50">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            <SelectItem
              value="all"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              All Actions
            </SelectItem>
            <SelectItem
              value="CREATE"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Create
            </SelectItem>
            <SelectItem
              value="UPDATE"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Update
            </SelectItem>
            <SelectItem
              value="DELETE"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Delete
            </SelectItem>
            <SelectItem
              value="READ"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Read
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={entityTypeFilter}
          onValueChange={setEntityTypeFilter}
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-input border-border text-foreground focus:ring-ring disabled:opacity-50">
            <SelectValue placeholder="Entity Type" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            <SelectItem
              value="all"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              All Types
            </SelectItem>
            <SelectItem
              value="USER"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              User
            </SelectItem>
            <SelectItem
              value="WORKSPACE"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Workspace
            </SelectItem>
            <SelectItem
              value="PROJECT"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Project
            </SelectItem>
            <SelectItem
              value="DOCUMENT"
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Document
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-muted/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading audit logs...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-border hover:bg-accent/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-base font-medium text-foreground">
                      No audit logs found.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{data.length}</span> of{" "}
          <span className="font-medium text-foreground">
            {pagination.total}
          </span>{" "}
          log(s)
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={`${pagination.limit}`}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
              disabled={isPending}
            >
              <SelectTrigger className="w-[70px] bg-input border-border text-foreground disabled:opacity-50">
                <SelectValue placeholder={pagination.limit} />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={!pagination.hasPrev || isPending}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || isPending}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || isPending}
              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={!pagination.hasNext || isPending}
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
