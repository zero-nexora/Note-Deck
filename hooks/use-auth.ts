"use client";

import { authAction } from "@/app/actions/auth.action";
import { ActionResult } from "@/lib/response";
import { useActionState } from "react";

export function useAuth() {
  const [signInState, signInAction, signInPending] =
    useActionState<ActionResult, FormData>(
      async (_, formData) => {
        return await authAction.signIn(formData);
      },
      {
        success: false,
        message: "",
      }
    );

  const [signUpState, signUpAction, signUpPending] =
    useActionState<ActionResult, FormData>(
      async (_, formData) => {
        return await authAction.signUp(formData);
      },
      {
        success: false,
        message: "",
      }
    );

  return {
    signInState,
    signInAction,
    signInPending,

    signUpState,
    signUpAction,
    signUpPending,
  };
}
