"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { useForm } from "react-hook-form";
import {
  UpdateUserInput,
  UpdateUserSchema,
} from "@/domain/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { UserSession } from "@/domain/types/user.type";
import { Loading } from "../common/loading";
import { Camera, Save, X } from "lucide-react";
import { useModal } from "@/stores/modal-store";
import { ImageAttachmentPicker } from "../common/image-attachment-picker";

interface ProfileTabProps {
  user: UserSession;
}

export const ProfileTab = ({ user }: ProfileTabProps) => {
  const { updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { open, close } = useModal();

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: UpdateUserInput) => {
    await updateUser(user.id, values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSelect = (image: string) => {
    form.setValue("image", image);
    close();
  };

  const handleOpenChangeAvatar = () => {
    open({
      title: "Change Avatar",
      description: "Select a new avatar for your profile",
      children: (
        <ImageAttachmentPicker
          onSelect={(image: string) => handleSelect(image)}
          mode="cover"
        />
      ),
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-foreground">
              Profile Information
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your account details and preferences
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Edit Mode</span>
            <Switch
              checked={isEditing}
              onCheckedChange={setIsEditing}
              disabled={isLoading}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6 p-4 rounded-lg bg-muted/50 border border-border">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={form.getValues("image") || user.image || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {(user?.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!isEditing}
              className="border-border hover:bg-accent hover:text-accent-foreground"
              onClick={handleOpenChangeAvatar}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing || isLoading}
                        placeholder="Enter your name"
                        className="bg-background border-border focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={true}
                        placeholder="Enter your email"
                        className="bg-muted border-border text-muted-foreground cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loading />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
