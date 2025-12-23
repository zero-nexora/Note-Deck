"use client";

import { Plus } from "lucide-react";
import { UserGroupCard } from "./user-group-card";

interface UserGroupsListProps {
  userGroups: any[];
}

export const UserGroupsList = ({ userGroups }: UserGroupsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userGroups.map((group) => (
        <UserGroupCard key={group.id} group={group} />
      ))}

      <button className="h-full min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 flex flex-col items-center justify-center gap-3 transition-all group">
        <div className="w-12 h-12 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
          <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          Create new group
        </span>
      </button>
    </div>
  );
};
