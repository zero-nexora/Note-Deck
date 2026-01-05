"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Layers } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import clsx from "clsx";
import { useState } from "react";
import { SignInInput } from "@/domain/schemas/auth.schema";

export const SignInForm = () => {
  const {
    signInCredentials,
    signInPending,
    signInGoogle,
    googlePending,
    signInGithub,
    githubPending,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = signInPending || googlePending || githubPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input: SignInInput = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    signInCredentials(input);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">Flowboard</span>
        </Link>

        <div
          className={clsx(
            "bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 transition-opacity",
            isLoading && "opacity-60 pointer-events-none"
          )}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue to Flowboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isLoading} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 bg-background border-border focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="h-12 pr-10 bg-background border-border focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
              >
                {signInPending ? "Signing in..." : "Sign In"}
              </Button>
            </fieldset>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/80 px-2 text-muted-foreground backdrop-blur-sm">
                Or
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={signInGoogle}
              disabled={isLoading}
            >
              {googlePending ? "Signing in..." : "Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={signInGithub}
              disabled={isLoading}
            >
              {githubPending ? "Signing in..." : "GitHub"}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
