import {
  acceptInviteAction,
  revokeInviteAction,
} from "@/app/actions/workspace-invite.action";
import { notFound, redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{ token: string; action: string }>;
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const { token, action } = await params;

  if (action === "accept") {
    const result = await acceptInviteAction({ token });
    if (!result.success) {
      redirect("/");
    }
    if (result.success) {
      redirect(`/workspaces/${result.data?.workspaceId}`);
    }
  }

  if (action === "revoke") {
    const result = await revokeInviteAction({ token });
    if (result.success) {
      redirect("/");
    }
  }

  notFound();
};

export default InvitePage;
