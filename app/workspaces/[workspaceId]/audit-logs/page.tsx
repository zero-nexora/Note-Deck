import { readAuditLogsAction } from "@/app/actions/audit-log.action";
import { AuditLogWithUserWorkspacePagination } from "@/domain/types/audit-log.type";
import { AuditLogsDataTable } from "@/components/audit-log/audit-logs-datatable";
import { columns } from "@/components/audit-log/audit-logs-columns";

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

  const result = await readAuditLogsAction({
    workspaceId,
    page,
    limit,
  });

  if (!result.success) return null;

  const auditLogs = result.data as AuditLogWithUserWorkspacePagination;

  return (
    <AuditLogsDataTable
      columns={columns}
      data={auditLogs.data}
      pagination={auditLogs.pagination}
      workspaceId={workspaceId}
      initialFilters={{
        search,
        action,
        entityType,
      }}
    />
  );
};

export default AuditLogsPage;
