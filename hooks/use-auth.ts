"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { signUpAction } from "@/domain/actions/auth.action";
import { SignInInput, SignUpInput } from "@/domain/schemas/auth.schema";

export function useAuth() {
  const router = useRouter();

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const signUp = async (input: SignUpInput) => {
    setSignUpLoading(true);
    try {
      const result = await signUpAction(input);
      if (result.success) {
        toast.success(result.message);
        router.push("/sign-in");
      } else {
        toast.error(result.message);
      }
    } finally {
      setSignUpLoading(false);
    }
  };

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
