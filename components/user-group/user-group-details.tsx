import { UserGroupWithMembers } from "@/domain/types/user-group.type";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { useUserGroup } from "@/hooks/use-user-group";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserGroupInput,
  UpdateUserGroupSchema,
} from "@/domain/schemas/user-group.schema";
import { useModal } from "@/stores/modal-store";
import {
  Form,
  FormControl,
  FormDescription,
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
  Users,
  Shield,
  CheckCircle2,
  Trash2,
  UserPlus,
  UserMinus,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { PERMISSION_CATEGORIES, PERMISSIONS } from "@/lib/permission";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserGroupMember } from "@/hooks/use-user-group-member";
import { useConfirm } from "@/stores/confirm-store";

interface UserGroupDetailsProps {
  userGroup: UserGroupWithMembers;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const UserGroupDetails = ({
  userGroup: initialUserGroup,
  workspaceMembers,
}: UserGroupDetailsProps) => {
  const { close } = useModal();
  const { updateUserGroup, deleteUserGroup } = useUserGroup();
  const { addUserGroupMember, removeUserGroupMember } = useUserGroupMember();
  const { open } = useConfirm();

  const [userGroup, setUserGroup] = useState(initialUserGroup);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(
      Object.entries(userGroup.permissions as Record<string, boolean>)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    )
  );
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  const form = useForm({
    resolver: zodResolver(UpdateUserGroupSchema),
    defaultValues: {
      name: userGroup.name,
      permissions: userGroup.permissions,
    },
  });

  const handleSubmit = async (values: UpdateUserGroupInput) => {
    const permissionsObject = Array.from(selectedPermissions).reduce(
      (acc, permission) => {
        acc[permission] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    const result = await updateUserGroup(userGroup.id, {
      ...values,
      permissions: permissionsObject,
    });

    if (result) {
      setUserGroup({
        ...userGroup,
        name: result.name,
        permissions: result.permissions,
      });
      setIsEditing(false);
      form.reset({ name: result.name, permissions: result.permissions });
    }
  };

  const handleDelete = async () => {
    open({
      title: "Delete User Group",
      description:
        "Are you sure you want to delete this user group? This action cannot be undone.",
      onConfirm: async () => {
        await deleteUserGroup({ id: userGroup.id });
        close();
      },
    });
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    setIsAddingMember(true);
    const result = await addUserGroupMember({
      groupId: userGroup.id,
      userId: selectedUserId,
    });

    if (result) {
      const addedUser = workspaceMembers.find(
        (m) => m.userId === selectedUserId
      );
      if (addedUser) {
        setUserGroup({
          ...userGroup,
          members: [
            ...userGroup.members,
            {
              id: result.id,
              userId: result.userId,
              groupId: result.groupId,
              user: addedUser.user,
            },
          ],
        });
      }
      setSelectedUserId("");
    }
    setIsAddingMember(false);
  };

  const handleRemoveMember = async (userId: string) => {
    await removeUserGroupMember({
      groupId: userGroup.id,
      userId,
    });

    setUserGroup({
      ...userGroup,
      members: userGroup.members.filter((m) => m.userId !== userId),
    });
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
    (wm) => !userGroup.members.some((m) => m.userId === wm.userId)
  );

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {userGroup.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {userGroup.members.length} member
                {userGroup.members.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete()}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isLoading || !form.getValues("name")}
                >
                  {isLoading ? <Loading /> : <Save className="h-4 w-4 mr-2" />}
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                    setSelectedPermissions(
                      new Set(
                        Object.entries(
                          userGroup.permissions as Record<string, boolean>
                        )
                          .filter(([_, value]) => value)
                          .map(([key]) => key)
                      )
                    );
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
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
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <label className="text-sm font-semibold text-foreground">
                Members ({userGroup.members.length})
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={availableMembers.length === 0}
            >
              <SelectTrigger className="h-10 flex-1">
                <SelectValue placeholder="Select a member to add" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.user.image || ""} />
                        <AvatarFallback className="text-xs">
                          {member.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.user.name || member.user.email}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {member.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddMember}
              disabled={!selectedUserId || isAddingMember}
              className="h-10"
            >
              {isAddingMember ? (
                <Loading />
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            {userGroup.members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No members in this group yet</p>
              </div>
            ) : (
              userGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.image || ""} />
                      <AvatarFallback>
                        {member.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {member.user.name || "Unnamed User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.user.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.userId)}
                    disabled={isLoading}
                  >
                    <UserMinus className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <label className="text-sm font-semibold text-foreground">
              Permissions {!isEditing && "(View Only)"}
            </label>
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
                    className={`flex items-center justify-between ${
                      isEditing ? "cursor-pointer group" : ""
                    }`}
                    onClick={() => isEditing && toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-2.5">
                      {isEditing && (
                        <Checkbox
                          checked={isSelected}
                          className={isPartial ? "opacity-50" : ""}
                        />
                      )}
                      <category.icon />
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

                  <div className={`${isEditing ? "pl-11" : ""} space-y-2 pt-2`}>
                    {categoryPerms.map((permission) => (
                      <div
                        key={permission.id}
                        className={`flex items-start gap-3 p-2 rounded-md ${
                          isEditing
                            ? "hover:bg-secondary/50 cursor-pointer"
                            : ""
                        } transition-colors`}
                        onClick={() =>
                          isEditing && togglePermission(permission.id)
                        }
                      >
                        {isEditing && (
                          <Checkbox
                            checked={selectedPermissions.has(permission.id)}
                            className="mt-0.5"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!isEditing &&
                              selectedPermissions.has(permission.id) && (
                                <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                              )}
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {permission.name}
                            </p>
                          </div>
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
        </div>

        {!isEditing && (
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              className="flex-1 h-10"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
};
