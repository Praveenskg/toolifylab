import GSTCalculator from "@/components/tools/gst-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GSTCalculatorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                GST Calculator
              </h1>
              <p className="text-muted-foreground text-lg">
                Easily compute GST amounts, reverse GST, and inclusive/exclusive tax totals
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
                <GSTCalculator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "GST Calculator - Compute GST Easily | Tools by Praveen Singh",
  description:
    "Use this free GST calculator to compute Goods and Services Tax, reverse GST, and inclusive or exclusive GST amounts accurately.",
  keywords: [
    "GST calculator",
    "Goods and Services Tax",
    "Reverse GST",
    "Inclusive GST",
    "Exclusive GST",
    "GST tax tool",
    "online GST calculator",
    "gst calculator india",
    "gst tool",
  ],
  openGraph: {
    title: "GST Calculator - Compute GST Easily | Tools by Praveen Singh",
    description:
      "Instantly calculate GST with inclusive and exclusive options. Perfect for businesses and individuals in India.",
    url: "https://tools.praveensingh.online/tools/gst-calculator",
    siteName: "Tools by Praveen Singh",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://tools.praveensingh.online/og/gst-calculator.png",
        width: 1200,
        height: 630,
        alt: "GST Calculator OpenGraph Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Calculator - Compute GST Easily | Tools by Praveen Singh",
    description:
      "Instantly calculate GST with inclusive and exclusive options. Perfect for businesses and individuals in India.",
    images: ["https://tools.praveensingh.online/og/gst-calculator.png"],
  },
};
