import {
  CreateUserGroupInput,
  CreateUserGroupSchema,
} from "@/domain/schemas/user-group.schema";
import { useUserGroup } from "@/hooks/use-user-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useModal } from "@/stores/modal-store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Loading } from "../common/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Users, Shield, CheckCircle2 } from "lucide-react";

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const PERMISSION_CATEGORIES = [
  { id: "workspace", label: "Workspace", icon: "🏢" },
  { id: "board", label: "Board", icon: "📋" },
  { id: "card", label: "Card", icon: "🎫" },
  { id: "member", label: "Member", icon: "👥" },
  { id: "admin", label: "Admin", icon: "⚙️" },
] as const;

export const PERMISSIONS: Permission[] = [
  {
    id: "workspace.view",
    name: "View Workspace",
    description: "Can view workspace and its boards",
    category: "workspace",
  },
  {
    id: "workspace.edit",
    name: "Edit Workspace",
    description: "Can edit workspace name and settings",
    category: "workspace",
  },
  {
    id: "workspace.delete",
    name: "Delete Workspace",
    description: "Can delete the entire workspace",
    category: "workspace",
  },
  {
    id: "workspace.settings",
    name: "Manage Settings",
    description: "Can manage workspace settings and integrations",
    category: "workspace",
  },
  {
    id: "board.create",
    name: "Create Board",
    description: "Can create new boards",
    category: "board",
  },
  {
    id: "board.view",
    name: "View Board",
    description: "Can view boards and their content",
    category: "board",
  },
  {
    id: "board.edit",
    name: "Edit Board",
    description: "Can edit board name, description, and settings",
    category: "board",
  },
  {
    id: "board.delete",
    name: "Delete Board",
    description: "Can delete boards",
    category: "board",
  },
  {
    id: "board.archive",
    name: "Archive Board",
    description: "Can archive/restore boards",
    category: "board",
  },
  {
    id: "card.create",
    name: "Create Card",
    description: "Can create new cards",
    category: "card",
  },
  {
    id: "card.view",
    name: "View Card",
    description: "Can view card details",
    category: "card",
  },
  {
    id: "card.edit",
    name: "Edit Card",
    description: "Can edit card title, description, and fields",
    category: "card",
  },
  {
    id: "card.delete",
    name: "Delete Card",
    description: "Can delete cards",
    category: "card",
  },
  {
    id: "card.move",
    name: "Move Card",
    description: "Can move cards between lists",
    category: "card",
  },
  {
    id: "card.assign",
    name: "Assign Members",
    description: "Can assign/unassign members to cards",
    category: "card",
  },
  {
    id: "card.label",
    name: "Manage Labels",
    description: "Can add/remove labels on cards",
    category: "card",
  },
  {
    id: "card.attachment",
    name: "Manage Attachments",
    description: "Can upload/delete attachments",
    category: "card",
  },
  {
    id: "card.checklist",
    name: "Manage Checklists",
    description: "Can create/edit/delete checklists",
    category: "card",
  },
  {
    id: "card.comment",
    name: "Comment",
    description: "Can add/edit/delete comments",
    category: "card",
  },
  {
    id: "member.invite",
    name: "Invite Members",
    description: "Can invite new members to workspace",
    category: "member",
  },
  {
    id: "member.remove",
    name: "Remove Members",
    description: "Can remove members from workspace",
    category: "member",
  },
  {
    id: "member.role",
    name: "Change Roles",
    description: "Can change member roles and permissions",
    category: "member",
  },
  {
    id: "admin.automation",
    name: "Manage Automations",
    description: "Can create/edit/delete automations",
    category: "admin",
  },
  {
    id: "admin.integration",
    name: "Manage Integrations",
    description: "Can manage third-party integrations",
    category: "admin",
  },
  {
    id: "admin.billing",
    name: "Manage Billing",
    description: "Can manage subscription and billing",
    category: "admin",
  },
  {
    id: "admin.audit",
    name: "View Audit Logs",
    description: "Can view audit logs and activity history",
    category: "admin",
  },
];

