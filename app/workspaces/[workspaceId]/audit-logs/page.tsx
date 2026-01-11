import { readAuditLogsAction } from "@/domain/actions/audit-log.action";
import { AuditLogWithUserWorkspacePagination } from "@/domain/types/audit-log.type";
import { AuditLogsDataTable } from "@/components/audit-log/audit-logs-datatable";
import { columns } from "@/components/audit-log/audit-logs-columns";
import { unwrapActionResult } from "@/lib/response";

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
    await readAuditLogsAction({ workspaceId, page, limit })
  );

  if (!auditLogs) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
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
