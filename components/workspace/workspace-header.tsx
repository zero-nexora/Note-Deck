"use client";
import { Sparkles } from "lucide-react";

export function WorkspaceHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">WorkFlow Pro</span>
      </div>

      <h1 className="text-4xl font-bold text-foreground">Choose a workspace</h1>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Select a workspace to continue, or create a new one.
      </p>
    </div>
  );
}
