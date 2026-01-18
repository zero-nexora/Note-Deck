"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStripe } from "@/hooks/use-stripe";

const SuccessPage = () => {
  const params = useParams<{ workspaceId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkCheckoutSession } = useStripe();

  const workspaceId = params.workspaceId;
  const sessionId = searchParams.get("session_id");

  const [valid, setValid] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.replace(`/workspaces/${workspaceId}`);
      return;
    }

    checkCheckoutSession(sessionId).then((isValid) => {
      if (!isValid) {
        router.replace(`/workspaces/${workspaceId}`);
        return;
      }

      setValid(true);
      setChecked(true);
    });
  }, [sessionId]);

  useEffect(() => {
    if (!valid) return;

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
  }, [valid]);

  if (!checked) return null;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-primary" />

        <h1 className="text-2xl font-semibold">Payment successful</h1>

        <p className="text-sm text-muted-foreground">
          Your subscription has been activated.
        </p>

        <Button onClick={() => router.replace(`/workspaces/${workspaceId}/overview`)}>
          Go to workspace
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
