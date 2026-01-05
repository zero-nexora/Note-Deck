import { AutomationDetails } from "@/domain/types/automation.type";
import { useAutomation } from "@/hooks/use-automation";
import { useModal } from "@/stores/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Zap, Plus, Trash2, ArrowRight, Sparkles } from "lucide-react";
import {
  AUTOMATION_ACTIONS,
  AUTOMATION_TRIGGERS,
  TriggerOption,
  ACTION_CATEGORIES,
  TRIGGER_CATEGORIES,
} from "@/lib/automation";
import { useState, useEffect } from "react";
import { LabelDetail } from "@/domain/types/label.type";
import { BoardWithUser } from "@/domain/types/board-member.type";
import {
  UpdateAutomationInput,
  UpdateAutomationSchema,
} from "@/domain/schemas/automation.schema";

interface UpdateAutomationFormProps {
  automation: AutomationDetails;
  boardMembers: BoardWithUser[];
  labels: LabelDetail[];
}

export const UpdateAutomationForm = ({
  automation,
  boardMembers,
  labels,
}: UpdateAutomationFormProps) => {
  const { updateAutomation } = useAutomation();
  const { close } = useModal();
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerOption | null>(
    null
  );

  const form = useForm<UpdateAutomationInput>({
    resolver: zodResolver(UpdateAutomationSchema),
    defaultValues: {
      name: automation.name,
      trigger: automation.trigger as any,
      actions: automation.actions as any,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "actions",
  });

  useEffect(() => {
    const triggerData = automation.trigger as { type?: string };
    if (triggerData?.type) {
      const trigger = AUTOMATION_TRIGGERS.find(
        (t) => t.id === triggerData.type
      );
      if (trigger) {
        setSelectedTrigger(trigger);
      }
    }
  }, [automation.trigger]);

  const handleSubmit = async (values: UpdateAutomationInput) => {
    await updateAutomation(automation.id, values);
    form.reset();
    close();
  };

  const handleTriggerSelect = (triggerId: string) => {
    const trigger = AUTOMATION_TRIGGERS.find((t) => t.id === triggerId);
    if (trigger) {
      setSelectedTrigger(trigger);
      form.setValue("trigger", { type: triggerId } as any);
    }
  };

  const handleAddAction = () => {
    append({ type: "" } as any);
  };

  const getDynamicOptions = (actionType: string, fieldName: string) => {
    if (fieldName === "userId") {
      return boardMembers.map((member) => ({
        label: member.user.name || member.user.email || "Unknown User",
        value: member.userId,
      }));
    }

    if (fieldName === "labelId") {
      return labels.map((label) => ({
        label: label.name,
        value: label.id,
      }));
    }

    return [];
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-h-[70vh] overflow-y-auto px-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Automation Name
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  {...field}
                  placeholder="e.g., Auto-assign new cards to team lead"
                  className="bg-background border-border focus-visible:ring-ring"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-sm">
                Give your automation a descriptive name
              </FormDescription>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              When this happens...
            </h3>
          </div>

          <FormField
            control={form.control}
            name="trigger.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Select Trigger
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleTriggerSelect(value);
                  }}
                  value={field.value || ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-border hover:bg-accent focus:ring-ring">
                      <SelectValue placeholder="Choose a trigger event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border max-h-[300px]">
                    {TRIGGER_CATEGORIES.map((category) => {
                      const categoryTriggers = AUTOMATION_TRIGGERS.filter(
                        (t) => t.category === category.id
                      );
                      if (categoryTriggers.length === 0) return null;

                      return (
                        <div key={category.id}>
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                            {category.label}
                          </div>
                          {categoryTriggers.map((trigger) => {
                            const Icon = trigger.icon;
                            return (
                              <SelectItem
                                key={trigger.id}
                                value={trigger.id}
                                className="hover:bg-accent focus:bg-accent cursor-pointer"
                              >
                                <div className="flex items-start gap-3 py-2">
                                  <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <div className="space-y-1">
                                    <div className="font-medium text-foreground">
                                      {trigger.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {trigger.description}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </div>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {selectedTrigger?.fields && selectedTrigger.fields.length > 0 && (
            <Card className="border-border bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">
                  Trigger Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTrigger.fields.map((field) => {
                  const dynamicOptions =
                    field.name === "userId"
                      ? boardMembers.map((member) => ({
                          label:
                            member.user.name ||
                            member.user.email ||
                            "Unknown User",
                          value: member.userId,
                        }))
                      : field.name === "labelId"
                      ? labels.map((label) => ({
                          label: label.name,
                          value: label.id,
                        }))
                      : field.options || [];

                  return (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={`trigger.${field.name}` as any}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            {field.label}
                            {field.required && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </FormLabel>
                          <FormControl>
                            {field.type === "select" ? (
                              <Select
                                onValueChange={formField.onChange}
                                value={
                                  formField.value
                                    ? String(formField.value)
                                    : undefined
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger className="bg-background border-border hover:bg-accent focus:ring-ring">
                                  <SelectValue
                                    placeholder={field.placeholder}
                                  />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  {dynamicOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                      className="hover:bg-accent focus:bg-accent cursor-pointer"
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === "number" ? (
                              <Input
                                type="number"
                                placeholder={field.placeholder}
                                disabled={isLoading}
                                {...formField}
                                value={formField.value ?? ""}
                                onChange={(e) =>
                                  formField.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                  )
                                }
                                className="bg-background border-border focus-visible:ring-ring"
                              />
                            ) : (
                              <Input
                                type="text"
                                placeholder={field.placeholder}
                                disabled={isLoading}
                                {...formField}
                                value={formField.value ?? ""}
                                className="bg-background border-border focus-visible:ring-ring"
                              />
                            )}
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Do this...
            </h3>
          </div>

          {fields.length === 0 && (
            <Card className="border-2 border-dashed border-border bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No actions added yet. Add an action to complete your
                  automation.
                </p>
              </CardContent>
            </Card>
          )}

          {fields.map((field, index) => {
            const actionType = form.watch(`actions.${index}.type`) as string;
            const actionOption = AUTOMATION_ACTIONS.find(
              (a) => a.id === actionType
            );
            const Icon = actionOption?.icon;

            return (
              <Card key={field.id} className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                      {Icon && <Icon className="h-4 w-4 text-primary" />}
                      Action {index + 1}:{" "}
                      {actionOption?.name || "Select Action"}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {actionOption && (
                    <CardDescription className="text-xs text-muted-foreground">
                      {actionOption.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`actions.${index}.type`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Action Type
                        </FormLabel>
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value ? String(formField.value) : ""}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background border-border hover:bg-accent focus:ring-ring">
                              <SelectValue placeholder="Choose an action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-border max-h-[300px]">
                            {ACTION_CATEGORIES.map((category) => {
                              const categoryActions = AUTOMATION_ACTIONS.filter(
                                (a) => a.category === category.id
                              );
                              if (categoryActions.length === 0) return null;

                              return (
                                <div key={category.id}>
                                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                                    {category.label}
                                  </div>
                                  {categoryActions.map((action) => {
                                    const ActionIcon = action.icon;
                                    return (
                                      <SelectItem
                                        key={action.id}
                                        value={action.id}
                                        className="hover:bg-accent focus:bg-accent cursor-pointer"
                                      >
                                        <div className="flex items-start gap-3 py-2">
                                          <ActionIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                          <div className="space-y-1">
                                            <div className="font-medium text-foreground">
                                              {action.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {action.description}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  {actionOption?.fields?.map((actionField) => {
                    const dynamicOptions = getDynamicOptions(
                      actionType,
                      actionField.name
                    );

                    const fieldOptions =
                      dynamicOptions.length > 0
                        ? dynamicOptions
                        : actionField.options || [];

                    return (
                      <FormField
                        key={actionField.name}
                        control={form.control}
                        name={`actions.${index}.${actionField.name}` as any}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {actionField.label}
                              {actionField.required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              {actionField.type === "select" ? (
                                <Select
                                  onValueChange={formField.onChange}
                                  value={
                                    formField.value
                                      ? String(formField.value)
                                      : undefined
                                  }
                                  disabled={isLoading}
                                >
                                  <SelectTrigger className="bg-background border-border hover:bg-accent focus:ring-ring">
                                    <SelectValue
                                      placeholder={actionField.placeholder}
                                    />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border-border">
                                    {fieldOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="hover:bg-accent focus:bg-accent cursor-pointer"
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : actionField.type === "textarea" ? (
                                <Textarea
                                  placeholder={actionField.placeholder}
                                  disabled={isLoading}
                                  {...formField}
                                  value={formField.value ?? ""}
                                  className="min-h-20 bg-background border-border focus-visible:ring-ring"
                                />
                              ) : actionField.type === "number" ? (
                                <Input
                                  type="number"
                                  placeholder={actionField.placeholder}
                                  disabled={isLoading}
                                  {...formField}
                                  value={formField.value ?? ""}
                                  onChange={(e) =>
                                    formField.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    )
                                  }
                                  className="bg-background border-border focus-visible:ring-ring"
                                />
                              ) : (
                                <Input
                                  type="text"
                                  placeholder={actionField.placeholder}
                                  disabled={isLoading}
                                  {...formField}
                                  value={formField.value ?? ""}
                                  className="bg-background border-border focus-visible:ring-ring"
                                />
                              )}
                            </FormControl>
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}

          <Button
            type="button"
            variant="outline"
            className="w-full border-border hover:bg-accent hover:text-accent-foreground"
            onClick={handleAddAction}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </div>

        <Separator className="bg-border" />

        <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-0 bg-background">
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
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {isLoading ? "Updating..." : "Update Automation"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
