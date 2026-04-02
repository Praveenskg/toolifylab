import TimerTools from "@/components/tools/countdown-stopwatch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.SITE_URL || "https://tools.praveensingh.online";

export default function TimersToolsPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Timers
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg">
                Track time with countdown and stopwatch features
              </p>
            </div>
            <div className="my-4 flex w-full justify-center sm:my-6 sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Card className="border-border border shadow-md">
              <CardContent className="p-4 sm:p-6">
                <TimerTools />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Timers Tools - Countdown, Stopwatch & Pomodoro | tools.praveensingh.online",
  description:
    "Use free and reliable timer tools including countdown timer, stopwatch, and Pomodoro timer. Perfect for productivity, workouts, cooking, and time management.",
  keywords: [
    "timer",
    "countdown timer",
    "online stopwatch",
    "pomodoro timer",
    "focus timer",
    "online timer tools",
    "timers for productivity",
    "study timer",
    "tools.praveensingh.online",
    "workout timer",
  ],
  alternates: {
    canonical: `${SITE_URL}/timers-tools`,
  },
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Timers Tools - Countdown, Stopwatch & Pomodoro",
    description:
      "Free online tools to measure and manage time effectively: countdown, stopwatch, Pomodoro timer, and more.",
    url: `${SITE_URL}/timers-tools`,
    siteName: "ToolifyLab",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Timers Tools - tools.praveensingh.online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timers Tools - Countdown, Stopwatch & Pomodoro",
    description:
      "Track time easily with our timer tools including countdowns, stopwatch, and Pomodoro focus sessions. Free and user-friendly.",
    creator: "@its_praveen_s",
    images: ["/og-image.png"],
  },
};
