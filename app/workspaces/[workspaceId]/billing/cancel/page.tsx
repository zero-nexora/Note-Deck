"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const CancelPage = () => {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const workspaceId = params.workspaceId;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was cancelled and no charges were made.
          </p>
          <p className="text-sm text-muted-foreground">
            Don&apos;t worry, you can try again anytime you&apos;re ready.
          </p>
        </div>

        <Button
          onClick={() => router.replace(`/workspaces/${workspaceId}`)}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CancelPage;
