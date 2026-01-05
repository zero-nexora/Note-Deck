"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";
import { CheckCircle, Sparkles } from "lucide-react";
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
        colors: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <div className="relative rounded-full bg-primary/10 p-8 border-2 border-primary/30">
              <CheckCircle className="w-20 h-20 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-foreground">
              Payment Successful!
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-base text-muted-foreground">
            Your subscription has been activated successfully.
          </p>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground font-medium">
              Thank you for upgrading! You now have access to all premium
              features.
            </p>
          </div>
        </div>

        <Button
          onClick={() => router.replace(`/workspaces/${workspaceId}`)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          size="lg"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
