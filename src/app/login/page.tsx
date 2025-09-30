"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-140 p-6 flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-140 flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
        </div>
        <div className="m-8 space-y-6">
          <Button onClick={() => signIn("github")} className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
          <h3 className="mt-6 mb-3 text-center text-xl font-semibold text-foreground">
            Why do I need to sign in?
          </h3>
          <p className="text-center text-muted-foreground">
            Signing in is required to authenticate with GitHub and access
            personalized dashboard features for viewing and managing issues and
            pull requests.
          </p>
          <h3 className="mt-8 mb-3 text-center text-xl font-semibold text-foreground">
            Is it secure?
          </h3>
          <p className="text-center text-muted-foreground">
            Yes, logging in with GitHub is perfectly safe. It uses OAuth
            authentication, a standard and secure method, and no passwords or
            data from GitHub are stored on this site.
          </p>
        </div>
      </div>
    </div>
  );
}
