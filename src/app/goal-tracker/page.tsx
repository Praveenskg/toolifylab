import GoalTracker from "@/components/tools/goal-tracker";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GoalTrackerPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Goal Tracker
              </h1>
              <p className="text-muted-foreground text-lg">
                Plan and monitor your savings journey toward financial goals
              </p>
            </div>
            <div className="my-4 flex w-full justify-center sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Card className="border-border border shadow-md">
              <CardContent className="p-6">
                <GoalTracker />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  metadataBase: new URL("https://tools.praveensingh.online"),
  title: "Goal Tracker – Financial Savings Planner | Tools by Praveen Singh",
  description:
    "Track and plan your savings journey effectively with the Goal Tracker tool. Set targets, monitor progress, and achieve your financial goals with ease.",
  keywords: [
    "goal tracker",
    "savings planner",
    "financial goals",
    "goal tracking tool",
    "goal setting",
    "money saving tracker",
    "budget planner",
    "budgeting tools",
    "financial planning calculator",
    "personal finance",
    "tools.praveensingh.online",
  ],
  authors: [
    {
      name: "Praveen Singh",
      url: "https://praveensingh.online",
    },
  ],
  creator: "Praveen Singh",
  publisher: "Praveen Singh",
  category: "Finance",
  alternates: {
    canonical: "https://tools.praveensingh.online/goal-tracker",
  },
  openGraph: {
    title: "Goal Tracker – Financial Savings Planner",
    description:
      "Easily track your financial goals and monitor savings progress with this simple yet powerful Goal Tracker.",
    url: "https://tools.praveensingh.online/goal-tracker",
    siteName: "Tools by Praveen Singh",
    type: "website",
    images: [
      {
        url: "https://tools.praveensingh.online/og/goal-tracker.png",
        width: 1200,
        height: 630,
        alt: "Goal Tracker – Financial Savings Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goal Tracker – Financial Savings Planner",
    description:
      "Plan your financial goals and track your savings effectively using our Goal Tracker tool.",
    creator: "@praveensinghdev",
    images: ["https://tools.praveensingh.online/og/goal-tracker.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};