export const PERMISSION_PRESETS = {
  admin: {
    name: "Admin",
    description: "Full access to everything",
    permissions: PERMISSIONS.map((p) => p.id),
  },
  member: {
    name: "Member",
    description: "Can create and edit content",
    permissions: [
      "workspace.view",
      "board.create",
      "board.view",
      "board.edit",
      "card.create",
      "card.view",
      "card.edit",
      "card.move",
      "card.assign",
      "card.label",
      "card.attachment",
      "card.checklist",
      "card.comment",
    ],
  },
  observer: {
    name: "Observer",
    description: "View-only access",
    permissions: ["workspace.view", "board.view", "card.view", "card.comment"],
  },
  guest: {
    name: "Guest",
    description: "Limited access to specific boards",
    permissions: ["board.view", "card.view", "card.comment"],
  },
};

interface CreateUserGroupFormProps {
  workspaceId: string;
}

export const CreateUserGroupForm = ({
  workspaceId,
}: CreateUserGroupFormProps) => {
  const { createUserGroup } = useUserGroup();
  const { close } = useModal();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(CreateUserGroupSchema),
    defaultValues: {
      name: "",
      permissions: {},
      workspaceId,
    },
  });

  const handleSubmit = async (data: CreateUserGroupInput) => {
    const permissionsObject = Array.from(selectedPermissions).reduce(
      (acc, permission) => {
        acc[permission] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    await createUserGroup({
      ...data,
      permissions: permissionsObject,
    });
    close();
    form.reset();
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
    setSelectedPreset("");
  };

  const applyPreset = (presetKey: string) => {
    const preset =
      PERMISSION_PRESETS[presetKey as keyof typeof PERMISSION_PRESETS];
    if (preset) {
      setSelectedPermissions(new Set(preset.permissions));
      setSelectedPreset(presetKey);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const categoryPermissions = PERMISSIONS.filter(
      (p) => p.category === categoryId
    ).map((p) => p.id);

    const allSelected = categoryPermissions.every((id) =>
      selectedPermissions.has(id)
    );

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        categoryPermissions.forEach((id) => newSet.delete(id));
      } else {
        categoryPermissions.forEach((id) => newSet.add(id));
      }
      return newSet;
    });
    setSelectedPreset("");
  };

  const getCategoryPermissions = (categoryId: string) => {
    return PERMISSIONS.filter((p) => p.category === categoryId);
  };

  const isCategorySelected = (categoryId: string) => {
    const categoryPermissions = getCategoryPermissions(categoryId);
    return categoryPermissions.every((p) => selectedPermissions.has(p.id));
  };

  const isCategoryPartiallySelected = (categoryId: string) => {
    const categoryPermissions = getCategoryPermissions(categoryId);
    const selectedCount = categoryPermissions.filter((p) =>
      selectedPermissions.has(p.id)
    ).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Group Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Developers, Designers, Managers"
                  className="h-10"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Choose a descriptive name for this user group
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Permission Presets */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <label className="text-sm font-semibold text-foreground">
              Quick Setup
            </label>
          </div>
          <Select value={selectedPreset} onValueChange={applyPreset}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Choose a preset or customize below" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERMISSION_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {preset.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Count */}
        {selectedPermissions.size > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedPermissions.size} permission
              {selectedPermissions.size !== 1 ? "s" : ""} selected
            </span>
          </div>
        )}

        {/* Permissions by Category */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-foreground">
            Custom Permissions
          </label>

          {PERMISSION_CATEGORIES.map((category) => {
            const categoryPerms = getCategoryPermissions(category.id);
            const isSelected = isCategorySelected(category.id);
            const isPartial = isCategoryPartiallySelected(category.id);

            return (
              <div
                key={category.id}
                className="space-y-2 p-4 rounded-lg border border-border bg-secondary/20"
              >
                {/* Category Header */}
                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={isSelected}
                      className={isPartial ? "opacity-50" : ""}
                    />
                    <span className="text-lg">{category.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {category.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {
                          categoryPerms.filter((p) =>
                            selectedPermissions.has(p.id)
                          ).length
                        }{" "}
                        / {categoryPerms.length} selected
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {isSelected ? "All" : isPartial ? "Partial" : "None"}
                  </Badge>
                </div>

                {/* Category Permissions */}
                <div className="pl-11 space-y-2 pt-2">
                  {categoryPerms.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => togglePermission(permission.id)}
                    >
                      <Checkbox
                        checked={selectedPermissions.has(permission.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {permission.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={
              isLoading ||
              !form.getValues("name") ||
              selectedPermissions.size === 0
            }
            className="flex-1 h-10"
          >
            {isLoading ? <Loading /> : "Create Group"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isLoading}
            className="h-10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
};
