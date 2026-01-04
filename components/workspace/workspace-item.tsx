import { Workspace } from "@/domain/types/workspace.type";
import { STRIPE_PLANS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function WorkspaceItem({ workspace }: { workspace: Workspace }) {
  const planLabel = STRIPE_PLANS[workspace.plan]?.name ?? "Free";

  return (
    <Link href={`/workspaces/${workspace.id}/overview`}>
      <div className="group relative p-6 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl font-bold text-primary">
              {workspace.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {workspace.name}
            </h3>
            <p className="text-sm text-muted-foreground">{planLabel} plan</p>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </div>
    </Link>
  );
}
