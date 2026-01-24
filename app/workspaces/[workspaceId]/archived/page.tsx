import { Archive } from "lucide-react";

const ArchivePage = async () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Archive className="h-8 w-8 text-primary" />
          Archived Items
        </h1>
        <p className="text-muted-foreground">
          View and restore archived boards and cards in this workspace.
        </p>
      </div>
    </div>
  );
};

export default ArchivePage;
