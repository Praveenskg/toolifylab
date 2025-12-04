import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Sparkles } from "lucide-react";

export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-3 w-3 sm:h-4 sm:w-4",
    default: "h-5 w-5 sm:h-6 sm:w-6",
    lg: "h-6 w-6 sm:h-8 sm:w-8",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
    </div>
  );
}

export function LoadingCard() {
  return (
    <Card className="w-full">
      <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-8 w-8 rounded-lg sm:h-10 sm:w-10" />
          <div className="flex-1 space-y-1 sm:space-y-2">
            <Skeleton className="h-3 w-3/4 sm:h-4" />
            <Skeleton className="h-2 w-1/2 sm:h-3" />
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <Skeleton className="h-3 w-full sm:h-4" />
          <Skeleton className="h-3 w-5/6 sm:h-4" />
          <Skeleton className="h-3 w-4/6 sm:h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 sm:h-10" />
          <Skeleton className="h-8 w-16 sm:h-10 sm:w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="group cursor-pointer">
          <CardContent className="space-y-2 p-3 sm:space-y-3 sm:p-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-8 w-8 rounded-lg sm:h-10 sm:w-10" />
              <Skeleton className="h-4 w-12 sm:h-5 sm:w-16" />
            </div>
            <Skeleton className="h-4 w-3/4 sm:h-5" />
            <div className="space-y-1 sm:space-y-2">
              <Skeleton className="h-2 w-full sm:h-3" />
              <Skeleton className="h-2 w-5/6 sm:h-3" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
              <Skeleton className="h-6 w-12 sm:h-8 sm:w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="space-y-3 text-center sm:space-y-4">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Sparkles className="text-primary h-6 w-6 animate-pulse sm:h-8 sm:w-8" />
          <h1 className="text-primary text-xl font-bold sm:text-2xl">ToolifyLab</h1>
          <Sparkles
            className="text-primary h-6 w-6 animate-pulse sm:h-8 sm:w-8"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground text-sm sm:text-base">Loading your tools...</p>
      </div>
    </div>
  );
}
