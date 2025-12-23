import { Workspace } from "@/domain/types/workspace.type";
import { STRIPE_PLANS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function WorkspaceItem({ workspace }: { workspace: Workspace }) {
  const planLabel = STRIPE_PLANS[workspace.plan]?.name ?? "Free";

  return (
    <Link
      href={`/workspaces/${workspace.id}/overview`}
      className="w-full glass-card p-4 flex items-center gap-4 card-hover group"
    >
      <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 text-lg font-bold text-primary">
        {workspace.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 text-left">
        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
          {workspace.name}
        </h3>

        <p className="text-sm text-muted-foreground">{planLabel} plan</p>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
