import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = async ({ children }: WorkspaceLayoutProps) => {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return <div className="h-full w-full overflow-hidden">{children}</div>;
};

export default WorkspaceLayout;
