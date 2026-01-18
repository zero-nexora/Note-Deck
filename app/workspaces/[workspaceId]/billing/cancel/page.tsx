"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const CancelPage = () => {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const workspaceId = params.workspaceId;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6">
        <XCircle className="mx-auto h-16 w-16 text-destructive" />

        <h1 className="text-2xl font-semibold">Payment cancelled</h1>

        <p className="text-sm text-muted-foreground">
          Your payment was cancelled. No charges were made.
        </p>

        <Button onClick={() => router.replace(`/workspaces/${workspaceId}/overview`)}>
          Back to workspace
        </Button>
      </div>
    </div>
  );
};

export default CancelPage;
