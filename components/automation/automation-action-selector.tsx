import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Plus, X } from "lucide-react";
import { ACTION_CATEGORIES, ActionOption } from "@/lib/automation";
import { ActionConfigForm } from "./automation-action-config-form";

interface ActionSelectorProps {
  actions: ActionOption[];
  onSelect: (action: ActionOption, data: Record<string, any>) => void;
}

export const ActionSelector = ({ actions, onSelect }: ActionSelectorProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionOption | null>(
    null
  );

  const handleSelectAction = (action: ActionOption) => {
    if (action.fields && action.fields.length > 0) {
      setSelectedAction(action);
    } else {
      onSelect(action, {});
    }
  };

  const handleSubmitConfig = (data: Record<string, any>) => {
    if (selectedAction) {
      onSelect(selectedAction, data);
      setSelectedAction(null);
    }
  };

  const handleCancelConfig = () => {
    setSelectedAction(null);
  };

  return (
    <>
      <ActionSelectorContent actions={actions} onSelect={handleSelectAction} />
      {selectedAction && (
        <div className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
          <h4 className="font-semibold text-sm text-foreground mb-3">
            Configure {selectedAction.name}
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            {selectedAction.description}
          </p>
          <ActionConfigForm
            action={selectedAction}
            onSubmit={handleSubmitConfig}
            onCancel={handleCancelConfig}
          />
        </div>
      )}
    </>
  );
};

const ActionSelectorContent = ({
  actions,
  onSelect,
}: {
  actions: ActionOption[];
  onSelect: (action: ActionOption) => void;
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      search === "" ||
      action.name.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        className="w-full h-10 border-dashed hover:bg-primary/5 hover:border-primary/50"
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Add Action
      </Button>
    );
  }

  return (
    <div className="space-y-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground">
          Select an action
        </h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsExpanded(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search actions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10 text-xs"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {ACTION_CATEGORIES.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10 text-xs"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.icon} {category.label}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        {filteredActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action)}
            className="w-full flex items-start gap-3 p-2.5 rounded-lg border border-border bg-background hover:bg-secondary/50 hover:border-primary/30 transition-all text-left"
          >
            <span className="text-xl shrink-0">{action.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground leading-tight">
                {action.name}
              </p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredActions.length === 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          No actions found
        </p>
      )}
    </div>
  );
};
