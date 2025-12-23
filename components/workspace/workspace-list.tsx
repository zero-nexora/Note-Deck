"use client";

import { Workspace } from "@/domain/types/workspace.type";
import { motion } from "framer-motion";
import { WorkspaceItem } from "./workspace-item";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      {workspaces.map((workspace) => (
        <WorkspaceItem
          key={workspace.id}
          workspace={workspace}
        />
      ))}
    </motion.div>
  );
}
