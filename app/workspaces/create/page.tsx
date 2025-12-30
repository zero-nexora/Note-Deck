import { CreateWorkspaceForm } from "@/components/workspace/create-workspace-form";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const CreateWorkspacePage = async () => {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return <div className="h-full flex items-center justify-center"><CreateWorkspaceForm /></div>;
};

export default CreateWorkspacePage;
