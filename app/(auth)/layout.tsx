import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/workspaces");
  }

  return <div className="min-h-screen">{children}</div>;
};

export default AuthLayout;
