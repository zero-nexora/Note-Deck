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
import { Users, Shield, CheckCircle2, Sparkles } from "lucide-react";
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
      <div className="space-y-6 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                <Users className="h-4 w-4 text-primary" />
                Group Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Developers, Designers, Managers"
                  disabled={isLoading}
                  className="bg-background border-border focus-visible:ring-ring"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-sm">
                Choose a descriptive name for this user group
              </FormDescription>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <div className="space-y-3 p-4 rounded-lg bg-accent/50 border border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium text-foreground">
              Quick Setup
            </label>
          </div>
          <Select value={selectedPreset} onValueChange={applyPreset}>
            <SelectTrigger className="bg-background border-border hover:bg-accent focus:ring-ring">
              <SelectValue placeholder="Choose a preset or customize below" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {Object.entries(PERMISSION_PRESETS).map(([key, preset]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="hover:bg-accent focus:bg-accent cursor-pointer"
                >
                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-semibold text-foreground">
                      {preset.name}
                    </span>
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
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              {selectedPermissions.size} permission
              {selectedPermissions.size !== 1 ? "s" : ""} selected
            </span>
          </div>
        )}

        <div className="space-y-4">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Custom Permissions
          </label>

          <div className="space-y-3">
            {PERMISSION_CATEGORIES.map((category) => {
              const categoryPerms = getCategoryPermissions(category.id);
              const isSelected = isCategorySelected(category.id);
              const isPartial = isCategoryPartiallySelected(category.id);

              return (
                <div
                  key={category.id}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <category.icon className="h-5 w-5 text-primary" />
                      <div className="space-y-0.5">
                        <span className="font-medium text-foreground">
                          {category.label}
                        </span>
                        <span className="text-xs text-muted-foreground block">
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
                      className={
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {isSelected ? "All" : isPartial ? "Partial" : "None"}
                    </Badge>
                  </div>

                  <div className="border-t border-border bg-muted/30 divide-y divide-border">
                    {categoryPerms.map((permission) => (
                      <div
                        key={permission.id}
                        onClick={() => togglePermission(permission.id)}
                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          checked={selectedPermissions.has(permission.id)}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {permission.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
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
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border sticky bottom-0 bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isLoading}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={
              isLoading ||
              !form.getValues("name") ||
              selectedPermissions.size === 0
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loading />
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Create Group</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};
