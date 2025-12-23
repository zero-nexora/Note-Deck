"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const allPermissions = [
  {
    id: "manage_workspace",
    name: "Manage Workspace",
    description: "Edit workspace settings and billing",
  },
  {
    id: "manage_members",
    name: "Manage Members",
    description: "Invite and remove members",
  },
  {
    id: "manage_boards",
    name: "Manage Boards",
    description: "Create and delete boards",
  },
  {
    id: "manage_billing",
    name: "Manage Billing",
    description: "Access billing and subscription",
  },
  {
    id: "view_boards",
    name: "View Boards",
    description: "View all boards in workspace",
  },
  {
    id: "edit_cards",
    name: "Edit Cards",
    description: "Create, edit, and move cards",
  },
  { id: "comment", name: "Comment", description: "Add comments to cards" },
  {
    id: "upload_attachments",
    name: "Upload Attachments",
    description: "Upload files to cards",
  },
];

export const CreatUserGroup = () => {
  return (
    <Dialog open>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground shadow-glow flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          c<DialogTitle>Create User Group</DialogTitle>
          <DialogDescription>
            Define a new group with specific permissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Group Name</label>
            <Input />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Description
            </label>
            <Input />
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">
              Permissions
            </label>
            <div className="space-y-3">
              {allPermissions.map((p) => (
                <div key={p.id} className="flex items-start gap-3">
                  <Checkbox id={p.id} />
                  <div className="grid gap-0.5">
                    <label
                      htmlFor={p.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {p.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground">
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
