"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const CancelPage = () => {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const workspaceId = params.workspaceId;

  return (
    <div className="flex items-center justify-center p-6 bg-background">
      <div className="text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-8 border-2 border-destructive/20">
            <XCircle className="w-20 h-20 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            Payment Cancelled
          </h1>
          <p className="text-base text-muted-foreground">
            Your payment was cancelled and no charges were made.
          </p>
          <p className="text-sm text-muted-foreground">
            Don&apos;t worry, you can try again anytime you&apos;re ready.
          </p>
        </div>

        <Button
          onClick={() => router.replace(`/workspaces/${workspaceId}`)}
          variant="default"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          size="lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CancelPage;
