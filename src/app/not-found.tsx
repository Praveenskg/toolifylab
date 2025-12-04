import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-1 animate-pulse rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-xl"></div>
        <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
          <Ghost className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      <h1 className="text-foreground animate-fade-in-up text-3xl font-bold tracking-tight sm:text-4xl">
        Oops! Page Not Found
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        Looks like you’ve stumbled into the unknown. Don’t worry, we’ll guide you back.
      </p>

      <div className="mt-6">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="group transition-all duration-200">
            <ArrowBigLeft className="mr-2 h-6 w-6 transform transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const metadata = {
  title: "404 – Not Found",
};
