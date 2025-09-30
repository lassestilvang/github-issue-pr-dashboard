"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-foreground">GitHub Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {status === "loading" ? (
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <a
                  href={`https://github.com/${session.user?.login || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar>
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-muted-foreground">{session.user?.name}</span>
                </a>
                <Button onClick={() => signOut()} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn("github")} size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}