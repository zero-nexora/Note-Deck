import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search } from "lucide-react";
import { TRIGGER_CATEGORIES, TriggerOption } from "@/lib/automation";

interface TriggerSelectorProps {
  triggers: TriggerOption[];
  onSelect: (trigger: TriggerOption) => void;
}

export const TriggerSelector = ({
  triggers,
  onSelect,
}: TriggerSelectorProps) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTriggers = triggers.filter((trigger) => {
    const matchesSearch =
      search === "" ||
      trigger.name.toLowerCase().includes(search.toLowerCase()) ||
      trigger.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || trigger.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search triggers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {TRIGGER_CATEGORIES.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon /> {category.label}
          </Badge>
        ))}
      </div>

      {/* Triggers List */}
      <div className="space-y-2">
        {filteredTriggers.map((trigger) => (
          <button
            key={trigger.id}
            onClick={() => onSelect(trigger)}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all text-left"
          >
            <trigger.icon />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground leading-tight">
                {trigger.name}
              </p>
              <p className="text-xs text-muted-foreground leading-tight mt-1">
                {trigger.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredTriggers.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No triggers found
        </p>
      )}
    </div>
  );
};
