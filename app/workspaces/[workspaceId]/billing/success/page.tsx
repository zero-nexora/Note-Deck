"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const SuccessPage = () => {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();

  const workspaceId = params.workspaceId;

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your subscription has been activated successfully.
          </p>
          <p className="text-sm text-muted-foreground">
            Thank you for upgrading! You now have access to all premium
            features.
          </p>
        </div>

        <Button
          onClick={() => router.replace(`/workspaces/${workspaceId}`)}
          className="w-full"
          size="lg"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
