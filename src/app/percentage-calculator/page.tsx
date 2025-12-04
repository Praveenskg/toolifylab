import PercentageCalculator from "@/components/tools/percentage-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function PercentageCalculatorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Percentage Calculator
              </h1>
              <p className="text-muted-foreground text-lg">
                Calculate percentages, increase, and decrease
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
                <PercentageCalculator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Percentage Calculator",
  description:
    "Quickly calculate percentages, percentage increase or decrease, and more. A free, easy-to-use percentage calculator for everyday math.",
  keywords: [
    "percentage calculator",
    "calculate percentage",
    "percentage increase",
    "percentage decrease",
    "percent math",
    "online percentage calculator",
    "smart tools",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/percentage-calculator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "utilities",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Percentage Calculator | ToolifyLab",
    description:
      "Free online percentage calculator to find percent of a number, increase or decrease values, and more.",
    url: "https://tools.praveensingh.online/percentage-calculator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/percentage-calculator.png",
        width: 1200,
        height: 630,
        alt: "Percentage Calculator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator | ToolifyLab",
    description:
      "Calculate percentage of values, increases, decreases and more — with this free, simple online tool.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/percentage-calculator.png"],
  },
};
