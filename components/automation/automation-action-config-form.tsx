import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loading } from "../common/loading";
import { ActionOption } from "@/lib/automation";

interface ActionConfigFormProps {
  action: ActionOption;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

export const ActionConfigForm = ({
  action,
  onSubmit,
  onCancel,
}: ActionConfigFormProps) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  const canSubmit = action.fields?.every((field) => {
    if (field.required) {
      return data[field.name] && data[field.name].toString().trim() !== "";
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {action.fields?.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>

          {field.type === "text" && (
            <Input
              value={data[field.name] || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              placeholder={field.placeholder}
              className="h-10"
            />
          )}

          {field.type === "number" && (
            <Input
              type="number"
              value={data[field.name] || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  [field.name]: parseInt(e.target.value) || 0,
                }))
              }
              placeholder={field.placeholder}
              className="h-10"
            />
          )}

          {field.type === "textarea" && (
            <Textarea
              value={data[field.name] || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              placeholder={field.placeholder}
              className="min-h-24 resize-none"
            />
          )}

          {field.type === "select" && (
            <select
              value={data[field.name] || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
            >
              <option value="">{field.placeholder || "Select..."}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          className="flex-1 h-10"
        >
          {isSubmitting ? <Loading /> : "Add Action"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
