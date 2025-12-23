"use client";

import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const triggerOptions = [
  "When a card is added to list",
  "When a card is moved to list",
  "When all checklist items are checked",
  "When due date is approaching",
  "When a label is added",
  "When a member is assigned",
];

const actionOptions = [
  "Move card to list",
  "Assign member",
  "Add label",
  "Send notification",
  "Set due date",
  "Archive card",
];

interface CreateAutomationDialogProps {
  onCreate: (data: { name: string; trigger: string; action: string }) => void;
}

export const CreateAutomationDialog: React.FC<CreateAutomationDialogProps> = ({
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [automation, setAutomation] = useState({
    name: "",
    trigger: "",
    action: "",
  });

  const handleCreate = () => {
    if (!automation.name || !automation.trigger || !automation.action) return;
    onCreate(automation);
    setAutomation({ name: "", trigger: "", action: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground shadow-glow flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Automation</DialogTitle>
          <DialogDescription>
            Set up a rule to automate your workflow
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Automation Name
            </label>
            <Input
              value={automation.name}
              onChange={(e) =>
                setAutomation({ ...automation, name: e.target.value })
              }
              placeholder="E.g., Move completed cards to Done"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div>
              <label className="text-sm font-medium mb-2 block">
                When this happens...
              </label>
              <Select
                value={automation.trigger}
                onValueChange={(v: any) =>
                  setAutomation({ ...automation, trigger: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground mt-6" />

            <div>
              <label className="text-sm font-medium mb-2 block">
                Then do this...
              </label>
              <Select
                value={automation.action}
                onValueChange={(v: any) =>
                  setAutomation({ ...automation, action: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full gradient-primary text-primary-foreground"
            onClick={handleCreate}
          >
            Create Automation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
