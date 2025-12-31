import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { useUserGroup } from "@/hooks/use-user-group";
import { useUserGroupMember } from "@/hooks/use-user-group-member";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
import {
  Users,
  Shield,
  CheckCircle2,
  Pencil,
  Trash2,
  UserPlus,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";
import {
  PERMISSIONS,
  PERMISSION_CATEGORIES,
  PERMISSION_PRESETS,
} from "./create-user-group-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  UpdateUserGroupInput,
  UpdateUserGroupSchema,
} from "@/domain/schemas/user-group.schema";
import { useModal } from "@/stores/modal-store";

interface UserGroupDetailsProps {
  userGroup: UserGroupWithMembers;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const UserGroupDetails = ({
  userGroup: initialUserGroup,
  workspaceMembers,
}: UserGroupDetailsProps) => {
  const {close} = useModal();

  const { updateUserGroup, deleteUserGroup } = useUserGroup();
  const { addMember, removeMember } = useUserGroupMember();

  const [userGroup, setUserGroup] = useState(initialUserGroup);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(
      Object.entries(userGroup.permissions as Record<string, boolean>)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    )
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedUserIdToAdd, setSelectedUserIdToAdd] = useState<string>("");
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(UpdateUserGroupSchema),
    defaultValues: {
      name: userGroup.name,
      permissions: userGroup.permissions,
    },
  });

  const handleSubmit = async (values: UpdateUserGroupInput) => {
    const result = await updateUserGroup(userGroup.id, values);
    if (result) {
      setUserGroup({ ...userGroup, name: result.name });
    }
    setIsEditingName(false);
    form.reset({ name: result?.name });
  };

  const handleUpdatePermissions = async () => {
    const permissionsObject = Array.from(selectedPermissions).reduce(
      (acc, permission) => {
        acc[permission] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    const result = await updateUserGroup(userGroup.id, {
      permissions: permissionsObject,
    });
    if (result) {
      setUserGroup({ ...userGroup, permissions: result.permissions });
    }
    setIsEditingPermissions(false);
  };

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    await deleteUserGroup({ id: userGroup.id });
    setIsDeleting(false);
    close();
  };

  const handleAddMember = async () => {
    if (!selectedUserIdToAdd) return;

    const result = await addMember({
      groupId: userGroup.id,
      userId: selectedUserIdToAdd,
    });
    if (result) {
      const newMember = workspaceMembers.find(
        (m) => m.userId === selectedUserIdToAdd
      );
      if (newMember) {
        setUserGroup({
          ...userGroup,
          members: [
            ...userGroup.members,
            {
              id: result.id,
              userId: result.userId,
              groupId: result.groupId,
              user: newMember.user,
            },
          ],
        });
      }
    }
    setSelectedUserIdToAdd("");
    setIsAddingMember(false);
  };

  const handleRemoveMember = async (userId: string) => {
    setRemovingMemberId(userId);
    await removeMember({ groupId: userGroup.id, userId });
    setUserGroup({
      ...userGroup,
      members: userGroup.members.filter((m) => m.userId !== userId),
    });
    setRemovingMemberId(null);
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

  const availableMembers = workspaceMembers.filter(
    (member) => !userGroup.members.some((m) => m.userId === member.userId)
  );

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Group Information
            </h3>
          </div>
        </div>

        {isEditingName ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter group name"
                        className="h-10"
                        disabled={isLoading}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  type="submit"
                  disabled={isLoading}
                  className="h-9"
                >
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsEditingName(false);
                    form.reset();
                  }}
                  disabled={isLoading}
                  className="h-9"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div
            className="group flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
            onClick={() => setIsEditingName(true)}
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {userGroup.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {userGroup.members.length} member
                {userGroup.members.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Members</h3>
              <Badge variant="secondary">{userGroup.members.length}</Badge>
            </div>

            {isAddingMember ? (
              <div className="flex flex-col gap-3 w-full mt-4">
                <Select
                  value={selectedUserIdToAdd}
                  onValueChange={setSelectedUserIdToAdd}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select a member to add">
                      {selectedUserIdToAdd &&
                        (() => {
                          const member = availableMembers.find(
                            (m) => m.userId === selectedUserIdToAdd
                          );
                          if (!member) return null;
                          return (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={member.user.image || undefined}
                                />
                                <AvatarFallback className="text-xs">
                                  {member.user.name?.charAt(0).toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">
                                  {member.user.name || "Unknown"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {member.user.email}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No available members
                      </div>
                    ) : (
                      availableMembers.map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={member.user.image || undefined}
                              />
                              <AvatarFallback className="text-xs">
                                {member.user.name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {member.user.name || "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {member.user.email}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    onClick={handleAddMember}
                    disabled={!selectedUserIdToAdd}
                    className="h-9 px-4"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingMember(false);
                      setSelectedUserIdToAdd("");
                    }}
                    className="h-9 w-9 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsAddingMember(true)}
                disabled={availableMembers.length === 0}
                className="h-9"
              >
                <UserPlus className="h-4 w-4 mr-1" /> Add Member
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {userGroup.members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No members in this group yet
            </div>
          ) : (
            userGroup.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {member.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {member.user.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveMember(member.userId)}
                  disabled={removingMemberId === member.userId}
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {removingMemberId === member.userId ? (
                    <Loading />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Permissions
            </h3>
          </div>
          {!isEditingPermissions && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingPermissions(true)}
              className="h-9"
            >
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>

        {isEditingPermissions ? (
          <div className="space-y-4">
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

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                onClick={handleUpdatePermissions}
                disabled={selectedPermissions.size === 0}
                className="h-10"
              >
                <Save className="h-4 w-4 mr-1" /> Save Permissions
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingPermissions(false);
                  setSelectedPermissions(
                    new Set(
                      Object.entries(
                        userGroup.permissions as Record<string, boolean>
                      )
                        .filter(([_, value]) => value)
                        .map(([key]) => key)
                    )
                  );
                  setSelectedPreset("");
                }}
                className="h-10"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedPermissions.size === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No permissions assigned
              </div>
            ) : (
              PERMISSION_CATEGORIES.map((category) => {
                const categoryPerms = getCategoryPermissions(
                  category.id
                ).filter((p) => selectedPermissions.has(p.id));

                if (categoryPerms.length === 0) return null;

                return (
                  <div
                    key={category.id}
                    className="p-3 rounded-lg border border-border bg-secondary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{category.icon}</span>
                      <span className="font-semibold text-sm text-foreground">
                        {category.label}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryPerms.length}
                      </Badge>
                    </div>
                    <div className="pl-7 space-y-1">
                      {categoryPerms.map((permission) => (
                        <div
                          key={permission.id}
                          className="text-xs text-muted-foreground"
                        >
                          • {permission.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive">
            Danger Zone
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting this group will remove all member associations. This action
          cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteGroup}
          disabled={isDeleting}
          className="h-10"
        >
          {isDeleting ? (
            <Loading />
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-1" /> Delete Group
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
