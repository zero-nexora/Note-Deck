import {
  CreateAutomationInput,
  CreateAutomationSchema,
} from "@/domain/schemas/automation.schema";
import { useAutomation } from "@/hooks/use-automation";
import { useModal } from "@/stores/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loading } from "../common/loading";
import { useState } from "react";
import { Zap, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { TriggerSelector } from "./automation-trigger-selector";
import { ActionSelector } from "./automation-action-selector";
import { ActionOption, AUTOMATION_ACTIONS, AUTOMATION_TRIGGERS, TriggerOption } from "@/lib/automation";

interface CreateAutomationFormProps {
  boardId: string;
}

export const CreateAutomationForm = ({
  boardId,
}: CreateAutomationFormProps) => {
  const { createAutomation } = useAutomation();
  const { close } = useModal();

  const [selectedTrigger, setSelectedTrigger] = useState<TriggerOption | null>(
    null
  );
  const [triggerData, setTriggerData] = useState<Record<string, any>>({});
  const [selectedActions, setSelectedActions] = useState<
    Array<{ action: ActionOption; data: Record<string, any> }>
  >([]);

  const form = useForm<CreateAutomationInput>({
    resolver: zodResolver(CreateAutomationSchema),
    defaultValues: {
      boardId,
      name: "",
      actions: [],
      trigger: {},
    },
  });

  const handleSubmit = async (values: CreateAutomationInput) => {
    if (!selectedTrigger) {
      return;
    }

    const trigger = {
      type: selectedTrigger.id,
      ...triggerData,
    };

    const actions = selectedActions.map((item) => ({
      type: item.action.id,
      ...item.data,
    }));

    await createAutomation({
      boardId,
      name: values.name,
      trigger,
      actions,
    });

    form.reset();
    close();
  };

  const handleAddAction = (action: ActionOption, data: Record<string, any>) => {
    setSelectedActions((prev) => [...prev, { action, data }]);
  };

  const handleRemoveAction = (index: number) => {
    setSelectedActions((prev) => prev.filter((_, i) => i !== index));
  };

  const isLoading = form.formState.isSubmitting;
  const canSubmit =
    form.watch("name") && selectedTrigger && selectedActions.length > 0;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Automation Name
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  {...field}
                  placeholder="e.g., Auto-assign new cards to team lead"
                  className="h-10"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Give your automation a descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="font-semibold text-foreground">When this happens</h3>
          </div>

          {selectedTrigger ? (
            <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedTrigger.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-foreground">
                      {selectedTrigger.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedTrigger.when}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    setSelectedTrigger(null);
                    setTriggerData({});
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {selectedTrigger.fields && selectedTrigger.fields.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-border">
                  {selectedTrigger.fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </label>
                      {field.type === "text" && (
                        <Input
                          value={triggerData[field.name] || ""}
                          onChange={(e) =>
                            setTriggerData((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          className="h-9"
                        />
                      )}
                      {field.type === "number" && (
                        <Input
                          type="number"
                          value={triggerData[field.name] || ""}
                          onChange={(e) =>
                            setTriggerData((prev) => ({
                              ...prev,
                              [field.name]: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder={field.placeholder}
                          className="h-9"
                        />
                      )}
                      {field.type === "select" && (
                        <select
                          value={triggerData[field.name] || ""}
                          onChange={(e) =>
                            setTriggerData((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                          className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm"
                        >
                          <option value="">
                            {field.placeholder || "Select..."}
                          </option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <TriggerSelector
              triggers={AUTOMATION_TRIGGERS}
              onSelect={(trigger) => setSelectedTrigger(trigger)}
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <span className="text-lg">🎯</span>
            </div>
            <h3 className="font-semibold text-foreground">Do these actions</h3>
            {selectedActions.length > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {selectedActions.length}
              </Badge>
            )}
          </div>

          {selectedActions.length > 0 && (
            <div className="space-y-2">
              {selectedActions.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border bg-secondary/20"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="shrink-0 font-semibold"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-xl">{item.action.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">
                          {item.action.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.action.then}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveAction(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {Object.keys(item.data).length > 0 && (
                    <div className="pt-3 border-t border-border text-xs space-y-1">
                      {Object.entries(item.data).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-muted-foreground font-medium">
                            {key}:
                          </span>
                          <span className="text-foreground">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <ActionSelector
            actions={AUTOMATION_ACTIONS}
            onSelect={handleAddAction}
          />
        </div>

        {!canSubmit && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-600 dark:text-amber-400">
              <p className="font-semibold mb-1">Complete the automation:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {!form.watch("name") && <li>Add an automation name</li>}
                {!selectedTrigger && <li>Select a trigger</li>}
                {selectedActions.length === 0 && (
                  <li>Add at least one action</li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading || !canSubmit}
            className="flex-1 h-10"
          >
            {isLoading ? <Loading /> : "Create Automation"}
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