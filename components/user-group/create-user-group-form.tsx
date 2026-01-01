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
import {
  PERMISSION_CATEGORIES,
  PERMISSION_PRESETS,
  PERMISSIONS,
} from "@/lib/permission";

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

        {selectedPermissions.size > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedPermissions.size} permission
              {selectedPermissions.size !== 1 ? "s" : ""} selected
            </span>
          </div>
        )}

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
