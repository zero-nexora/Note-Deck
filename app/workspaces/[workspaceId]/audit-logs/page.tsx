import { readAuditLogsAction } from "@/domain/actions/audit-log.action";
import { AuditLogWithUserWorkspacePagination } from "@/domain/types/audit-log.type";
import { AuditLogsDataTable } from "@/components/audit-log/audit-logs-datatable";
import { columns } from "@/components/audit-log/audit-logs-columns";
import { unwrapActionResult } from "@/lib/response";
import { ClipboardList } from "lucide-react";

interface AuditLogsPageProps {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const AuditLogsPage = async ({ params, searchParams }: AuditLogsPageProps) => {
  const { workspaceId } = await params;
  const {
    page: pageParam,
    limit: limitParam,
    search = "",
    action = "all",
    entityType = "all",
  } = await searchParams;

  const page = Number(pageParam ?? 1);
  const limit = Number(limitParam ?? 10);

  const auditLogs = unwrapActionResult<AuditLogWithUserWorkspacePagination>(
    await readAuditLogsAction({ workspaceId, page, limit }),
  );

  if (!auditLogs) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          Audit Logs
        </h1>
        <p className="text-muted-foreground">
          View a detailed history of actions and changes in your workspace
        </p>
      </div>

      <AuditLogsDataTable
        columns={columns}
        data={auditLogs.data}
        pagination={auditLogs.pagination}
        workspaceId={workspaceId}
        initialFilters={{ search, action, entityType }}
      />
    </div>
  );
};

export default AuditLogsPage;
