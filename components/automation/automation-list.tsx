import { AutomationListItem } from "./automation-item";

interface AutomationListProps {
  automations: any[];
}

export const AutomationList = ({ automations }: AutomationListProps) => (
  <div className="divide-y divide-border">
    {automations.map((a) => (
      <AutomationListItem key={a.id} automation={a} />
    ))}
  </div>
);
