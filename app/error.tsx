"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // Log the error to an error reporting service (e.g., Sentry)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

      {/* Decorative gradient blob (Red tint for error) */}
      <div className="absolute size-[500px] bg-destructive/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col items-center text-center max-w-md animate-in fade-in-50 zoom-in-95 duration-500">
        {/* Icon Container */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
          <div className="relative bg-background border size-20 rounded-2xl flex items-center justify-center shadow-sm">
            <AlertTriangle className="size-10 text-destructive" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6 text-base">
          We encountered an unexpected error while processing your request. Our
          team has been notified.
        </p>

        {/* Error Digest (Optional: Good for support tickets) */}
        {error.digest && (
          <div className="mb-8 bg-muted/50 px-3 py-1.5 rounded-md border border-border/50">
            <code className="text-xs font-mono text-muted-foreground">
              Error ID: {error.digest}
            </code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button onClick={reset} className="gap-2 w-full sm:w-auto shadow-md">
            <RefreshCw className="size-4" />
            Try Again
          </Button>

          <Button variant="outline" asChild className="gap-2 w-full sm:w-auto">
            <Link href="/">
              <Home className="size-4" />
              Revo Home
            </Link>
          </Button>
        </div>

        {/* Footer / Brand */}
        <div className="mt-12">
          <span className="text-xs font-medium text-muted-foreground/50 uppercase tracking-widest">
            Revo System Alert
          </span>
        </div>
      </div>
    </div>
  );
}
