import AreaCalculator from "@/components/tools/area-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function AreaCalculatorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Area Calculator
              </h1>
              <p className="text-muted-foreground text-lg">
                Calculate area of various geometric shapes
              </p>
            </div>

            <div className="my-4 flex w-full justify-center sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full" aria-label="Go back to home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <Card className="border-border border shadow-md">
              <CardContent className="p-6">
                <AreaCalculator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Area Calculator",
  description:
    "Calculate the area of different geometric shapes like square, circle, triangle and more — instantly and for free.",
  keywords: [
    "area calculator",
    "geometry calculator",
    "shape area calculator",
    "online calculator",
    "smart tools",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/area-calculator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "utilities",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Area Calculator | ToolifyLab",
    description:
      "Instantly calculate the area of shapes like circles, triangles, and rectangles online for free.",
    url: "https://tools.praveensingh.online/area-calculator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/area-calculator.png",
        width: 1200,
        height: 630,
        alt: "Area Calculator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Area Calculator | ToolifyLab",
    description: "Calculate the area of different geometric shapes online with ease and accuracy.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/area-calculator.png"],
  },
};
