import {
  findWorkspacesByUserAction,
} from "@/app/actions/workspace.action";
import { Navbar } from "@/components/workspace/navbar";
import { Sidebar } from "@/components/workspace/sidebar";
import { Workspace } from "@/domain/types/workspace.type";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

interface WorkspaceDetailPageProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

const getCreatedAt = () => {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
};

const WorkspaceDetailLayout = async ({
  children,
  params,
}: WorkspaceDetailPageProps) => {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  const { workspaceId } = await params;

  if (!workspaceId) return redirect("/workspaces");

  const result = await findWorkspacesByUserAction();

  if (!result.success) return null;

  const mockNotifications = [
    {
      id: "n1",
      userId: "u1",
      type: "mention",
      title: "Marcus mentioned you",
      message: 'in "Setup project architecture"',
      read: false,
      createdAt: getCreatedAt(),
      link: "/workspace/w1/board/b1",
    },
    {
      id: "n2",
      userId: "u1",
      type: "assignment",
      title: "New card assigned",
      message: 'You were assigned to "Design system implementation"',
      read: false,
      createdAt: getCreatedAt(),
      link: "/workspace/w1/board/b1",
    },
    {
      id: "n3",
      userId: "u1",
      type: "due_date",
      title: "Due date approaching",
      message: '"User authentication flow" is due tomorrow',
      read: true,
      createdAt: getCreatedAt(),
      link: "/workspace/w1/board/b1",
    },
    {
      id: "n4",
      userId: "u1",
      type: "comment",
      title: "New comment",
      message: 'Emily commented on "Dashboard analytics"',
      read: true,
      createdAt: getCreatedAt(),
      link: "/workspace/w1/board/b1",
    },
  ];

  return (
    <div className="flex flex-1">
      <Sidebar
        workspaceId={workspaceId}
        workspaces={result.data as Workspace[]}
      />
      <div className="flex flex-1 flex-col">
        <Navbar notifications={mockNotifications} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default WorkspaceDetailLayout;
