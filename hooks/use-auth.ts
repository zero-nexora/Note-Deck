"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { signUpAction } from "@/app/actions/auth.action";
import { ActionResult } from "@/lib/response";
import { SignInInput, SignUpInput } from "@/domain/schemas/auth.schema";
import { User } from "@/domain/types/user.type";

export function useAuth() {
  const router = useRouter();

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const [signUpState, setSignUpState] = useState<ActionResult<User>>({
    success: false,
    message: "",
  });

  const signUp = async (input: SignUpInput) => {
    setSignUpLoading(true);
    try {
      const result = await signUpAction(input);
      setSignUpState(result);
    } finally {
      setSignUpLoading(false);
    }
  };

  useEffect(() => {
    if (!signUpState.message) return;

    if (signUpState.success) {
      toast.success(signUpState.message);
      router.push("/sign-in");
    } else {
      toast.error(signUpState.message);
    }
  }, [signUpState, router]);

  const signInCredentials = async (input: SignInInput) => {
    setSignInLoading(true);
    try {
      const res = await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }
      router.push("/workspaces");
    } finally {
      setSignInLoading(false);
    }
  };

  const signInGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/workspaces" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const signInGithub = async () => {
    setGithubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/workspaces" });
    } finally {
      setGithubLoading(false);
    }
  };

  return {
    signUp,
    signUpPending: signUpLoading,
    signInCredentials,
    signInPending: signInLoading,
    signInGoogle,
    googlePending: googleLoading,
    signInGithub,
    githubPending: githubLoading,
  };
}
